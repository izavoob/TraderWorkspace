const sqlite3 = require('sqlite3').verbose();

class RoutinesDB {
  constructor(dbPath) {
    console.log('Initializing RoutinesDB with path:', dbPath);
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to routines database:', err);
      } else {
        console.log('Connected to routines database at:', dbPath);
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    console.log('Initializing routines database tables...');
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
            the_zone TEXT,
            parentSessionId TEXT,
            comment TEXT,
            linked_trades TEXT DEFAULT '[]',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parentSessionId) REFERENCES presessions(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating presessions table:', err);
        } else {
          console.log('Presessions table created/verified successfully');
        }
      });

      // Добавляем колонку comment, если она еще не существует
      this.db.run(`
        ALTER TABLE presessions 
        ADD COLUMN comment TEXT;
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding comment column:', err);
        }
      });

      // Додаємо колонку linked_trades, якщо вона ще не існує
      this.db.run(`
        ALTER TABLE presessions 
        ADD COLUMN linked_trades TEXT DEFAULT '[]';
      `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding linked_trades column:', err);
        }
      });

      // Таблиця для пост-сесій
      this.db.run(`
        CREATE TABLE IF NOT EXISTS postsessions (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            pair TEXT,
            narrative TEXT,
            execution TEXT,
            outcome INTEGER DEFAULT 0,
            routine_execution INTEGER DEFAULT 0,
            plan_outcome INTEGER DEFAULT 0,
            video_url TEXT,
            timeframe_analysis TEXT,
            plan_analysis TEXT,
            performance_analysis TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating postsessions table:', err);
        } else {
          console.log('Postsessions table created/verified successfully');
        }
      });
    });
  }

  // Пре-сесії
  async addPreSession(preSession) {
    return new Promise((resolve, reject) => {
      console.log('Adding new pre-session to database:', this.dbPath);
      console.log('Pre-session data:', preSession);

      // Встановлюємо правильний початковий формат для topDownAnalysis
      const defaultTopDownAnalysis = {
        weekly: { charts: [], notes: '' },
        daily: { charts: [], notes: '' },
        h4: { charts: [], notes: '' },
        h1: { charts: [], notes: '' }
      };

      const processedSession = {
        ...preSession,
        topDownAnalysis: typeof preSession.topDownAnalysis === 'object' && Object.keys(preSession.topDownAnalysis).length > 0
          ? JSON.stringify(preSession.topDownAnalysis)
          : JSON.stringify(defaultTopDownAnalysis),
        plans: typeof preSession.plans === 'object' ? JSON.stringify({
          planA: {
            bias: preSession.plans.planA?.bias || '',
            background: preSession.plans.planA?.background || '',
            what: preSession.plans.planA?.what || '',
            entry: preSession.plans.planA?.entry || '',
            target: preSession.plans.planA?.target || '',
            invalidation: preSession.plans.planA?.invalidation || ''
          },
          planB: {
            bias: preSession.plans.planB?.bias || '',
            background: preSession.plans.planB?.background || '',
            what: preSession.plans.planB?.what || '',
            entry: preSession.plans.planB?.entry || '',
            target: preSession.plans.planB?.target || '',
            invalidation: preSession.plans.planB?.invalidation || ''
          },
          adaptations: preSession.plans.adaptations || []
        }) : preSession.plans,
        chart_processes: typeof preSession.chart_processes === 'object' ? JSON.stringify(preSession.chart_processes) : preSession.chart_processes,
        mindset_preparation: typeof preSession.mindset_preparation === 'object' ? JSON.stringify(preSession.mindset_preparation) : preSession.mindset_preparation,
        the_zone: typeof preSession.the_zone === 'object' ? JSON.stringify(preSession.the_zone) : preSession.the_zone,
        forex_factory_news: typeof preSession.forex_factory_news === 'object' ? JSON.stringify(preSession.forex_factory_news) : preSession.forex_factory_news,
        linked_trades: Array.isArray(preSession.linked_trades) ? JSON.stringify(preSession.linked_trades) : '[]'
      };

      console.log('Processed session data:', processedSession);

      // Generate ID if not provided
      if (!processedSession.id) {
        processedSession.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        console.log('Generated new ID for pre-session:', processedSession.id);
      }

      // Log the SQL query and parameters for debugging
      const sql = `INSERT INTO presessions (
        id, date, pair, narrative, execution, outcome, plan_outcome,
        forex_factory_news, topDownAnalysis, video_url, plans, chart_processes,
        mindset_preparation, the_zone, parentSessionId, comment, linked_trades, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
      
      const params = [
        processedSession.id,
        processedSession.date,
        processedSession.pair,
        processedSession.narrative,
        processedSession.execution,
        processedSession.outcome,
        processedSession.plan_outcome ? 1 : 0,
        processedSession.forex_factory_news,
        processedSession.topDownAnalysis,
        processedSession.video_url,
        processedSession.plans,
        processedSession.chart_processes,
        processedSession.mindset_preparation,
        processedSession.the_zone,
        processedSession.parentSessionId || null,
        processedSession.comment || null,
        processedSession.linked_trades
      ];

      console.log('Executing SQL:', sql);
      console.log('With parameters:', params);

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Error creating pre-session:', err);
          reject(err);
        } else {
          console.log('Pre-session saved successfully with ID:', processedSession.id);
          resolve(processedSession.id);
        }
      });
    });
  }

  async updatePreSession(preSession) {
    return new Promise((resolve, reject) => {
      console.log('Updating pre-session in database:', this.dbPath);
      console.log('Pre-session data:', preSession);

      // Stringify objects before saving
      const processedSession = {
        ...preSession,
        topDownAnalysis: typeof preSession.topDownAnalysis === 'object' ? JSON.stringify(preSession.topDownAnalysis) : JSON.stringify({
          weekly: { charts: [], notes: '' },
          daily: { charts: [], notes: '' },
          h4: { charts: [], notes: '' },
          h1: { charts: [], notes: '' }
        }),
        plans: typeof preSession.plans === 'object' ? JSON.stringify(preSession.plans) : preSession.plans,
        chart_processes: typeof preSession.chart_processes === 'object' ? JSON.stringify(preSession.chart_processes) : preSession.chart_processes,
        mindset_preparation: typeof preSession.mindset_preparation === 'object' ? JSON.stringify(preSession.mindset_preparation) : preSession.mindset_preparation,
        the_zone: typeof preSession.the_zone === 'object' ? JSON.stringify(preSession.the_zone) : preSession.the_zone,
        forex_factory_news: typeof preSession.forex_factory_news === 'object' ? JSON.stringify(preSession.forex_factory_news) : preSession.forex_factory_news,
        linked_trades: typeof preSession.linked_trades === 'object' ? JSON.stringify(preSession.linked_trades) : '[]'
      };

      console.log('Processed session data:', processedSession);

      // Log the SQL query and parameters for debugging
      const sql = `UPDATE presessions SET 
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
        the_zone = ?,
        parentSessionId = ?,
        comment = ?,
        linked_trades = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`;
      
      const params = [
        processedSession.date,
        processedSession.pair,
        processedSession.narrative,
        processedSession.execution,
        processedSession.outcome,
        processedSession.plan_outcome ? 1 : 0,
        processedSession.forex_factory_news,
        processedSession.topDownAnalysis,
        processedSession.video_url,
        processedSession.plans,
        processedSession.chart_processes,
        processedSession.mindset_preparation,
        processedSession.the_zone,
        processedSession.parentSessionId || null,
        processedSession.comment || null,
        processedSession.linked_trades,
        processedSession.id
      ];

      console.log('Executing SQL:', sql);
      console.log('With parameters:', params);

      // First check if the record exists
      this.db.get('SELECT id FROM presessions WHERE id = ?', [processedSession.id], (err, row) => {
        if (err) {
          console.error('Error checking pre-session existence:', err);
          reject(err);
          return;
        }

        if (!row) {
          console.log('Pre-session not found, creating new record instead');
          this.addPreSession(preSession)
            .then(resolve)
            .catch(reject);
          return;
        }

        // Record exists, proceed with update
        this.db.run(sql, params, (err) => {
          if (err) {
            console.error('Error updating pre-session:', err);
            reject(err);
          } else {
            console.log('Pre-session updated successfully');
            resolve(true);
          }
        });
      });
    });
  }

  async getPreSessionById(id) {
    return new Promise((resolve, reject) => {
      console.log('Getting pre-session by ID:', id);
      this.db.get(
        `SELECT * FROM presessions WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            console.error('Error getting pre-session by ID:', err);
            reject(err);
          } else {
            if (row) {
              console.log('Pre-session found:', row);
              // Parse JSON strings back to objects
              try {
                row.topDownAnalysis = JSON.parse(row.topDownAnalysis);
                row.plans = JSON.parse(row.plans);
                row.chart_processes = JSON.parse(row.chart_processes);
                row.mindset_preparation = JSON.parse(row.mindset_preparation);
                row.the_zone = JSON.parse(row.the_zone);
                row.forex_factory_news = JSON.parse(row.forex_factory_news);
              } catch (e) {
                console.error('Error parsing JSON fields:', e);
              }
            } else {
              console.log('No pre-session found with ID:', id);
            }
            resolve(row);
          }
        }
      );
    });
  }

  async getAllPreSessions() {
    return new Promise((resolve, reject) => {
      console.log('Getting all pre-sessions from database:', this.dbPath);
      this.db.all(
        `SELECT * FROM presessions ORDER BY date DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.error('Error getting all pre-sessions:', err);
            reject(err);
          } else {
            console.log(`Retrieved ${rows.length} pre-sessions`);
            // Parse JSON strings back to objects for each row
            rows.forEach(row => {
              try {
                row.topDownAnalysis = JSON.parse(row.topDownAnalysis);
                row.plans = JSON.parse(row.plans);
                row.chart_processes = JSON.parse(row.chart_processes);
                row.mindset_preparation = JSON.parse(row.mindset_preparation);
                row.the_zone = JSON.parse(row.the_zone);
                row.forex_factory_news = JSON.parse(row.forex_factory_news);
              } catch (e) {
                console.error('Error parsing JSON fields for row:', row.id, e);
              }
            });
            resolve(rows);
          }
        }
      );
    });
  }

  async deletePreSession(id) {
    return new Promise((resolve, reject) => {
      console.log('Deleting pre-session with ID:', id);
      this.db.run('DELETE FROM presessions WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Error deleting pre-session:', err);
          reject(err);
        } else {
          console.log('Pre-session deleted successfully');
          resolve(true);
        }
      });
    });
  }

  // Пост-сесії
  async addPostSession(postSession) {
    return new Promise((resolve, reject) => {
      console.log('Adding new post-session to database:', postSession);
      
      // Преобразуем объекты в JSON-строки
      const processedSession = {
        ...postSession,
        timeframeAnalysis: typeof postSession.timeframeAnalysis === 'object' 
          ? JSON.stringify(postSession.timeframeAnalysis) 
          : postSession.timeframeAnalysis,
        planAnalysis: typeof postSession.planAnalysis === 'object' 
          ? JSON.stringify(postSession.planAnalysis) 
          : postSession.planAnalysis,
        performanceAnalysis: typeof postSession.performanceAnalysis === 'object' 
          ? JSON.stringify(postSession.performanceAnalysis) 
          : postSession.performanceAnalysis
      };

      // Генерируем ID, если он не предоставлен
      if (!processedSession.id) {
        processedSession.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        console.log('Generated new ID for post-session:', processedSession.id);
      }
      
      const sql = `
        INSERT INTO postsessions (
          id, date, pair, narrative, execution, outcome,
          routine_execution, plan_outcome, video_url,
          timeframe_analysis, plan_analysis, performance_analysis
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        processedSession.id,
        processedSession.date,
        processedSession.pair,
        processedSession.narrative,
        processedSession.execution,
        processedSession.outcome,
        processedSession.routineExecution ? 1 : 0,
        processedSession.planOutcome ? 1 : 0,
        processedSession.videoUrl,
        processedSession.timeframeAnalysis,
        processedSession.planAnalysis,
        processedSession.performanceAnalysis
      ];
      
      console.log('Executing SQL:', sql);
      console.log('With parameters:', params);
      
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Error adding post session:', err);
          reject(err);
        } else {
          console.log('Post-session saved successfully with ID:', processedSession.id);
          resolve(processedSession.id);
        }
      });
    });
  }

  async updatePostSession(postSession) {
    return new Promise((resolve, reject) => {
      console.log('Updating post-session in database:', postSession);
      
      // Преобразуем объекты в JSON-строки
      const processedSession = {
        ...postSession,
        timeframeAnalysis: typeof postSession.timeframeAnalysis === 'object' 
          ? JSON.stringify(postSession.timeframeAnalysis) 
          : postSession.timeframeAnalysis,
        planAnalysis: typeof postSession.planAnalysis === 'object' 
          ? JSON.stringify(postSession.planAnalysis) 
          : postSession.planAnalysis,
        performanceAnalysis: typeof postSession.performanceAnalysis === 'object' 
          ? JSON.stringify(postSession.performanceAnalysis) 
          : postSession.performanceAnalysis
      };
      
      const sql = `
        UPDATE postsessions SET
          date = ?,
          pair = ?,
          narrative = ?,
          execution = ?,
          outcome = ?,
          routine_execution = ?,
          plan_outcome = ?,
          video_url = ?,
          timeframe_analysis = ?,
          plan_analysis = ?,
          performance_analysis = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const params = [
        processedSession.date,
        processedSession.pair,
        processedSession.narrative,
        processedSession.execution,
        processedSession.outcome,
        processedSession.routineExecution ? 1 : 0,
        processedSession.planOutcome ? 1 : 0,
        processedSession.videoUrl,
        processedSession.timeframeAnalysis,
        processedSession.planAnalysis,
        processedSession.performanceAnalysis,
        processedSession.id
      ];
      
      console.log('Executing SQL:', sql);
      console.log('With parameters:', params);
      
      // Сначала проверяем, существует ли запись
      this.db.get('SELECT id FROM postsessions WHERE id = ?', [processedSession.id], (err, row) => {
        if (err) {
          console.error('Error checking post-session existence:', err);
          reject(err);
          return;
        }

        if (!row) {
          console.log('Post-session not found, creating new record instead');
          this.addPostSession(postSession)
            .then(resolve)
            .catch(reject);
          return;
        }

        // Запись существует, обновляем её
        this.db.run(sql, params, (err) => {
          if (err) {
            console.error('Error updating post-session:', err);
            reject(err);
          } else {
            console.log('Post-session updated successfully');
            resolve(true);
          }
        });
      });
    });
  }

  async getPostSessionById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM postsessions WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('Error getting post session:', err);
          reject(err);
        } else {
          if (row) {
            // Parse JSON fields and convert snake_case to camelCase
            try {
              row.timeframeAnalysis = JSON.parse(row.timeframe_analysis);
              row.planAnalysis = JSON.parse(row.plan_analysis);
              row.performanceAnalysis = JSON.parse(row.performance_analysis);
              row.routineExecution = row.routine_execution;
              row.planOutcome = row.plan_outcome;
              row.videoUrl = row.video_url;
              
              // Delete snake_case fields
              delete row.timeframe_analysis;
              delete row.plan_analysis;
              delete row.performance_analysis;
              delete row.routine_execution;
              delete row.plan_outcome;
              delete row.video_url;
            } catch (e) {
              console.warn('Error parsing JSON fields:', e);
            }
          }
          resolve(row);
        }
      });
    });
  }

  async getAllPostSessions() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM postsessions ORDER BY date DESC';
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Error getting all post sessions:', err);
          reject(err);
        } else {
          // Parse JSON fields and convert snake_case to camelCase for each row
          rows.forEach(row => {
            try {
              row.timeframeAnalysis = JSON.parse(row.timeframe_analysis);
              row.planAnalysis = JSON.parse(row.plan_analysis);
              row.performanceAnalysis = JSON.parse(row.performance_analysis);
              row.routineExecution = row.routine_execution;
              row.planOutcome = row.plan_outcome;
              row.videoUrl = row.video_url;
              
              // Delete snake_case fields
              delete row.timeframe_analysis;
              delete row.plan_analysis;
              delete row.performance_analysis;
              delete row.routine_execution;
              delete row.plan_outcome;
              delete row.video_url;
            } catch (e) {
              console.warn('Error parsing JSON fields:', e);
            }
          });
          resolve(rows);
        }
      });
    });
  }

  async deletePostSession(id) {
    return new Promise((resolve, reject) => {
      console.log('Deleting post-session with ID:', id);
      this.db.run('DELETE FROM postsessions WHERE id = ?', [id], (err) => {
        if (err) {
          console.error('Error deleting post-session:', err);
          reject(err);
        } else {
          console.log('Post-session deleted successfully');
          resolve(true);
        }
      });
    });
  }
}

module.exports = RoutinesDB;
