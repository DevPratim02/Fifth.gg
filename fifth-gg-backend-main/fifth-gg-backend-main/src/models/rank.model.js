const db = require("../config/db");

/**
 * Get or create user rank for a game mode
 */
async function getUserRank(userId, gameMode) {
    const result = await db.query(
        `SELECT * FROM user_ranks WHERE user_id = $1 AND game_mode = $2`,
        [userId, gameMode]
    );

    if (result.rows[0]) {
        return result.rows[0];
    }

    // Create default rank if doesn't exist
    const newRank = await db.query(
        `INSERT INTO user_ranks (user_id, game_mode, rank, mmr)
     VALUES ($1, $2, 'unranked', 1000)
     RETURNING *`,
        [userId, gameMode]
    );
    return newRank.rows[0];
}

/**
 * Update user rank after match
 */
async function updateUserRank(userId, gameMode, { mmrChange, won }) {
    const result = await db.query(
        `UPDATE user_ranks
     SET mmr = mmr + $3,
         wins = wins + $4,
         losses = losses + $5,
         updated_at = NOW()
     WHERE user_id = $1 AND game_mode = $2
     RETURNING *`,
        [userId, gameMode, mmrChange, won ? 1 : 0, won ? 0 : 1]
    );
    return result.rows[0];
}

/**
 * Get leaderboard for a game mode
 */
async function getLeaderboard(gameMode, limit = 100) {
    const result = await db.query(
        `SELECT ur.*, u.in_game_name, u.tagline
     FROM user_ranks ur
     JOIN users u ON ur.user_id = u.id
     WHERE ur.game_mode = $1
     ORDER BY ur.mmr DESC
     LIMIT $2`,
        [gameMode, limit]
    );
    return result.rows;
}

module.exports = {
    getUserRank,
    updateUserRank,
    getLeaderboard,
};
