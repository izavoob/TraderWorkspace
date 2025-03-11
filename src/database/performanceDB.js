const sqlite3 = require('sqlite3').verbose();

class PerformanceDB {
  constructor(dbPath) {
    console.log('Initializing PerformanceDB with path:', dbPath);
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to performance database:', err);
      } else {
        console.log('Connected to performance database at:', dbPath);
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    console.log('Initializing performance database tables...');
    this.db.serialize(() => {
      // Таблиця для аналізу продуктивності
      this.db.run(`
        CREATE TABLE IF NOT EXISTS performance_analysis (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            weekNumber INTEGER,
            totalTrades INTEGER DEFAULT 0,
            missedTrades INTEGER DEFAULT 0,
            executionCoefficient REAL DEFAULT 0,
            winRate REAL DEFAULT 0,
            followingPlan REAL DEFAULT 0,
            narrativeAccuracy REAL DEFAULT 0,
            gainedRR REAL DEFAULT 0,
            potentialRR REAL DEFAULT 0,
            averageRR REAL DEFAULT 0,
            profit REAL DEFAULT 0,
            profitFactor REAL DEFAULT 0,
            realisedPL REAL DEFAULT 0,
            averagePL REAL DEFAULT 0,
            averageLoss REAL DEFAULT 0,
            videoUrl TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating performance_analysis table:', err);
        } else {
          console.log('Performance analysis table created/verified successfully');
        }
      });

      // Таблиця для зв'язку з трейдами
      this.db.run(`
        CREATE TABLE IF NOT EXISTS performance_trades (
            performance_id TEXT,
            trade_id TEXT,
            PRIMARY KEY (performance_id, trade_id),
            FOREIGN KEY (performance_id) REFERENCES performance_analysis(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating performance_trades table:', err);
        } else {
          console.log('Performance trades table created/verified successfully');
        }
      });

      // Таблиця для зв'язку з пресесіями
      this.db.run(`
        CREATE TABLE IF NOT EXISTS performance_routines (
            performance_id TEXT,
            routine_id TEXT,
            routine_type TEXT,
            PRIMARY KEY (performance_id, routine_id),
            FOREIGN KEY (performance_id) REFERENCES performance_analysis(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating performance_routines table:', err);
        } else {
          console.log('Performance routines table created/verified successfully');
        }
      });
    });
  }

  // Метод для збереження аналізу продуктивності
  async savePerformanceAnalysis(analysis) {
    return new Promise((resolve, reject) => {
      const {
        id, type, startDate, endDate, weekNumber,
        totalTrades, missedTrades, executionCoefficient, winRate, followingPlan,
        narrativeAccuracy, gainedRR, potentialRR, averageRR, profit,
        profitFactor, realisedPL, averagePL, averageLoss, videoUrl
      } = analysis;

      this.db.run(
        `INSERT INTO performance_analysis (
          id, type, startDate, endDate, weekNumber,
          totalTrades, missedTrades, executionCoefficient, winRate, followingPlan,
          narrativeAccuracy, gainedRR, potentialRR, averageRR, profit,
          profitFactor, realisedPL, averagePL, averageLoss, videoUrl
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, type, startDate, endDate, weekNumber,
          totalTrades, missedTrades, executionCoefficient, winRate, followingPlan,
          narrativeAccuracy, gainedRR, potentialRR, averageRR, profit,
          profitFactor, realisedPL, averagePL, averageLoss, videoUrl
        ],
        function(err) {
          if (err) {
            console.error('Error saving performance analysis:', err);
            reject(err);
          } else {
            console.log('Performance analysis saved with ID:', id);
            resolve(id);
          }
        }
      );
    });
  }

  // Метод для отримання всіх аналізів продуктивності за типом
  async getPerformanceAnalyses(type) {
    return new Promise((resolve, reject) => {
      const query = type 
        ? `SELECT * FROM performance_analysis WHERE type = ? ORDER BY startDate DESC`
        : `SELECT * FROM performance_analysis ORDER BY startDate DESC`;
      
      const params = type ? [type] : [];
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Error getting performance analyses:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Метод для отримання конкретного аналізу продуктивності за ID
  async getPerformanceAnalysis(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM performance_analysis WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.error('Error getting performance analysis:', err);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  // Метод для оновлення аналізу продуктивності
  async updatePerformanceAnalysis(id, analysis) {
    return new Promise((resolve, reject) => {
      const {
        type, startDate, endDate, weekNumber,
        totalTrades, missedTrades, executionCoefficient, winRate, followingPlan,
        narrativeAccuracy, gainedRR, potentialRR, averageRR, profit,
        profitFactor, realisedPL, averagePL, averageLoss, videoUrl
      } = analysis;

      this.db.run(
        `UPDATE performance_analysis SET
          type = ?,
          startDate = ?,
          endDate = ?,
          weekNumber = ?,
          totalTrades = ?,
          missedTrades = ?,
          executionCoefficient = ?,
          winRate = ?,
          followingPlan = ?,
          narrativeAccuracy = ?,
          gainedRR = ?,
          potentialRR = ?,
          averageRR = ?,
          profit = ?,
          profitFactor = ?,
          realisedPL = ?,
          averagePL = ?,
          averageLoss = ?,
          videoUrl = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          type, startDate, endDate, weekNumber,
          totalTrades, missedTrades, executionCoefficient, winRate, followingPlan,
          narrativeAccuracy, gainedRR, potentialRR, averageRR, profit,
          profitFactor, realisedPL, averagePL, averageLoss, videoUrl,
          id
        ],
        function(err) {
          if (err) {
            console.error('Error updating performance analysis:', err);
            reject(err);
          } else {
            console.log('Performance analysis updated with ID:', id);
            resolve(id);
          }
        }
      );
    });
  }

  // Метод для видалення аналізу продуктивності
  async deletePerformanceAnalysis(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM performance_analysis WHERE id = ?`,
        [id],
        function(err) {
          if (err) {
            console.error('Error deleting performance analysis:', err);
            reject(err);
          } else {
            console.log('Performance analysis deleted with ID:', id);
            resolve(id);
          }
        }
      );
    });
  }

  // Метод для додавання зв'язку з трейдом
  async addTradeToPerformance(performanceId, tradeId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO performance_trades (performance_id, trade_id) VALUES (?, ?)`,
        [performanceId, tradeId],
        function(err) {
          if (err) {
            console.error('Error adding trade to performance:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Метод для додавання зв'язку з пресесією
  async addRoutineToPerformance(performanceId, routineId, routineType) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO performance_routines (performance_id, routine_id, routine_type) VALUES (?, ?, ?)`,
        [performanceId, routineId, routineType],
        function(err) {
          if (err) {
            console.error('Error adding routine to performance:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Метод для отримання трейдів, пов'язаних з аналізом продуктивності
  async getTradesForPerformance(performanceId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT trade_id FROM performance_trades WHERE performance_id = ?`,
        [performanceId],
        (err, rows) => {
          if (err) {
            console.error('Error getting trades for performance:', err);
            reject(err);
          } else {
            resolve(rows.map(row => row.trade_id));
          }
        }
      );
    });
  }

  // Метод для отримання пресесій, пов'язаних з аналізом продуктивності
  async getRoutinesForPerformance(performanceId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT routine_id, routine_type FROM performance_routines WHERE performance_id = ?`,
        [performanceId],
        (err, rows) => {
          if (err) {
            console.error('Error getting routines for performance:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Закриття бази даних
  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing performance database:', err);
      } else {
        console.log('Performance database closed');
      }
    });
  }
}

module.exports = PerformanceDB; 