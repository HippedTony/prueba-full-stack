/**
 * Configuración de la base de datos.
 *
 * Crea y exporta la conexión a SQLite utilizada por la aplicación.
 * La tabla de contactos se crea automáticamente si todavía no existe.
 */
import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH || './db/app.sqlite';

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

export default db;
