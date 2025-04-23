import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage"; // Import storage functions at the top
import { supabase } from "../Config/Supabase";

/**
 * Registers a user with Firebase authentication and stores additional data in Supabase
 * @param {Object} auth - Firebase auth instance
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Result of the registration process
 */
export async function registerUser(auth, userData) {
  try {
    // Step 1: Register with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Upload profile image to Firebase Storage if provided
    let profileImageUrl = "";
    if (userData.profileImage) {
      try {
        // Use the imported storage functions instead of require
        const storage = getStorage();
        
        // Create a storage reference
        const storageRef = ref(storage, `ProfileImages/${user.uid}`);
        
        // Upload the image (assuming profileImage is a base64 string)
        await uploadString(storageRef, userData.profileImage, 'data_url');
        
        // Get the download URL
        profileImageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading profile image:", error);
        // Don't use the raw profileImage as fallback since it might be too long
        profileImageUrl = "";
      }
    }

    // Step 2: Update Firebase profile
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`,
      photoURL: profileImageUrl // Use the Firebase Storage URL which will be a proper length
    });

    // Step 3: Generate custom ID for Supabase
    const customId = generateCustomId();

    // Step 4: Store in Supabase Users table
    const { error: usersError } = await supabase
      .from("Users")
      .insert({
        id: customId,
        email: userData.email,
        uid: user.uid,
        first_name: userData.firstName,
        last_name: userData.lastName,
        gender: userData.gender,
        date_of_birth: userData.dateOfBirth,
        image: profileImageUrl || "", // Use the uploaded image URL
        phone: userData.phone,
        // Format addresses as a JSONB array with a single object
        addresses: [
          {
            city: userData.city || "",
            area: userData.area || "",
            street: userData.street || "",
            location: userData.location || ""
          }
        ]
      });

    if (usersError) {
      throw new Error(usersError.message);
    }

    // Step 5: Store in Supabase UsersInfo table
    const { error: usersInfoError } = await supabase
      .from("UsersInfo")
      .insert({
        id: customId,
        wight: userData.weight || "",
        blood_type: userData.bloodType || "",
        height: userData.height || "",
        history: userData.medicalHistory || ""
      });

    if (usersInfoError) {
      throw new Error(usersInfoError.message);
    }

    return {
      success: true,
      user: user,
      customId: customId,
      message: "Registration completed successfully"
    };

  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a custom patient ID
 * @returns {string} - Custom ID in format PAT-YYMMXXXX where YY is year, MM is month
 */
function generateCustomId() {
  const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of year
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // Get month as 2 digits (01-12)
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `PAT-${currentYear}${currentMonth}${randomNum}`;
}

/**
 * Store Google Auth user data in Supabase
 * @param {Object} googleUserData - User data from Google Authentication
 */
export async function storeGoogleUserInSupabase(googleUserData) {
  try {
    const { uid, displayName, email, photoURL } = googleUserData;
    
    // Split displayName into firstName and lastName
    const nameParts = displayName ? displayName.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Generate custom ID
    const customId = generateCustomId();
    
    // Check if user already exists in Supabase by uid
    const { data: existingUsersData, error: existingUserError } = await supabase
      .from("Users")
      .select("id")
      .eq("uid", uid);
      
    if (existingUserError) {
      console.error("Error checking for existing user:", existingUserError);
    }
    
    if (existingUsersData && existingUsersData.length > 0) {
      // User already exists, could update their information here if needed
      return {
        success: true,
        existingUser: true,
        userId: existingUsersData[0].id,
        message: "User already exists in database"
      };
    }
    
    // Verify photoURL isn't too long for Firebase (limit is 1024 chars)
    const safePhotoURL = photoURL && photoURL.length > 500 ? "" : photoURL || "";
    
    // Insert new user - format addresses as JSONB array
    const { error: usersError } = await supabase
      .from("Users")
      .insert({
        id: customId,
        email: email,
        uid: uid,
        first_name: firstName,
        last_name: lastName,
        image: safePhotoURL,
        gender: "",
        date_of_birth: "",
        phone: "",
        // Format addresses as a JSONB array with a single object
        addresses: [
          {
            city: "",
            area: "",
            street: "",
            location: ""
          }
        ]
      });
    
    if (usersError) {
      throw new Error(`Supabase Users insertion error: ${usersError.message}`);
    }
    
    // Insert into UsersInfo with default empty values
    const { error: usersInfoError } = await supabase
      .from("UsersInfo")
      .insert({
        id: customId,
        weight: "",
        blood_type: "",
        height: "",
        history: ""
      });
      
    if (usersInfoError) {
      throw new Error(`Supabase UsersInfo insertion error: ${usersInfoError.message}`);
    }
    
    return {
      success: true,
      userId: customId,
      message: "Google user successfully registered in Supabase"
    };
    
  } catch (error) {
    console.error("Error storing Google user in Supabase:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getUserDataByFirebaseUID(firebaseUid) {
  try {
    // Fetch user data by Firebase UID
    const { data: usersData, error: userError } = await supabase
      .from("Users")
      .select("*")
      .eq("uid", firebaseUid);
      
    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }
    
    if (!usersData || usersData.length === 0) {
      throw new Error("User not found");
    }

    // Use the first matching user if multiple exist
    const userData = usersData[0];
    
    // Fetch user medical info using the custom ID
    const { data: userInfoData, error: userInfoError } = await supabase
      .from("UsersInfo")
      .select("*")
      .eq("id", userData.id);
      
    if (userInfoError && !userInfoError.message.includes("No rows found")) {
      throw new Error(`Error fetching user info data: ${userInfoError.message}`);
    }
    
    // Combine the data
    const combinedUserData = {
      ...userData,
      medicalInfo: userInfoData || {}
    };
    
    return {
      success: true,
      userData: combinedUserData
    };
    
  } catch (error) {
    console.error("Error fetching user data by Firebase UID:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get reviews for a specific doctor
 * @param {string} doctorId - The doctor's ID
 * @returns {Promise<Object>} - Reviews data and status
 */
export async function getDoctorReviews(doctorId) {
  try {
    const { data: reviews, error } = await supabase
      .from('Reviews')
      .select(`
        id,
        created_at,
        review,
        rate,
        user_id,
        Users (
          first_name,
          last_name,
          image
        )
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      reviews: reviews || []
    };
  } catch (error) {
    console.error('Error fetching doctor reviews:', error);
    return {
      success: false,
      error: error.message,
      reviews: []  // Always return an empty array for consistent structure
    };
  }
}

