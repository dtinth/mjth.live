import Database from "better-sqlite3";

export const db = new Database("./data.local/active_users.db");
