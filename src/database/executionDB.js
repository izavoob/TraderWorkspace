const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class ExecutionDB {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to database', err);
      } else {
        console.log('Connected to execution database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    const defaultData = {
      pointA: ['Fractal Raid', 'FVG', 'SNR', 'RB'],
      trigger: ['Fractal Swing', 'Fractal+FVG', 'FVG'],
      pointB: ['Fractal Swing', 'FVG'],
      entryModel: ['Displacement', 'Inversion', 'IDM', 'SNR'],
      entryTF: ['3m', '5m', '15m', '30m', '1h', '4h'],
      fta: ['Fractal Swing', 'SNR', 'RB', 'FVG'],
      slPosition: ['LTF Manipulation', 'Lunch Manipulation', '30m Raid', '1h Raid', '4h Raid'],
      volumeConfirmation: ['Inversion', 'FVG', 'SNR'],
      
      pairs: ['EURUSD', 'GBPUSD', 'XAUUSD', 'XAGUSD', 'GER40', 'USDJPY'],
      directions: ['Long', 'Short'],
      sessions: ['Asia', 'Frankfurt', 'London', 'Out of OTT', 'New York'],
      positionType: ['Intraday', 'Swing']
    };

    this.db.serialize(() => {
      Object.keys(defaultData).forEach(section => {
        this.db.run(`CREATE TABLE IF NOT EXISTS ${section} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Перевіряємо чи таблиця порожня перед додаванням значень за замовчуванням
        this.db.get(`SELECT COUNT(*) as count FROM ${section}`, [], (err, row) => {
          if (err) {
            console.error(`Error checking ${section} table:`, err);
            return;
          }

          // Додаємо значення за замовчуванням тільки якщо таблиця порожня
          if (row.count === 0) {
            const stmt = this.db.prepare(`INSERT OR IGNORE INTO ${section} (name) VALUES (?)`);
            defaultData[section].forEach(item => {
              stmt.run(item);
            });
            stmt.finalize();
          }
        });
      });
    });
  }

  async getAllItems(section) {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${section} ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async addItem(section, name) {
    return new Promise((resolve, reject) => {
      this.db.run(`INSERT INTO ${section} (name) VALUES (?)`, [name], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async updateItem(section, id, name) {
    return new Promise((resolve, reject) => {
      this.db.run(`UPDATE ${section} SET name = ? WHERE id = ?`, [name, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async deleteItem(section, id) {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM ${section} WHERE id = ?`, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = ExecutionDB; 