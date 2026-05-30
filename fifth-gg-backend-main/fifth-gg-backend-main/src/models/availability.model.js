const db = require("../config/db");

/**
 * Set user as ready/not ready for matchmaking
 */
async function setUserAvailability({ userId, isReady, gameMode, rankRange }) {
    const result = await db.query(
        `INSERT INTO availability (user_id, is_ready, game_mode, rank_range, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET
       is_ready = $2,
       game_mode = $3,
       rank_range = $4,
       updated_at = NOW()
     RETURNING *`,
        [userId, isReady, gameMode, rankRange]
    );
    return result.rows[0];
}

/**
 * Get all users ready for matchmaking
 */
async function getReadyUsers(gameMode) {
    const result = await db.query(
        `SELECT a.*, u.id as user_id, u.in_game_name, u.tagline, u.region
     FROM availability a
     JOIN users u ON a.user_id = u.id
     WHERE a.is_ready = true
     AND ($1::varchar IS NULL OR a.game_mode = $1)`,
        [gameMode || null]
    );
    return result.rows;
}

/**
 * Remove user from availability (when they disconnect or get matched)
 */
async function removeUserAvailability(userId) {
    await db.query(
        `DELETE FROM availability WHERE user_id = $1`,
        [userId]
    );
}

/**
 * Get user's current availability status
 */
async function getUserAvailability(userId) {
    const result = await db.query(
        `SELECT * FROM availability WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
}

module.exports = {
    setUserAvailability,
    getReadyUsers,
    removeUserAvailability,
    getUserAvailability,
};
