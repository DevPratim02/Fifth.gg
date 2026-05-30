const authService = require("../services/auth.service");

async function loginOrRegister(req, res, next) {
  try {
    const { uid, email, phoneNumber } = req.user || {};
    if (!uid) {
      return res.status(400).json({ message: "Missing authenticated user" });
    }

    const user = await authService.loginOrRegisterFromFirebase({
      uid,
      email,
      phoneNumber,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await authService.sendPasswordReset(email);
    res.json({ message: "Password reset instructions sent" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginOrRegister,
  forgotPassword,
};
