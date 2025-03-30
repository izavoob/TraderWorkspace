const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class AccountsDB {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) throw new Error(`Database connection failed: ${err.message}`);
      console.log('Accounts database initialized at:', dbPath);
    });
    this.initializeDatabase();
  }

  initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        startingEquity REAL NOT NULL,
        currentEquity REAL NOT NULL,
        balance REAL NOT NULL,
        status TEXT NOT NULL,
        relatedTradeId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery);
  }

  getAllAccounts() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM accounts ORDER BY createdAt DESC';
      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  getAccountById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM accounts WHERE id = ?';
      this.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  addAccount(account) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO accounts (name, startingEquity, currentEquity, balance, status, relatedTradeId)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        query,
        [
          account.name,
          account.startingEquity,
          account.currentEquity,
          account.balance,
          account.status,
          account.relatedTradeId || null
        ],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  updateAccount(account) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE accounts
        SET name = ?,
            startingEquity = ?,
            currentEquity = ?,
            balance = ?,
            status = ?,
            relatedTradeId = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      this.db.run(
        query,
        [
          account.name,
          account.startingEquity,
          account.currentEquity,
          account.balance,
          account.status,
          account.relatedTradeId || null,
          account.id
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  deleteAccount(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM accounts WHERE id = ?';
      this.db.run(query, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
}

module.exports = AccountsDB; 