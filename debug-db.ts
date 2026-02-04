import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const roots = [
  path.join(process.cwd(), "dev.db"),
  path.join(process.cwd(), "packages/db/dev.db"),
  path.join(process.cwd(), "packages/db/packages/db/dev.db"),
];

console.log("Checking locations...");
roots.forEach((p) => {
  if (fs.existsSync(p)) {
    console.log(`Found DB at: ${p}`);
    try {
      const db = new Database(p);
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all();
      console.log("Tables:", tables);
    } catch (e) {
      console.error("Error opening DB:", e);
    }
  } else {
    console.log(`Missing: ${p}`);
  }
});
