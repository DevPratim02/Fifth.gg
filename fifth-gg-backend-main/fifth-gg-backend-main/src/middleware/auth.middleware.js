const admin = require("../config/firebase");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      phoneNumber: decoded.phone_number || null,
    };
    return next();
  } catch (err) {
    console.error("Firebase token verification failed", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
