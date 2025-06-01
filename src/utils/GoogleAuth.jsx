import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../Config/FirebaseConfig';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        // Get the user
        const user = result.user;

        // Google Access Token
        const credentials = GoogleAuthProvider.credentialFromResult(result);
        const token = credentials?.accessToken;
        
        // Get Firebase ID token (important for authentication with your backend)
        const idToken = await user.getIdToken();
        
        // success message if user logs in 
        toast.success('Google sign in Successful');
        
        // Return user and tokens for cookie storage
        return {
            user,
            googleToken: token,
            idToken: idToken
        };
    } catch(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // the Auth credential type was used
        const credential = GoogleAuthProvider.credentialFromError(error);
        // error message if user fails to log in
        toast.error('Google sign in Failed', {
            duration: 2000,
            position: 'top-center',
        });
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
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