import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

    // Truncate profile image if it's too long
    const truncatedProfileImage = userData.profileImage && userData.profileImage.length > 500 ? 
      userData.profileImage.substring(0, 500) : userData.profileImage || "";

    // Step 2: Update Firebase profile
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`,
      photoURL: truncatedProfileImage
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
        image: user.photoURL || truncatedProfileImage || "",
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
    
    // Truncate photoURL if it's too long (Firebase limit is 1024 chars)
    const truncatedPhotoURL = photoURL && photoURL.length > 500 ? 
      photoURL.substring(0, 500) : photoURL || "";
    
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
    
    // Insert new user - format addresses as JSONB array
    const { error: usersError } = await supabase
      .from("Users")
      .insert({
        id: customId,
        email: email,
        uid: uid,
        first_name: firstName,
        last_name: lastName,
        image: truncatedPhotoURL,
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