import { app } from "../Config/FirebaseConfig";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import toast from "react-hot-toast";

export const emailAndPasswordSign = async (email, password) => {
    try {
        const auth = getAuth(app);
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Get the ID token for consistent behavior with social logins
        const idToken = await user.getIdToken();
        
        console.log('Email/password sign in successful');
        toast.success('Sign in successful');

        return {
            user,
            idToken
        };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.log('Sign in failed:', errorMessage, errorCode);
        
        // Provide more user-friendly error messages
        if (errorCode === 'auth/user-not-found') {
            toast.error('User not found. Please check your email address.');
        } else if (errorCode === 'auth/wrong-password') {
            toast.error('Incorrect password. Please try again.');
        } else if (errorCode === 'auth/invalid-credential') {
            toast.error('Invalid login credentials. Please try again.');
        } else if (errorCode === 'auth/too-many-requests') {
            toast.error('Too many failed login attempts. Please try again later.');
        } else {
            toast.error(`Sign in failed: ${errorMessage}`, {
                duration: 2000,
                position: 'top-center',
            });
        }
        
        throw error;
    }
};