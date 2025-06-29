import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";
import { useAuth } from "../../Lib/Context/AuthContext";
import { FaUser, FaGoogle } from "react-icons/fa6";
import { getUserDataByFirebaseUID } from "../../services/AuthService";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { i18n } = useTranslation();
  const [profile, setProfile] = useState({
    id: "",
    first_name: "",
    last_name: "",
    phone: "Not set",
    date_of_birth: "Not specified",
    image: "",
    addresses: { city: "", area: "", street: "", location: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");

      try {
        if (currentUser?.uid) {
          // Check if user is authenticated with Google
          const isGoogle = currentUser.providerData?.[0]?.providerId === "google.com";
          setIsGoogleUser(isGoogle);
          
          const result = await getUserDataByFirebaseUID(currentUser.uid);
          if (result.success) {
            const address = result.userData.addresses?.[0] || {
              city: "", area: "", street: "", location: ""
            };

            // Merge Supabase data with Firebase auth data
            const mergedData = {
              id: result.userData.id || currentUser.uid || "",
              first_name: result.userData.first_name || 
                (currentUser.displayName?.split(' ')[0] || "No Name Set"),
              last_name: result.userData.last_name || 
                (currentUser.displayName?.split(' ').slice(1).join(' ') || "No Name Set"),
              phone: result.userData.phone || "Not set",
              date_of_birth: result.userData.date_of_birth || "Not specified",
              image: result.userData.image || currentUser.photoURL || "",
              addresses: address,
              email: currentUser.email || result.userData.email || "No email set",
              // Store Google-specific properties if available
              googleData: isGoogle ? {
                email: currentUser.email,
                emailVerified: currentUser.emailVerified,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              } : null
            };

            setProfile(mergedData);
          } else {
            setError(result.error || "Failed to fetch profile data");
            
            // If Supabase data fetch fails but we have Google auth data, use that
            if (isGoogle) {
              setProfile({
                id: currentUser.uid || "",
                first_name: currentUser.displayName?.split(' ')[0] || "No Name Set",
                last_name: currentUser.displayName?.split(' ').slice(1).join(' ') || "",
                phone: "Not set",
                date_of_birth: "Not specified",
                image: currentUser.photoURL || "",
                email: currentUser.email || "No email set",
                addresses: { city: "", area: "", street: "", location: "" },
                googleData: {
                  email: currentUser.email,
                  emailVerified: currentUser.emailVerified,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                }
              });
              setError(""); // Clear error since we have fallback data
            }
          }
        }
      } catch (error) {
        setError("Error fetching profile data");
        console.error("Fetch error:", error);
        
        // Fallback to Google data if available
        if (currentUser && currentUser.providerData?.[0]?.providerId === "google.com") {
          setIsGoogleUser(true);
          setProfile({
            id: currentUser.uid || "",
            first_name: currentUser.displayName?.split(' ')[0] || "No Name Set",
            last_name: currentUser.displayName?.split(' ').slice(1).join(' ') || "",
            phone: "Not set",
            date_of_birth: "Not specified",
            image: currentUser.photoURL || "",
            email: currentUser.email || "No email set",
            addresses: { city: "", area: "", street: "", location: "" },
            googleData: {
              email: currentUser.email,
              emailVerified: currentUser.emailVerified,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            }
          });
          setError(""); // Clear error since we have fallback data
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const handleEdit = (section) => {
    setMessage(
      `Editing ${section} - This would connect to Supabase to update user data`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DNA width={90} height={90} ariaLabel="dna-loading" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="mb-4">You need to be logged in to view your profile.</p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData
        title="Profile Page"
        description="View your profile information"
        keywords="profile, user profile, google auth"
        author="Mohab Mohammed"
      />
      <div
        className="flex min-h-screen"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex-1 p-4 md:p-8 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            {isGoogleUser && (
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <FaGoogle className="text-blue-500 mr-2" />
                <span>Google Account Connected</span>
                {profile.googleData?.emailVerified && 
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>
                }
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
              {error}
              <button
                onClick={() => setError("")}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="bg-white rounded-md shadow mb-6">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-6">My Profile</h2>

              <div className="flex flex-col md:flex-row items-center mb-6">
                <div className="relative mb-4 md:mb-0 md:mr-6">
                  {profile.image ? (
                    <img
                      src={profile.image.startsWith("http") ? profile.image : `data:image/png;base64,${profile.image}`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = currentUser?.photoURL || "/default-profile.png";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-500" size={24} />
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-lg font-medium">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-[#11319E]">
                    {profile.addresses.area || "No Area is Set"}
                  </p>
                  <p className="text-gray-500">
                    {profile.addresses.location || "No location set"}
                  </p>
                  {isGoogleUser && (
                    <p className="text-gray-500">
                      {profile.email}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleEdit("profile")}
                  className="mt-4 md:mt-0 md:ml-auto flex items-center text-gray-500 hover:text-blue-600"
                >
                  <Pencil size={18} className="mr-1" />
                  Edit
                </button>
              </div>

              {/* Personal Information Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <button
                    onClick={() => handleEdit("personal")}
                    className="flex items-center text-gray-500 hover:text-blue-600"
                  >
                    <Pencil size={18} className="mr-1" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    { label: "First Name", value: profile.first_name },
                    { label: "Last Name", value: profile.last_name },
                    { label: "Phone", value: profile.phone },
                    { label: "Date of Birth", value: profile.date_of_birth },
                    { label: "Email", value: profile.email },
                    { label: "Login Method", value: currentUser.providerData?.[0]?.providerId.replace(".com", "") },
                  ].map((item, index) => (
                    <div key={index}>
                      <p className="text-gray-500 mb-2">{item.label}</p>
                      <p>{item.value || "Not specified"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Address</h3>
                  <button
                    onClick={() => handleEdit("address")}
                    className="flex items-center text-gray-500 hover:text-blue-600"
                  >
                    <Pencil size={18} className="mr-1" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "City", value: profile.addresses.city },
                    { label: "Area", value: profile.addresses.area },
                    { label: "Street", value: profile.addresses.street },
                    { label: "Location", value: profile.addresses.location },
                  ].map((item, index) => (
                    <div key={index}>
                      <p className="text-gray-500 mb-2">{item.label}</p>
                      <p>{item.value || "Not specified"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Account Information - Only shown for Google users */}
              {isGoogleUser && profile.googleData && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">Google Account Information</h3>
                      <FaGoogle className="ml-2 text-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Google Display Name", value: profile.googleData.displayName },
                      { label: "Google Email", value: profile.googleData.email },
                      { 
                        label: "Email Verification Status", 
                        value: profile.googleData.emailVerified ? "Verified" : "Not Verified",
                        badge: profile.googleData.emailVerified ? 
                          { text: "Verified", color: "green" } : 
                          { text: "Not Verified", color: "yellow" }
                      },
                    ].map((item, index) => (
                      <div key={index}>
                        <p className="text-gray-500 mb-2">{item.label}</p>
                        <div className="flex items-center">
                          <p>{item.value || "Not specified"}</p>
                          {item.badge && (
                            <span className={`ml-2 bg-${item.badge.color}-100 text-${item.badge.color}-800 px-2 py-1 rounded-full text-xs`}>
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-md mt-6">
              {message}
              <button
                onClick={() => setMessage("")}
                className="ml-4 text-blue-600 hover:text-blue-800"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;