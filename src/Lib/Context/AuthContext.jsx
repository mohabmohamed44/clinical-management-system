import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../Config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { signOutUser } from '../../utils/GoogleAuth';
import useCookies from '../../hooks/useCookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize cookies
  const [userCookie, setUserCookie, removeUserCookie] = useCookies('user', null, { 
    expires: 7,
    path: '/'
  });
  
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies('authToken', null, {
    expires: 7,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      removeUserCookie();
      removeTokenCookie();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Update current user state
        setCurrentUser(user);
        
        // Get fresh ID token
        const idToken = await user.getIdToken();
        
        // Update cookies with user data
        setUserCookie({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
        
        // Update token cookie
        setTokenCookie(idToken);
      } else {
        // Clear user state and cookies on logout
        setCurrentUser(null);
        removeUserCookie();
        removeTokenCookie();
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userCookie,
    tokenCookie,
    isAuthenticated: !!currentUser,
    signOut: handleSignOut // Added signOut function to context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};