const fs = require("fs");
const path = require("path");
const db = require("../config/db");

async function runMigrations() {
    try {
        console.log("🚀 Starting database migrations...\n");

        const migrationsDir = path.join(__dirname, "migrations");
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        if (files.length === 0) {
            console.log("⚠️  No migration files found");
            return;
        }

        for (const file of files) {
            console.log(`Running: ${file}...`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf8");

            await db.query(sql);
            console.log(`✅ ${file} completed\n`);
        }

        console.log("🎉 All migrations completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

runMigrations();
