const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // Easy default, or usage of host/port
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/* 
 * Note: For Gmail, user must use App Password if 2FA is on.
 * For production, use SendGrid/Resend SMTP settings.
 */

async function sendWelcomeEmail(email) {
    if (!email) return;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #fff; background-color: #111; padding: 20px;">
        <h1 style="color: #ff4655;">Welcome to Fifth.gg!</h1>
        <p>Target acquired. You have been verified and are ready to deploy.</p>
        <p>Complete your profile to find your squad. We verify all agents to ensure the highest quality matches.</p>
        <br>
        <a href="https://fifth.gg/onboarding" style="background-color: #ff4655; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">INITIALIZE PROTOCOL</a>
      </div>
    `;

    try {
        await transporter.sendMail({
            from: '"Fifth.gg Command" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: "Welcome to Protocol Fifth.gg",
            html,
        });
        console.log("Welcome email sent to", email);
    } catch (err) {
        console.error("Failed to send welcome email", err);
    }
}

async function sendPasswordResetEmail(email, link) {
    if (!email) return;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #fff; background-color: #111; padding: 20px;">
        <h1 style="color: #ff4655;">Password Reset Request</h1>
        <p>Protocol override initiated. Click the link below to reset your access code:</p>
        <br>
        <a href="${link}" style="background-color: #ff4655; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">RESET PASSWORD</a>
        <br><br>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this transmission.</p>
      </div>
    `;

    try {
        await transporter.sendMail({
            from: '"Fifth.gg Command" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: "Fifth.gg Password Reset",
            html,
        });
        console.log("Password reset email sent to", email);
    } catch (err) {
        console.error("Failed to send reset email", err);
    }
}

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail
};
