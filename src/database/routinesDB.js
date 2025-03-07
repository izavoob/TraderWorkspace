const sqlite3 = require('sqlite3').verbose();

class RoutinesDB {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to database', err);
      } else {
        console.log('Connected to routines database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    this.db.serialize(() => {
      // Таблиця для пре-сесій
      this.db.run(`
        CREATE TABLE IF NOT EXISTS presessions (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            pair TEXT,
            narrative TEXT,
            execution TEXT,
            outcome TEXT,
            plan_outcome INTEGER DEFAULT 0,
            forex_factory_news TEXT,
            topDownAnalysis TEXT,
            video_url TEXT,
            plans TEXT,
            chart_processes TEXT,
            mindset_preparation TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Таблиця для пост-сесій
      this.db.run(`
        CREATE TABLE IF NOT EXISTS postsessions (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            pair TEXT,
            narrative TEXT,
            execution TEXT,
            outcome TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }

  // Пре-сесії
  async addPreSession(preSession) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO presessions (
            id, date, pair, narrative, execution, outcome, plan_outcome,
            forex_factory_news, topDownAnalysis, video_url, plans, chart_processes,
            mindset_preparation, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          preSession.id,
          preSession.date,
          preSession.pair,
          preSession.narrative,
          preSession.execution,
          preSession.outcome,
          preSession.plan_outcome ? 1 : 0,
          preSession.forex_factory_news,
          preSession.topDownAnalysis,
          preSession.video_url,
          preSession.plans,
          preSession.chart_processes,
          preSession.mindset_preparation,
        ],
        function(err) {
          if (err) {
            console.error('Error creating pre-session:', err);
            reject(err);
          } else {
            resolve(preSession.id);
          }
        }
      );
    });
  }

  async updatePreSession(preSession) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE presessions SET 
            date = ?, 
            pair = ?, 
            narrative = ?, 
            execution = ?, 
            outcome = ?, 
            plan_outcome = ?, 
            forex_factory_news = ?, 
            topDownAnalysis = ?, 
            video_url = ?, 
            plans = ?, 
            chart_processes = ?, 
            mindset_preparation = ?, 
            updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
          preSession.date,
          preSession.pair,
          preSession.narrative,
          preSession.execution,
          preSession.outcome,
          preSession.plan_outcome ? 1 : 0,
          preSession.forex_factory_news,
          preSession.topDownAnalysis,
          preSession.video_url,
          preSession.plans,
          preSession.chart_processes,
          preSession.mindset_preparation,
          preSession.id
        ],
        (err) => {
          if (err) {
            console.error('Error updating pre-session:', err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async getPreSessionById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM presessions WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.error('Error getting pre-session by ID:', err);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async getAllPreSessions() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM presessions ORDER BY date DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.error('Error getting all pre-sessions:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async deletePreSession(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM presessions WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Error deleting pre-session:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Пост-сесії
  async addPostSession(postSession) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO postsessions (
            id, date, pair, narrative, execution, outcome, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          postSession.id,
          postSession.date,
          postSession.pair,
          postSession.narrative,
          postSession.execution,
          postSession.outcome,
          postSession.notes
        ],
        function(err) {
          if (err) {
            console.error('Error creating post-session:', err);
            reject(err);
          } else {
            resolve(postSession.id);
          }
        }
      );
    });
  }

  async updatePostSession(postSession) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE postsessions SET 
            date = ?, 
            pair = ?, 
            narrative = ?, 
            execution = ?, 
            outcome = ?, 
            notes = ?, 
            updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
          postSession.date,
          postSession.pair,
          postSession.narrative,
          postSession.execution,
          postSession.outcome,
          postSession.notes,
          postSession.id
        ],
        (err) => {
          if (err) {
            console.error('Error updating post-session:', err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  async getPostSessionById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM postsessions WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.error('Error getting post-session by ID:', err);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async getAllPostSessions() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM postsessions ORDER BY date DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.error('Error getting all post-sessions:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async deletePostSession(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM postsessions WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Error deleting post-session:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = RoutinesDB;
