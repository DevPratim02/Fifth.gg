const express = require("express");
const matchService = require("../services/match.service");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Get match by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const matchId = parseInt(req.params.id);
        const match = await matchService.getMatchById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.json({ match });
    } catch (err) {
        next(err);
    }
});

// Get user's match history
router.get("/history/:userId", authMiddleware, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const limit = parseInt(req.query.limit) || 20;

        const matches = await matchService.getUserMatchHistory(userId, limit);

        res.json({ matches });
    } catch (err) {
        next(err);
    }
});

// Create a new match (for testing or admin)
router.post("/", authMiddleware, async (req, res, next) => {
    try {
        const { gameMode, playerIds } = req.body;

        if (!gameMode || !playerIds || playerIds.length < 2) {
            return res.status(400).json({
                message: "gameMode and playerIds (min 2) are required",
            });
        }

        const match = await matchService.createMatch(gameMode, playerIds);

        res.status(201).json({ match });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
