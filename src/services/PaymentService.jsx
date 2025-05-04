import { getFunctions, httpsCallable} from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// Initialize Firebase Functions
const functions = getFunctions();
const auth = getAuth();

// Utility function to get the current user's ID
const getCurrentUserId = async () => {
    const user = auth.currentUser;
    if(!user) {
        throw new Error('User not authenticated');
    }
    return await user.getIdToken();
}

/**
 * Payment Flow 
 * 1. Authenticate the user or request
 * 2. Order Registration
 * 3. Payment key Request
 * 4. Iframe or redirect to payment gateway
 * 5. Payment Confirmation
 */

// Step 1: Authenticate the request
export const authenticatePaymob = async () => {
    try {
        const authenticate = httpsCallable(functions, 'authenticatePaymob');
        const result = await authenticate();
        return result.data;
    } catch (error) {
        console.error('Error authenticating Paymob:', error);
        throw error;
    }
};

// Step 2: Register the order
export const registerOrder = async (amount, currency, billingData) => {
    try {
        const registerOrder = httpsCallable(functions, 'registerOrder');
        const idToken = await getCurrentUserId();
        const result = await registerOrder({
            amount,
            currency,
            billingData,
            idToken
        });
        return result.data;
    } catch (error) {
        console.error('Error registering order:', error);
        throw error;
    }
};

// Step 3: Request the payment key
const getPaymentKey = async (orderId, amount, billingData, integrationId) => {
    try {
        const getPaymentKey = httpsCallable(functions, 'getPaymentKey');
        const idToken = await getCurrentUserId();
        const result = await getPaymentKey({
            orderId,
            amount,
            billingData,
            integrationId,
            idToken
        });
        return result.data;
    } catch (error) {
        console.error('Error getting payment key:', error);
        throw error;
    }
}