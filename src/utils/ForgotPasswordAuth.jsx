import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Initialize Firebase Auth
const auth = getAuth();

/**
 * Send Password resetEmail to the user
 * @param {string} email - The email address of the user
 * @returns {Promise} - result of the operaation
 */

export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password Reset email sent Successfully.",
    };
  } catch (error) {
    console.error("Error Sending Password reset Email:", error);
    return {
      success: false,
      message: "Failed to send password reset Email",
      error: error.code,
    };
  }
};

// Verify password ResetCode

/**
 * Verify Password ResetCode
 * @param {string} code - reset code from the link
 * @returns {Promise} - Result of the Operation with Email if Successful
 */

export const verifyResetCode = async (code) => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    return {
      success: true,
      message: "Reset Code sent Sucessfully",
      email,
    };
  } catch (error) {
    console.error("Erro Verifying Reset Code", error);
    return {
      success: false,
      message: "Invalid or expired reset code",
      error: error.code,
    };
  }
};

/**
 * Complete the password reset process with a new password
 * @param {string} code - The reset code from the email link
 * @param {string} newPassword - The new password to set
 * @returns {Promise} - Result of the operation
 */
export const confirmPasswordChange = async (code, newPassword) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    return { success: true, message: "Password has been reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "Failed to reset password",
      error: error.code,
    };
  }
};

/**
 * Update password for a currently authenticated user without requiring current password
 * Note: This requires a recent sign-in or use of a valid reset code
 * @param {string} newPassword - The new password to set
 * @param {string} confirmPassword - Confirmation of the new password
 * @returns {Promise} - Result of the operation
 */
export const updateExistingPassword = async (newPassword, confirmPassword) => {
  try {
    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "New password and confirmation do not match",
      };
    }

    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Check if user session is recent enough
    // Firebase requires recent authentication for security-sensitive operations
    // If authentication is too old, this will fail with auth/requires-recent-login

    // Update the password directly
    await updatePassword(user, newPassword);

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);

    // Handle specific error cases
    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        message:
          "For security reasons, please log in again before changing your password",
        error: error.code,
        requiresReauth: true,
      };
    }

    if (error.code === "auth/weak-password") {
      return {
        success: false,
        message: "Password is too weak. Please choose a stronger password",
        error: error.code,
      };
    }

    return {
      success: false,
      message: "Failed to update password",
      error: error.code,
    };
  }
};

/**
 * Handle re-authentication if needed
 * Call this function if updatePassword returns requiresReauth: true
 * @param {string} email - User's email
 * @param {string} password - User's current password
 * @returns {Promise} - Authentication result
 */
export const reauthenticateUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      message: "Re-authentication successful",
    };
  } catch (error) {
    console.error("Re-authentication failed:", error);
    return {
      success: false,
      message: "Re-authentication failed",
      error: error.code,
    };
  }
};
