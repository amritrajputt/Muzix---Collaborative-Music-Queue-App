import dotenv from "dotenv";
dotenv.config();

import { migrate } from "drizzle-orm/node-postgres/migrator";
import db from "./index.js";

async function runMigrations() {
  console.log("Running database migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to run migrations:", error);
    process.exit(1);
  }
}

runMigrations();
