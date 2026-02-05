import { createDB } from "./lib/db.js";

try {
    createDB();
    console.log("Database created");
} catch (error) {
    console.error("Failed to create database", error);
    process.exit(1);
}
