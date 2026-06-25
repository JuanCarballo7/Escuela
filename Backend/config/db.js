import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "edugestion.db");

let db = null;

function createDb(sqlDb) {
  const _db = new sqlDb.Database();

  _db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    UNIQUE NOT NULL,
      password    TEXT    NOT NULL,
      nombre      TEXT    NOT NULL,
      email       TEXT,
      rol         TEXT    NOT NULL CHECK(rol IN ('Administrador','Docente','Preceptor','Alumno')),
      activo      INTEGER DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre      TEXT    NOT NULL,
      dni         TEXT    UNIQUE NOT NULL,
      legajo      TEXT    UNIQUE NOT NULL,
      email       TEXT,
      curso       TEXT    NOT NULL,
      estado      TEXT    DEFAULT 'Activo' CHECK(estado IN ('Activo','Inactivo')),
      ingreso     TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre          TEXT    NOT NULL,
      curso           TEXT    NOT NULL,
      docente_id      INTEGER REFERENCES users(id),
      horas_semanales INTEGER DEFAULT 4,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS grades (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  INTEGER NOT NULL REFERENCES students(id),
      subject_id  INTEGER NOT NULL REFERENCES subjects(id),
      tp          REAL,
      final       REAL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  INTEGER NOT NULL REFERENCES students(id),
      subject_id  INTEGER NOT NULL REFERENCES subjects(id),
      fecha       DATE    NOT NULL,
      presente    INTEGER DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      accion      TEXT NOT NULL,
      alumno      TEXT,
      user_id     INTEGER REFERENCES users(id),
      tipo        TEXT DEFAULT 'info' CHECK(tipo IN ('success','info','warning','error')),
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return _db;
}

function loadOrCreate(sqlDb) {
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    return new sqlDb.Database(buffer);
  }
  return createDb(sqlDb);
}

function save() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// ─── Compatibility layer: mimics better-sqlite3 prepare/run/get/all ─────────

function prepare(sql) {
  const run = (...params) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      stmt.free();
    } catch {
      db.run(sql, params);
    }
    save();
    const id = db.exec("SELECT last_insert_rowid() AS id");
    const lastInsertRowid = id.length > 0 ? id[0].values[0][0] : 0;
    return { lastInsertRowid, changes: 1 };
  };

  const all = (...params) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      save();
      return results;
    } catch {
      const r = db.exec(sql);
      save();
      if (r.length === 0) return [];
      const { columns, values } = r[0];
      return values.map(row => {
        const obj = {};
        columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      });
    }
  };

  const get = (...params) => {
    const results = all(...params);
    return results.length > 0 ? results[0] : null;
  };

  return { run, all, get };
}

function exec(sql) {
  db.run(sql);
  save();
}

export async function initDb() {
  const SQL = await initSqlJs();
  db = loadOrCreate(SQL);
  save();
  console.log("📦 Base de datos lista");
}

export default { prepare, exec };
