import React, { useState, useEffect } from "react";
import { supabase } from "../../Config/Supabase";
import { Pencil } from "lucide-react";
import { DNA } from "react-loader-spinner";
import MetaData from "../../Components/MetaData/MetaData";
import { useAuth } from "../../Lib/Context/AuthContext";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    city_state: "",
    location: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Set initial profile data from Firebase Auth
    if (currentUser) {
      setProfile({
        ...profile,
        first_name: currentUser.displayName ? currentUser.displayName.split(' ')[0] : "",
        last_name: currentUser.displayName ? currentUser.displayName.split(' ').slice(1).join(' ') : "",
        email: currentUser.email || "",
        avatar_url: currentUser.photoURL || FaUser,
      });
    }

    // Fetch additional profile data from Supabase
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.uid)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (data) {
            // Merge Firebase auth data with Supabase profile data
            // Priority given to Firebase auth data for email and name
            setProfile(prevProfile => ({
              ...prevProfile,
              phone: data.phone || "(Not set)",
              bio: data.bio || "No bio available",
              country: data.country || "Not specified",
              city_state: data.city_state || "Not specified",
              location: data.location || "Not specified",
            }));
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Comment out for now, uncomment when connected to actual Supabase
    // fetchProfile();
    
    // For demo purposes, set loading to false after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleEdit = (section) => {
    // This would open an edit modal or redirect to edit page
    console.log(`Editing ${section}`);
    setMessage(
      `Editing ${section} - This would connect to Supabase to update user data`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-8">
          <DNA width={90} height={90} ariaLabel="dna-loading" />
        </div>
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

  const ProfileSection = () => (
    <div className="flex-1 p-4 md:p-8 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="bg-white rounded-md shadow mb-6">
        <div className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-6">My Profile</h2>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="text-gray-600">My Profile</div>
          </div>

          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img
                src={profile.avatar_url || "/api/placeholder/48/48"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium">
                {currentUser.displayName || "No Name Set"}
              </h3>
              <p className="text-gray-500">{profile.location}</p>
            </div>

            <button
              onClick={() => handleEdit("profile")}
              className="mt-4 md:mt-0 md:ml-auto flex items-center text-gray-500 hover:text-blue-600"
            >
              <Pencil size={18} className="mr-1" />
              Edit
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Personal information</h3>
              <button
                onClick={() => handleEdit("personal")}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                <Pencil size={18} className="mr-1" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-500 mb-2">First Name</p>
                <p>{profile.first_name || "Not set"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Last Name</p>
                <p>{profile.last_name || "Not set"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Email address</p>
                <p>{currentUser.email || "No email available"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Phone</p>
                <p>{profile.phone || "Not set"}</p>
              </div>

              <div className="col-span-1 md:col-span-2">
                <p className="text-gray-500 mb-2">Appointments</p>
                <p>
                  <Link to="/appointments" className="text-blue-600 hover:text-blue-800 transition-colors ">Appointments</Link>
                </p>
              </div>
            </div>
          </div>

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
              <div>
                <p className="text-gray-500 mb-2">Country</p>
                <p>{profile.country || "Not specified"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">City/State</p>
                <p>{profile.city_state || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification for edit actions */}
      {message && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-6">
          {message}
          <button
            onClick={() => setMessage("")}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-md shadow">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Security</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-md mb-4">
            <div className="mb-3 md:mb-0">
              <p className="font-medium">Change Password</p>
              <p className="text-gray-500 text-sm">
                Update your password regularly to keep your account secure
              </p>
            </div>
            <button
              onClick={() => handleEdit("password")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto"
            >
              Update
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-md">
            <div className="mb-3 md:mb-0">
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-gray-500 text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => handleEdit("delete")}
              className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 w-full md:w-auto"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MetaData 
        title="Profile Page"
        description="Manage your profile and account settings"
        keywords="profile, settings, account management, user profile"
        author="Mohab Mohammed"
      />
      <div className="flex min-h-screen">
        <ProfileSection />
      </div>
    </>
  );
};

export default ProfilePage;