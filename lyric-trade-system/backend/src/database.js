const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let SQL = null;

async function initDatabase() {
  if (SQL === null) {
    SQL = await initSqlJs();
  }
  const dbPath = path.join(__dirname, '..', 'data.db');

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'buyer',
      avatar TEXT,
      bio TEXT,
      balance REAL DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS works (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      seller_id INTEGER NOT NULL,
      category_id INTEGER,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      preview TEXT,
      price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      views INTEGER DEFAULT 0,
      sales INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      tags TEXT,
      cover_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT UNIQUE NOT NULL,
      buyer_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      work_id INTEGER NOT NULL,
      price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      payment_time DATETIME,
      delivery_time DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER UNIQUE NOT NULL,
      buyer_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      work_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      content TEXT,
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      work_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(buyer_id, work_id)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      work_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(buyer_id, work_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      work_id INTEGER,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id INTEGER,
      detail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  saveDatabase();

  // Wrap db with better-sqlite3 compatible API
  const origPrepare = db.prepare.bind(db);
  db.prepare = function(sql) {
    const stmt = origPrepare(sql);
    return {
      run: function(...params) {
        try {
          stmt.reset();
          stmt.bind(params);
          stmt.step();
        } catch (e) {}
        saveDatabase();
        const changes = db.getRowsModified ? db.getRowsModified() : 0;
        const lastID = execScalar("SELECT last_insert_rowid()");
        return { changes, lastInsertRowid: lastID };
      },
      get: function(...params) {
        stmt.reset();
        stmt.bind(params);
        let result = undefined;
        if (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          result = {};
          cols.forEach((c, i) => result[c] = vals[i]);
        }
        return result;
      },
      all: function(...params) {
        stmt.reset();
        stmt.bind(params);
        const results = [];
        const cols = stmt.getColumnNames();
        while (stmt.step()) {
          const vals = stmt.get();
          const row = {};
          cols.forEach((c, i) => row[c] = vals[i]);
          results.push(row);
        }
        return results;
      }
    };
  };

  const origExec = db.exec.bind(db);
  db.exec = function(sql) {
    origExec(sql);
    saveDatabase();
  };

  const origRun = db.run.bind(db);
  db.run = function(sql, params) {
    if (params) origRun(sql, params); else origRun(sql);
    saveDatabase();
  };

  function execScalar(sql) {
    try {
      const results = db.exec(sql);
      if (results.length && results[0].values.length) return results[0].values[0][0];
    } catch (e) {}
    return 0;
  }

  function saveDatabase() {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    } catch (e) {
      // ignore save errors during very first init (table creation)
    }
  }

  db._save = saveDatabase;
}

module.exports = {
  get db() { return db; },
  initDatabase
};
