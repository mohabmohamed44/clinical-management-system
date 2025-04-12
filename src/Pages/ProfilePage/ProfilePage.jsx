import React, { useState, useEffect } from 'react';
import { supabase } from '../../Config/Supabase';
import { Pencil } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    first_name: 'Daryna',
    last_name: 'Ushatova',
    email: 'Daryna.Ushatova@gmail.com',
    phone: '(213) 555-1234',
    bio: 'Product Designer',
    country: 'United State of America',
    city_state: 'California,USA',
    location: 'Los Angeles, California, USA',
    avatar_url: `https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500`,
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user profile data from Supabase
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
          } else if (data) {
            setProfile({
              ...profile,
              ...data
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Comment out for now, uncomment when connected to actual Supabase
    // fetchProfile();
  }, []);

  const handleEdit = (section) => {
    // This would open an edit modal or redirect to edit page
    console.log(`Editing ${section}`);
    setMessage(`Editing ${section} - This would connect to Supabase to update user data`);
  };

  

  const ProfileSection = () => (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>
      
      <div className="bg-white rounded-md shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">My Profile</h2>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="text-gray-600">My Profile</div>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="relative mr-6">
              <img 
                src={profile.avatar_url || "api/placeholder/48/48"} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium">{profile.first_name} {profile.last_name}</h3>
              <p className="text-gray-500">{profile.location}</p>
            </div>
            
            <button 
              onClick={() => handleEdit('profile')}
              className="ml-auto flex items-center text-gray-500 hover:text-blue-600"
            >
              <Pencil size={18} className="mr-1" />
              Edit
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Personal information</h3>
              <button 
                onClick={() => handleEdit('personal')}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                <Pencil size={18} className="mr-1" />
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-500 mb-2">First Name</p>
                <p>{profile.first_name}</p>
              </div>
              
              <div>
                <p className="text-gray-500 mb-2">Last Name</p>
                <p>{profile.last_name}</p>
              </div>
              
              <div>
                <p className="text-gray-500 mb-2">Email address</p>
                <p>{profile.email}</p>
              </div>
              
              <div>
                <p className="text-gray-500 mb-2">Phone</p>
                <p>{profile.phone}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-gray-500 mb-2">Bio</p>
                <p>{profile.bio}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Address</h3>
              <button 
                onClick={() => handleEdit('address')}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                <Pencil size={18} className="mr-1" />
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 mb-2">Country</p>
                <p>{profile.country}</p>
              </div>
              
              <div>
                <p className="text-gray-500 mb-2">City/State</p>
                <p>{profile.city_state}</p>
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
            onClick={() => setMessage('')}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-md shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Security</h3>
          </div>
          
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md mb-4">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-gray-500 text-sm">Update your password regularly to keep your account secure</p>
            </div>
            <button 
              onClick={() => handleEdit('password')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Update
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md mb-4">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
            </div>
            <button 
              onClick={() => handleEdit('2fa')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Setup
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-gray-500 text-sm">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => handleEdit('delete')}
              className="border border-red-600 text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <ProfileSection />
    </div>
  );
};

export default ProfilePage;