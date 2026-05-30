const db = require("../config/db");

// Find by Firebase UID
async function findByFirebaseUid(firebaseUid) {
  const result = await db.query("SELECT * FROM users WHERE firebase_uid = $1", [
    firebaseUid,
  ]);
  return result.rows[0] || null;
}

// Create new user
async function createUser({ firebaseUid, email }) {
  const result = await db.query(
    `INSERT INTO users (firebase_uid, email)
     VALUES ($1, $2)
     RETURNING *`,
    [firebaseUid, email]
  );
  return result.rows[0];
}

// (optional, later) findById, updateUser, etc.

module.exports = {
  findByFirebaseUid,
  createUser,
};
