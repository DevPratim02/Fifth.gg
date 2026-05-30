const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Get user profile
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await userService.getUserWithRanks(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        next(err);
    }
});

// Update user profile
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { inGameName, tagline, region } = req.body;

        // Ensure user can only update their own profile
        // You might want to add more sophisticated authorization
        const user = await userService.updateUserProfile(userId, {
            inGameName,
            tagline,
            region,
        });

        res.json({ user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
