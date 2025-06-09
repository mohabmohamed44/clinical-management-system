import axios from "axios";
import { supabase } from "../Config/Supabase";
import toast from "react-hot-toast";

const PAYMOB_CONFIG = {
  API_KEY: import.meta.env.VITE_PAYMOB_API_KEY,
  INTEGRATION_ID: parseInt(import.meta.env.VITE_PAYMOB_INTEGRATION_ID),
  IFRAME_ID: parseInt(import.meta.env.VITE_PAYMOB_IFRAME_ID),
  BASE_URL: "https://accept.paymobsolutions.com/api",
};

// Validate billing data format
const validateBillingData = (billingData) => {
  const required = ['first_name', 'last_name', 'email', 'phone_number'];
  const missing = required.filter(field => !billingData[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required billing fields: ${missing.join(', ')}`);
  }

  // Ensure phone number format (Egyptian format)
  let phone = billingData.phone_number.toString().replace(/\D/g, '');
  if (phone.startsWith('20')) {
    phone = phone.substring(2);
  }
  if (!phone.startsWith('01')) {
    phone = '01' + phone.substring(phone.length - 9);
  }

  return {
    first_name: billingData.first_name.trim(),
    last_name: billingData.last_name.trim(),
    email: billingData.email.trim().toLowerCase(),
    phone_number: phone,
    city: billingData.city || "Cairo",
    country: billingData.country || "EG",
    state: billingData.state || "Cairo",
    apartment: billingData.apartment || "NA",
    building: billingData.building || "NA",
    floor: billingData.floor || "NA",
    street: billingData.street || "NA",
    postal_code: billingData.postal_code || "11511"
  };
};

// 1. Authenticate with Paymob
const authenticate = async () => {
  try {
    if (!PAYMOB_CONFIG.API_KEY) {
      throw new Error("Paymob API key is missing from environment variables");
    }

    console.log("Authenticating with Paymob...");
    
    const response = await axios.post(
      `${PAYMOB_CONFIG.BASE_URL}/auth/tokens`,
      { api_key: PAYMOB_CONFIG.API_KEY },
      { 
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 10000
      }
    );

    if (!response?.data?.token) {
      console.error("Authentication response:", response?.data);
      throw new Error("Invalid authentication response - no token received");
    }

    console.log("Authentication successful");
    return response.data.token;
  } catch (error) {
    console.error("Paymob authentication error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      throw new Error("Invalid API key - please check your Paymob credentials");
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Payment gateway authentication failed"
    );
  }
};

// 2. Register order
const createOrder = async (authToken, amount, items = []) => {
  try {
    console.log("Creating order with amount:", amount);
    
    const orderData = {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: Math.round(amount * 100),
      currency: "EGP",
      items: items.length > 0 ? items : [{
        name: "Service Payment",
        amount_cents: Math.round(amount * 100),
        description: "Payment for services",
        quantity: 1
      }]
    };

    const response = await axios.post(
      `${PAYMOB_CONFIG.BASE_URL}/ecommerce/orders`,
      orderData,
      {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 10000
      }
    );

    if (!response?.data?.id) {
      console.error("Order creation response:", response?.data);
      throw new Error("Invalid order registration response - no order ID received");
    }

    console.log("Order created successfully:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Order registration error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(
      error.response?.data?.message || 
      "Failed to create payment order"
    );
  }
};

// 3. Get payment token
const getPaymentToken = async (authToken, orderId, amount, billingData) => {
  try {
    console.log("Generating payment token...");
    
    // Validate and format billing data
    const validatedBillingData = validateBillingData(billingData);
    
    // Ensure integration ID is a number
    const integrationId = parseInt(PAYMOB_CONFIG.INTEGRATION_ID);
    if (!integrationId) {
      throw new Error("Invalid integration ID - please check your environment variables");
    }

    const tokenData = {
      auth_token: authToken,
      amount_cents: Math.round(amount * 100),
      expiration: 3600, // 1 hour
      order_id: orderId,
      billing_data: validatedBillingData,
      currency: "EGP",
      integration_id: integrationId,
      lock_order_when_paid: true
    };

    console.log("Payment token request data:", {
      ...tokenData,
      auth_token: "***hidden***"
    });

    const response = await axios.post(
      `${PAYMOB_CONFIG.BASE_URL}/acceptance/payment_keys`,
      tokenData,
      {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 15000
      }
    );

    if (!response?.data?.token) {
      console.error("Payment token response:", response?.data);
      throw new Error("Invalid payment token response - no token received");
    }

    console.log("Payment token generated successfully");
    return response.data.token;
  } catch (error) {
    console.error("Payment token error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      billingData: billingData
    });

    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.detail || 
                      "Invalid request data - please check billing information";
      throw new Error(`Payment validation error: ${errorMsg}`);
    }

    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to generate payment token"
    );
  }
};

// Unified payment processor
export const initiatePayment = async (amount, billingData, items = []) => {
  try {
    console.log("Initiating payment process...", { amount, billingData });

    // Validate input
    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount - must be greater than 0");
    }
    
    if (!billingData) {
      throw new Error("Billing data is required");
    }

    if (!billingData.email || !billingData.phone_number) {
      throw new Error("Email and phone number are required in billing data");
    }

    // Validate environment variables
    if (!PAYMOB_CONFIG.IFRAME_ID) {
      throw new Error("Paymob iframe ID is missing from environment variables");
    }

    // Payment process
    const authToken = await authenticate();
    const orderId = await createOrder(authToken, amount, items);
    const paymentToken = await getPaymentToken(authToken, orderId, amount, billingData);

    const result = {
      success: true,
      orderId,
      paymentToken,
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_CONFIG.IFRAME_ID}?payment_token=${paymentToken}`,
    };

    console.log("Payment initiation successful:", {
      orderId: result.orderId,
      iframeUrl: result.iframeUrl
    });

    return result;
  } catch (error) {
    console.error("Payment initiation failed:", error.message);
    
    // Show user-friendly error messages
    toast.error(error.message || "Payment processing failed. Please try again.");
    
    return {
      success: false,
      error: error.message || "Payment processing failed",
    };
  }
};

