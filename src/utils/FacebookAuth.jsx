import { FacebookAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../Config/FirebaseConfig";

// Get Facebook App ID from environment variables
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = import.meta.env.VITE_FACEBOOK_APP_SECRET;

// Initialize Facebook provider with the App ID
const provider = new FacebookAuthProvider();
// You can configure the provider with custom parameters if needed
provider.setCustomParameters({
  'app_id': FACEBOOK_APP_ID,
  'app_secret': FACEBOOK_APP_SECRET
});

export const signInWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        
        // Get the user
        const user = result.user;

        // Facebook Access Token
        const credentials = FacebookAuthProvider.credentialFromResult(result);
        const token = credentials?.accessToken;

        // Get Firebase ID token (important for authentication with your backend)
        const idToken = await user.getIdToken();
        
        // success message if user logs in
        console.log('Facebook sign in Successful');
        toast.success("Facebook sign in Successful");

        return {
            user,
            facebookToken: token,
            idToken: idToken
        };
    } catch(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // the Auth credential type that was used
        const credential = FacebookAuthProvider.credentialFromError(error);
        // error message if user fails to log in
        console.log('Facebook Sign in failed', errorMessage, errorCode);
        toast.error('Facebook sign in Failed', {
            duration: 2000,
            position: 'top-center',
        });
        throw error;
    }
};

// sign out function
export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log('Sign out successful');
        toast.success('Signed out successfully');
    } catch(error) {
        console.error('Sign out error:', error);
        toast.error('Sign out failed');
        throw error;
    }
};

// helper function to check if user is currently logged in
export const getCurrentUser = () => {
    return auth.currentUser;
};