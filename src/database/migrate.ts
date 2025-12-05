import { type SQLiteDatabase } from "expo-sqlite";

export async function migrate(database: SQLiteDatabase) {
  const statements = [
    `PRAGMA foreign_keys = ON;`,
    `CREATE TABLE IF NOT EXISTS targets (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       amount REAL NOT NULL,
       created_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
       updated_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now'))
     );`,
    `CREATE TABLE IF NOT EXISTS transactions (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       target_id INTEGER NOT NULL,
       amount REAL NOT NULL,
       observation TEXT,
       created_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
       updated_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')),
       CONSTRAINT fk_targets_transactions
         FOREIGN KEY (target_id) REFERENCES targets(id)
         ON DELETE CASCADE
     );`
  ];

  for (const sql of statements) {
    try {
      await database.execAsync(sql);
    } catch (err) {
      console.error("Migration statement failed:", sql, err);
      throw err;
    }
  }
}