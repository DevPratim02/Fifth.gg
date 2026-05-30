const db = require("./config/db");

async function setup() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                room_id VARCHAR(255) NOT NULL,
                user_id INTEGER NOT NULL,
                username VARCHAR(255),
                text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Messages table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating table:", err);
        process.exit(1);
    }
}

setup();
