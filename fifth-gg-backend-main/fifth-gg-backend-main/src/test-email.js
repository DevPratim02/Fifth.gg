require('dotenv').config();
const emailService = require('./services/email.service');

async function testConfig() {
    console.log("Testing Email Configuration...");
    console.log("User:", process.env.EMAIL_USER ? "Set" : "Missing");
    console.log("Pass:", process.env.EMAIL_PASS ? "Set" : "Missing");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("ERROR: EMAIL_USER or EMAIL_PASS is missing in .env");
        return;
    }

    try {
        console.log("Attempting to send email to:", process.env.EMAIL_USER);
        await emailService.sendWelcomeEmail(process.env.EMAIL_USER);
        console.log("SUCCESS: Email sent successfully check your inbox!");
    } catch (error) {
        console.error("FAILED: Email could not be sent.");
        console.error(error);
    }
}

testConfig();
