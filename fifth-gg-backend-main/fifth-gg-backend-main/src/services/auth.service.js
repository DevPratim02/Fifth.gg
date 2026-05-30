const userModel = require("../models/user.model");
const emailService = require("./email.service");
const admin = require("../config/firebase");

/**
 * Login or register a user from Firebase authentication
 * If user exists, return existing user
 * If user doesn't exist, create new user
 */
async function loginOrRegisterFromFirebase({ uid, email, phoneNumber }) {
    // Check if user already exists
    let user = await userModel.findByFirebaseUid(uid);

    if (user) {
        // User exists, return it
        return user;
    }

    // User doesn't exist, create new user
    user = await userModel.createUser({
        firebaseUid: uid,
        email: email || null,
    });

    // Send Welcome Email
    if (email) {
        emailService.sendWelcomeEmail(email).catch(err => console.error("Email error:", err));
    }

    return user;
}

/**
 * Send password reset link via custom email service
 */
async function sendPasswordReset(email) {
    try {
        const link = await admin.auth().generatePasswordResetLink(email);
        await emailService.sendPasswordResetEmail(email, link);
        return { message: "Password reset link sent" };
    } catch (err) {
        console.error("Error generating reset link:", err);
        throw new Error("Failed to generate password reset link");
    }
}

module.exports = {
    loginOrRegisterFromFirebase,
    sendPasswordReset,
};
