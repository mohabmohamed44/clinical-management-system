import { FacebookAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../Config/FirebaseConfig";

const provider = new FacebookAuthProvider();
// You can add scopes if needed
provider.addScope('email');
provider.addScope('public_profile');

export const signInWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        
        // Get the user
        const user = result.user;

        // Facebook Access Token
        const credentials = FacebookAuthProvider.credentialFromResult(result);
        const token = credentials?.accessToken;

        // Get Firebase ID token
        const idToken = await user.getIdToken();
        
        // success message
        toast.success("Facebook sign in Successful");

        return {
            user,
            facebookToken: token,
            idToken: idToken
        };
    } catch(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
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
        toast.success('Signed out successfully');
    } catch(error) {
        toast.error('Sign out failed');
        throw error;
    }
};

// helper function to check if user is currently logged in
export const getCurrentUser = () => {
    return auth.currentUser;
};