// Appointment booking payment
export const processAppointmentPayment = async (appointmentDetails) => {
  try {
    const { fee, patientInfo, appointmentId } = appointmentDetails;

    if (!fee || !patientInfo) {
      throw new Error("Missing appointment details");
    }

    const nameParts = (patientInfo.name || "").trim().split(" ");
    const firstName = nameParts[0] || "Patient";
    const lastName = nameParts.slice(1).join(" ") || "User";

    const billingData = {
      first_name: firstName,
      last_name: lastName,
      email: patientInfo.email,
      phone_number: patientInfo.phone,
      city: patientInfo.city || "Cairo",
      country: "EG",
    };

    const items = [
      {
        name: `Appointment with Dr. ${patientInfo.providerName || "Doctor"}`,
        amount_cents: Math.round(fee * 100),
        description: "Medical Consultation",
        quantity: 1,
      },
    ];

    return await initiatePayment(fee, billingData, items);
  } catch (error) {
    console.error("Appointment payment error:", error);
    return {
      success: false,
      error: error.message || "Failed to process appointment payment"
    };
  }
};

// Lab test payment
export const processLabPayment = async (labDetails) => {
  try {
    const { amount, patientData } = labDetails;

    if (!amount || !patientData) {
      throw new Error("Missing lab payment details");
    }

    const billingData = {
      first_name: patientData.firstName || "Patient",
      last_name: patientData.lastName || "User",
      email: patientData.email,
      phone_number: patientData.phone,
      city: patientData.city || "Cairo",
      country: "EG",
    };

    const items = [
      {
        name: "Lab Test",
        amount_cents: Math.round(amount * 100),
        description: "Laboratory Test Services",
        quantity: 1,
      },
    ];

    return await initiatePayment(amount, billingData, items);
  } catch (error) {
    console.error("Lab payment error:", error);
    return {
      success: false,
      error: error.message || "Failed to process lab payment"
    };
  }
};

export const getSupabaseUserId = async (firebaseUser) => {
  try {
    if (!firebaseUser) {
      throw new Error("No user provided");
    }

    console.log("Getting Supabase user ID for:", firebaseUser.uid);

    // Check for existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("Users")
      .select("id")
      .eq("uid", firebaseUser.uid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Supabase fetch error:", fetchError);
      throw fetchError;
    }

    if (existingUser) {
      console.log("Existing user found:", existingUser.id);
      return existingUser.id;
    }

    // Create new user if not exists
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || "Patient",
      phone: firebaseUser.phoneNumber || "",
      role: "patient"
    };

    const { data: newUser, error: createError } = await supabase
      .from("Users")
      .insert([userData])
      .select("id")
      .single();

    if (createError) {
      console.error("Supabase create error:", createError);
      throw createError;
    }

    return newUser.id;

  } catch (error) {
    console.error("User error:", error);
    toast.error("Failed to verify user account");
    throw error;
  }
};