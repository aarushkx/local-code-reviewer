import Datastore from "nedb";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFolder = path.join(__dirname, "../db");

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

export const createDB = () => {
    const reviewsDB = new Datastore({
        filename: path.join(dbFolder, "reviews.db"),
        autoload: true,
    });

    const historyDB = new Datastore({
        filename: path.join(dbFolder, "history.db"),
        autoload: true,
    });

    reviewsDB.ensureIndex({ fieldName: "filePath" });
    historyDB.ensureIndex({ fieldName: "projectName" });
};