/**
 * Create a new review for a doctor
 * @param {Object} reviewData - The review data
 * @returns {Promise<Object>} - Result of the review creation
 */
export async function createDoctorReview(reviewData) {
  try {
    console.log("Creating review with data:", reviewData);
    
    // First get the Supabase user ID using Firebase UID
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('uid', reviewData.userId)
      .single();

    if (userError) {
      throw new Error(`Failed to get user: ${userError.message}`);
    }

    if (!userData) {
      throw new Error('User not found');
    }

    const { data, error } = await supabase
      .from('Reviews')
      .insert({
        doctor_id: reviewData.doctorId,
        user_id: userData.id, // Using the Supabase user ID instead of Firebase UID
        review: reviewData.review,
        rate: reviewData.rate
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to create review: ${error.message}`);
    }

    // Update the doctor's average rating
    await updateDoctorRating(reviewData.doctorId);

    return {
      success: true,
      review: data
    };
  } catch (error) {
    console.error('Error creating review:', error);
    return {
      success: false,
      error: error.message || "Failed to create review"
    };
  }
}

/**
 * Update a doctor's average rating when a new review is added
 * @param {string} doctorId - The doctor's ID
 */
async function updateDoctorRating(doctorId) {
  try {
    // Get all reviews for this doctor
    const { data: reviews, error: reviewsError } = await supabase
      .from('Reviews')
      .select('rate')
      .eq('doctor_id', doctorId);
    
    if (reviewsError) throw reviewsError;
    
    // Calculate new average rating
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + (review.rate || 0), 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    
    // Update the doctor's rating
    const { error: updateError } = await supabase
      .from('Doctors')
      .update({
        rate: averageRating,
        rate_count: totalReviews
      })
      .eq('id', doctorId);
    
    if (updateError) throw updateError;
    
    console.log(`Updated doctor ${doctorId} rating to ${averageRating} (${totalReviews} reviews)`);
  } catch (error) {
    console.error('Error updating doctor rating:', error);
  }
}