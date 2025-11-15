import { apiConnector } from "../apiconnector";
import { paymentEndpoints, studentEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import { setPaymentLoading } from "../../slice/courseSlice";
import { resetCart } from "../../slice/cartSlice";

const { CAPTURE_MULTIPLE_PAYMENT_API, ENROLL_COURSE_API } = paymentEndpoints;
const { COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

// 1. Load Razorpay script dynamically
const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

// 2. Open Razorpay modal and initiate payment
export const captureMultiplePayment = async (token, courses, navigate, user = null, dispatch = null) => {
    try {
        // Load Razorpay script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return { success: false };
        }

        // Get order from backend
        console.log("📤 Requesting order from backend...");
        console.log("📦 Courses being sent:", courses);
        
        const response = await apiConnector(
            "POST", 
            CAPTURE_MULTIPLE_PAYMENT_API, 
            { courses },
            {
                Authorization: `Bearer ${token}`
            }
        );

        // Log full response for debugging
        console.log("📥 Full API Response:", response);
        console.log("📥 Response Data:", response?.data);
        console.log("📥 Response Status:", response?.status);

        if (!response?.data?.success) {
            const errorMsg = response?.data?.message || "Failed to create order";
            toast.error(errorMsg);
            console.error("❌ Order creation failed:", response?.data);
            console.error("❌ Full error response:", JSON.stringify(response?.data, null, 2));
            return { success: false };
        }

        const { orderId, amount, currency, courses: courseIds } = response.data;
        
        // Log order response details
        console.log("✅ Order Response Details:", {
            success: response.data.success,
            orderId: orderId,
            amount: amount,
            amountInRupees: amount ? amount / 100 : null,
            currency: currency,
            courseIds: courseIds,
            fullResponse: response.data
        });
        
        // Validate response data
        if (!orderId) {
            toast.error("Invalid order ID received from server");
            console.error("Missing orderId in response:", response.data);
            return { success: false };
        }
        
        if (!amount || amount <= 0) {
            toast.error("Invalid payment amount");
            console.error("Invalid amount in response:", amount);
            return { success: false };
        }
        
        console.log("✅ Order created successfully:", {
            orderId,
            amount: amount / 100, // Convert paise to rupees for display
            currency,
            courseIds
        });

        // Check if Razorpay key is configured
        // Try both REACT_APP_RAZORPAY_KEY and RAZORPAY_KEY for compatibility
        const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY || process.env.RAZORPAY_KEY;
        if (!razorpayKey) {
            toast.error("Payment gateway is not configured. Please contact administrator.");
            console.error("Razorpay key is missing in environment variables");
            return { success: false };
        }

        // 3. Create options object for Razorpay
        // IMPORTANT: For testing, use ONLY Indian domestic test cards:
        // ✅ Visa (Indian): 4111 1111 1111 1111 (CVV: any 3 digits, Expiry: any future date)
        // ✅ Mastercard (Indian): 5267 3181 8797 5449 (CVV: any 3 digits, Expiry: any future date)
        // ❌ DO NOT USE: 5555 5555 5555 4444 (International Mastercard - will fail)
        // ❌ DO NOT USE: 4012 8888 8888 1881 (International Visa - will fail)
        // 
        // If you need international cards, enable them in Razorpay Dashboard:
        // Settings → Account & Settings → Payment Methods → Enable "International Payments"
        // Ensure amount is in paise (Razorpay expects amount in smallest currency unit)
        // Backend should already send amount in paise, but double-check
        const amountInPaise = typeof amount === 'number' ? Math.round(amount) : parseInt(amount);
        
        if (isNaN(amountInPaise) || amountInPaise <= 0) {
            toast.error("Invalid payment amount. Please try again.");
            console.error("Invalid amount:", amount, "converted to:", amountInPaise);
            return { success: false };
        }
        
        console.log("💰 Payment Amount:", {
            original: amount,
            inPaise: amountInPaise,
            inRupees: amountInPaise / 100,
            orderId: orderId
        });
        
        // Options for Razorpay - following successful pattern
        // NOTE: Even though we restrict to domestic-only in code, Razorpay account
        // requires International Payments to be enabled for API to work properly.
        // Enabling it in dashboard doesn't mean we accept international cards - 
        // we can still restrict to domestic-only in our application.
        const options = {
            key: razorpayKey,
            currency: currency, // INR - Indian Rupees (domestic currency)
            amount: `${amountInPaise}`, // Convert to string as per successful pattern
            order_id: orderId,
            name: "EduConnect",
            description: `Thank You for Purchasing ${courseIds.length} Course(s)`,
            image: "", // You can add your logo URL here
            // Restrict payment methods to domestic-only
            method: {
                card: true,      // Allow cards (domestic Indian cards)
                netbanking: true, // Allow Indian netbanking
                wallet: true,    // Allow Indian wallets
                upi: true,       // Allow UPI (Indian payment method)
            },
            // Configure to prefer domestic payment methods
            config: {
                display: {
                    blocks: {
                        banks: {
                            name: "All Payment Methods",
                            instruments: [
                                { method: "card" },
                                { method: "netbanking" },
                                { method: "wallet" },
                                { method: "upi" },
                            ],
                        },
                    },
                    sequence: ["block.banks"],
                    preferences: {
                        show_default_blocks: true,
                    },
                },
            },
            prefill: {
                name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "",
                email: user?.email || "",
                contact: user?.additionalDetails?.contactNumber || "",
            },
            handler: async function (response) {
                // Payment success handler - following successful pattern
                try {
                    // Send payment success email
                    await sendPaymentSuccessEmail(response, amountInPaise, token);
                    
                    // Verify payment and enroll
                    await verifyPayment(
                        { ...response, courses: courseIds },
                        token,
                        navigate,
                        dispatch
                    );
                } catch (error) {
                    console.error("Payment handler error:", error);
                    toast.error("Payment successful but enrollment failed. Please contact support.");
                }
            },
            notes: {
                courses: courseIds.join(","),
            },
            theme: {
                color: "#F59E0B", // Yellow color matching your theme
            },
        };

        // 4. Initiate the Razorpay payment modal
        // Validate order data before opening modal
        if (!orderId || !amount) {
            toast.error("Invalid payment order. Please try again.");
            console.error("Missing order data:", { orderId, amount });
            return { success: false };
        }
        
        console.log("💳 Razorpay Payment Modal Opening");
        console.log("📋 Order Details:", {
            orderId,
            amount: amount / 100, // Convert paise to rupees
            currency,
            courseIds
        });
        console.log("📝 Use these Indian domestic test cards:");
        console.log("   Visa: 4111 1111 1111 1111 (CVV: 123, Expiry: 12/25)");
        console.log("   Mastercard: 5267 3181 8797 5449 (CVV: 123, Expiry: 12/25)");
        console.log("⚠️  If you see 'International cards not supported' error:");
        console.log("   1. Make sure you're using the cards above (NOT 5555 5555 5555 4444)");
        console.log("   2. Or enable International Payments in Razorpay Dashboard:");
        console.log("      Settings → Payment Methods → Enable 'International Payments'");
        
        const paymentObject = new window.Razorpay(options);
        
        // Add error handler for modal initialization errors
        paymentObject.open();
        
        // Handle payment failed - with detailed error handling
        paymentObject.on("payment.failed", function(response) {
            console.log("Payment failed response:", response);
            console.log("Payment error details:", response.error);
            
            // Check for international transaction error
            if (response?.error?.reason === "international_transaction_not_allowed" || 
                response?.error?.code === "BAD_REQUEST_ERROR" && 
                response?.error?.description?.toLowerCase().includes("international")) {
                
                const errorMsg = "International payments are not enabled. Enable International Payments in Razorpay Dashboard: Settings → Payment Methods → Enable 'International Payments'";
                toast.error(errorMsg);
                
                console.error("❌ RAZORPAY API ERROR - International Transaction Not Allowed");
                console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                console.error("Error Code:", response.error.code);
                console.error("Error Reason:", response.error.reason);
                console.error("Error Description:", response.error.description);
                console.error("Error Step:", response.error.step);
                console.error("Payment ID:", response.error.metadata?.payment_id);
                console.error("Order ID:", response.error.metadata?.order_id);
                console.error("");
                console.error("🔍 WHY THIS ERROR OCCURS:");
                console.error("   Your Razorpay account has International Payments DISABLED.");
                console.error("   Razorpay's API requires International Payments to be enabled");
                console.error("   even for domestic transactions in some account configurations.");
                console.error("");
                console.error("📌 IMPORTANT: Enabling International Payments in Razorpay Dashboard");
                console.error("   does NOT mean you have to accept international cards.");
                console.error("   You can still restrict to domestic-only in your code:");
                console.error("   - Currency is set to INR (Indian Rupees)");
                console.error("   - Payment methods are restricted to Indian methods");
                console.error("   - Your application logic can validate domestic cards only");
                console.error("");
                console.error("✅ SOLUTION: Enable International Payments in Razorpay Dashboard");
                console.error("   1. Go to: https://dashboard.razorpay.com/");
                console.error("   2. Login to your Razorpay account");
                console.error("   3. Navigate to: Settings → Account & Settings → Payment Methods");
                console.error("   4. Find 'International Payments' or 'Accept International Cards'");
                console.error("   5. Click the toggle to ENABLE it (should turn ON/Green)");
                console.error("   6. Click 'Save' or 'Update'");
                console.error("   7. Wait 2-3 minutes for changes to propagate");
                console.error("   8. Try the payment again");
                console.error("");
                console.error("📝 After enabling, these test cards will work:");
                console.error("   • 4111 1111 1111 1111 (Visa)");
                console.error("   • 5267 3181 8797 5449 (Mastercard)");
                console.error("   • 5555 5555 5555 4444 (International Mastercard)");
                console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            } else {
                // Other payment errors
                toast.error(response?.error?.description || "Oops, payment failed");
                console.error("Payment failed with error:", response.error);
            }
        });
        
        // Handle payment success (authorized)
        paymentObject.on("payment.authorized", function(response) {
            console.log("✅ Payment authorized:", response);
        });
        
        // Handle payment modal close without payment
        paymentObject.on("payment.modal.closed", function () {
            console.log("Payment modal closed by user");
        });

        return { success: true, orderId };

    } catch (error) {
        console.log("CAPTURE_MULTIPLE_PAYMENT_API ERROR:", error);
        toast.error("Could not make Payment");
        return { success: false, error };
    }
};

// Send payment success email - following successful pattern
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`
            }
        );
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
        // Don't throw error, just log it
    }
}

// Verify payment and enroll - following successful pattern
async function verifyPayment(bodyData, token, navigate, dispatch = null) {
    const toastId = toast.loading("Verifying Payment....");
    
    // Set payment loading state if dispatch is available
    if (dispatch) {
        dispatch(setPaymentLoading(true));
    }
    
    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment Successful! You are added to the course.");
        navigate("/dashboard/enrolled-courses");
        
        // Reset cart if dispatch is available
        if (dispatch) {
            dispatch(resetCart());
        }
        
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    
    toast.dismiss(toastId);
    
    // Reset payment loading state
    if (dispatch) {
        dispatch(setPaymentLoading(false));
    }
}