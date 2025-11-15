const Razorpay = require("razorpay");
require("dotenv").config();

// Validate that Razorpay keys are present
const razorpayKey = process.env.RAZORPAY_KEY?.trim();
const razorpaySecret = process.env.RAZORPAY_SECRET?.trim();

if (!razorpayKey || !razorpaySecret) {
  console.error("⚠️  WARNING: Razorpay keys are missing in environment variables!");
  console.error("Please set RAZORPAY_KEY and RAZORPAY_SECRET in your .env file");
  console.error("Current RAZORPAY_KEY:", razorpayKey ? "Present (length: " + razorpayKey.length + ")" : "Missing");
  console.error("Current RAZORPAY_SECRET:", razorpaySecret ? "Present (length: " + razorpaySecret.length + ")" : "Missing");
  exports.instance = null;
} else {
  try {
    // Log key info without exposing the actual secret
    console.log("🔑 Razorpay Key ID:", razorpayKey.substring(0, 8) + "...");
    console.log("🔑 Razorpay Secret:", razorpaySecret ? "Present (length: " + razorpaySecret.length + ")" : "Missing");
    
    exports.instance = new Razorpay({
      key_id: razorpayKey,
      key_secret: razorpaySecret,
    });
    console.log("✅ Razorpay instance initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Razorpay:", error.message);
    exports.instance = null;
  }
}