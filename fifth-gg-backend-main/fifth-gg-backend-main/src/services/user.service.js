const db = require("../config/db");

/**
 * Get user by ID
 */
async function getUserById(userId) {
    const result = await db.query(
        `SELECT * FROM users WHERE id = $1`,
        [userId]
    );
    return result.rows[0] || null;
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, { inGameName, tagline, region }) {
    const result = await db.query(
        `UPDATE users
     SET in_game_name = COALESCE($2, in_game_name),
         tagline = COALESCE($3, tagline),
         region = COALESCE($4, region),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
        [userId, inGameName, tagline, region]
    );
    return result.rows[0];
}

/**
 * Get user with their ranks
 */
async function getUserWithRanks(userId) {
    const user = await getUserById(userId);
    if (!user) return null;

    const ranksResult = await db.query(
        `SELECT * FROM user_ranks WHERE user_id = $1`,
        [userId]
    );

    user.ranks = ranksResult.rows;
    return user;
}

module.exports = {
    getUserById,
    updateUserProfile,
    getUserWithRanks,
};
