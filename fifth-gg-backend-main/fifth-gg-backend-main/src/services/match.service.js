const db = require("../config/db");
const crypto = require("crypto");

/**
 * Create a new match
 */
async function createMatch(gameMode, playerIds) {
    const matchCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Create match
    const matchResult = await db.query(
        `INSERT INTO matches (match_code, game_mode, status)
     VALUES ($1, $2, 'active')
     RETURNING *`,
        [matchCode, gameMode]
    );

    const match = matchResult.rows[0];

    // Add participants
    for (let i = 0; i < playerIds.length; i++) {
        const team = i < playerIds.length / 2 ? "team1" : "team2";
        await db.query(
            `INSERT INTO match_participants (match_id, user_id, team, status)
       VALUES ($1, $2, $3, 'accepted')`,
            [match.id, playerIds[i], team]
        );
    }

    return match;
}

/**
 * Get match with participants
 */
async function getMatchById(matchId) {
    const matchResult = await db.query(
        `SELECT * FROM matches WHERE id = $1`,
        [matchId]
    );

    if (matchResult.rows.length === 0) {
        return null;
    }

    const match = matchResult.rows[0];

    // Get participants
    const participantsResult = await db.query(
        `SELECT mp.*, u.in_game_name, u.tagline, u.region
     FROM match_participants mp
     JOIN users u ON mp.user_id = u.id
     WHERE mp.match_id = $1`,
        [matchId]
    );

    match.participants = participantsResult.rows;
    return match;
}

/**
 * Update match status
 */
async function updateMatchStatus(matchId, status) {
    const result = await db.query(
        `UPDATE matches
     SET status = $2,
         ${status === 'active' ? 'started_at = NOW(),' : ''}
         ${status === 'completed' ? 'completed_at = NOW(),' : ''}
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
        [matchId, status]
    );
    return result.rows[0];
}

/**
 * Update participant status (accepted/declined)
 */
async function updateParticipantStatus(matchId, userId, status) {
    const result = await db.query(
        `UPDATE match_participants
     SET status = $3
     WHERE match_id = $1 AND user_id = $2
     RETURNING *`,
        [matchId, userId, status]
    );
    return result.rows[0];
}

/**
 * Get user's match history
 */
async function getUserMatchHistory(userId, limit = 20) {
    const result = await db.query(
        `SELECT m.*, mp.team, mp.status as participant_status
     FROM matches m
     JOIN match_participants mp ON m.id = mp.match_id
     WHERE mp.user_id = $1
     ORDER BY m.created_at DESC
     LIMIT $2`,
        [userId, limit]
    );
    return result.rows;
}

module.exports = {
    createMatch,
    getMatchById,
    updateMatchStatus,
    updateParticipantStatus,
    getUserMatchHistory,
};
