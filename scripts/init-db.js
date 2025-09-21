const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');

async function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Database connection error:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      
      try {
        // Create tables
        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
          )
        `);

        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS profils (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            photo TEXT,
            description TEXT,
            color TEXT,
            time TEXT,
            additionale TEXT,
            can_win TEXT,
            ordre INTEGER,
            active BOOLEAN DEFAULT true,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS news (
            id TEXT PRIMARY KEY,
            author TEXT NOT NULL,
            title TEXT NOT NULL,
            subtitle TEXT,
            post TEXT,
            photo TEXT,
            visible BOOLEAN DEFAULT true,
            movie BOOLEAN DEFAULT false,
            add_date DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS landing (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subtitle TEXT,
            description TEXT,
            photo TEXT
          )
        `);

        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            user TEXT NOT NULL,
            add_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            piece INTEGER,
            status TEXT,
            montant REAL,
            transaction_type TEXT,
            profil TEXT,
            reseau TEXT
          )
        `);

        await runQuery(db, `
          CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            question TEXT NOT NULL,
            propo_une TEXT,
            propo_deux TEXT,
            propo_trois TEXT,
            propo_quatre TEXT,
            propo_cinq TEXT,
            response TEXT
          )
        `);

        // Create default admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await runQuery(db, `
          INSERT OR IGNORE INTO users (id, username, password) 
          VALUES ('admin-1', 'admin', ?)
        `, [hashedPassword]);

        console.log('Database initialized successfully');
        db.close();
        resolve();
      } catch (error) {
        console.error('Database initialization error:', error);
        db.close();
        reject(error);
      }
    });
  });
}

function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

// Run initialization
initDatabase()
  .then(() => {
    console.log('Database setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
