import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'database.sqlite'); 

class Database {
  private db: sqlite3.Database;  
  private initialized = false;
  private initializing = false;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }

  private async init() {
    if (this.initialized || this.initializing) return;
    this.initializing = true;
    
    // Promisify methods for better async handling
    const run = promisify(this.db.run.bind(this.db));
    
    try {
      console.log('Initializing database tables...');
      
      // Create tables (same as before)
      await run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);

      await run(`
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

      await run(`
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

      await run(`
        CREATE TABLE IF NOT EXISTS landing (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          subtitle TEXT,
          description TEXT,
          photo TEXT
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          prix REAL NOT NULL,
          prix_tva REAL NOT NULL,
          categorie TEXT NOT NULL,
          photo TEXT,
          principales_caracteristiques TEXT,
          disponible BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          photo TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
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

      await run(`
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

      // Create default admin user if not exists
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.db.run(`
        INSERT OR IGNORE INTO users (id, username, password) 
        VALUES ('admin-1', 'admin', ?)
      `, hashedPassword); // Pass hashedPassword directly here (no array)
      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
    } finally {
      this.initializing = false;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  // Query method for SELECT statements
  async query(sql: string, params: any[] = []): Promise<any[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Run method for INSERT, UPDATE, DELETE statements
  async run(sql: string, params: any[] = []): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Get method for SELECT ONE row
  async get(sql: string, params: any[] = []): Promise<any> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

export const db = new Database();
