const express = require("express");
const availabilityService = require("../services/availability.service");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Mark user as ready
router.post("/ready", authMiddleware, async (req, res, next) => {
    try {
        const { userId, gameMode, rankRange } = req.body;

        if (!userId || !gameMode) {
            return res.status(400).json({
                message: "userId and gameMode are required",
            });
        }

        const availability = await availabilityService.markUserReady(userId, {
            gameMode,
            rankRange,
        });

        res.json({ availability });
    } catch (err) {
        next(err);
    }
});

// Mark user as not ready
router.delete("/ready/:userId", authMiddleware, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);

        await availabilityService.removeUser(userId);

        res.json({ message: "User removed from availability" });
    } catch (err) {
        next(err);
    }
});

// Get all ready users
router.get("/ready", authMiddleware, async (req, res, next) => {
    try {
        const { gameMode } = req.query;

        const users = await availabilityService.getReadyUsers(gameMode);

        res.json({ users, count: users.length });
    } catch (err) {
        next(err);
    }
});

// Check if user is ready
router.get("/ready/:userId", authMiddleware, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);

        const isReady = await availabilityService.isUserReady(userId);

        res.json({ userId, isReady });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
