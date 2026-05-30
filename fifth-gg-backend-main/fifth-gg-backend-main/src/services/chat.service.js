const db = require("../config/db");

async function saveMessage(roomId, userId, username, text) {
    // Ensure roomId is stored as string
    const res = await db.query(
        `INSERT INTO messages (room_id, user_id, username, text)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [String(roomId), userId, username, text]
    );
    return res.rows[0];
}

async function getMessages(roomId, limit = 100) {
    const res = await db.query(
        `SELECT * FROM messages WHERE room_id = $1 ORDER BY created_at ASC LIMIT $2`,
        [String(roomId), limit]
    );

    // Convert to format expected by Frontend
    return res.rows.map(m => ({
        id: m.id,
        userId: m.user_id,
        username: m.username,
        text: m.text,
        timestamp: m.created_at
    }));
}

module.exports = {
    saveMessage,
    getMessages
};
