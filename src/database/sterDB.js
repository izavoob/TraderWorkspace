const sqlite3 = require('sqlite3').verbose();

class STERDB {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to STER database:', err);
      } else {
        console.log('Successfully connected to STER database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    // Сначала проверяем существующую структуру таблицы
    this.db.get("PRAGMA table_info(ster_assessments)", (err, rows) => {
      if (err) {
        console.error('Error checking table structure:', err);
        return;
      }
      
      // Создаем таблицу если она не существует
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ster_assessments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          situation TEXT,
          thoughts TEXT,
          emotions TEXT,
          reaction TEXT,
          situationRating INTEGER DEFAULT 0,
          thoughtsRating INTEGER DEFAULT 0,
          emotionsRating INTEGER DEFAULT 0,
          reactionRating INTEGER DEFAULT 0,
          post_session_id INTEGER DEFAULT NULL,
          tags TEXT DEFAULT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      this.db.run(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating STER assessments table:', err);
          return;
        }
        
        console.log('STER assessments table created/verified successfully');
        
        // Теперь проверяем, существуют ли колонки post_session_id и tags
        this.db.all("PRAGMA table_info(ster_assessments)", (err, columns) => {
          if (err) {
            console.error('Error getting columns info:', err);
            return;
          }
          
          const columnNames = columns.map(col => col.name);
          
          // Проверяем наличие колонки post_session_id
          if (!columnNames.includes('post_session_id')) {
            console.log('Adding post_session_id column to ster_assessments table');
            this.db.run("ALTER TABLE ster_assessments ADD COLUMN post_session_id INTEGER DEFAULT NULL", (err) => {
              if (err) {
                console.error('Error adding post_session_id column:', err);
              } else {
                console.log('post_session_id column added successfully');
              }
            });
          }
          
          // Проверяем наличие колонки tags
          if (!columnNames.includes('tags')) {
            console.log('Adding tags column to ster_assessments table');
            this.db.run("ALTER TABLE ster_assessments ADD COLUMN tags TEXT DEFAULT NULL", (err) => {
              if (err) {
                console.error('Error adding tags column:', err);
              } else {
                console.log('tags column added successfully');
              }
            });
          }
        });
      });
    });
  }

  getAllAssessments() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM ster_assessments ORDER BY date DESC';
      this.db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error getting STER assessments:', err);
          reject(err);
        } else {
          // Преобразуем строковые значения в числа для рейтингов
          const assessments = rows.map(row => ({
            ...row,
            situationRating: parseInt(row.situationRating) || 0,
            thoughtsRating: parseInt(row.thoughtsRating) || 0,
            emotionsRating: parseInt(row.emotionsRating) || 0,
            reactionRating: parseInt(row.reactionRating) || 0
          }));
          resolve(assessments);
        }
      });
    });
  }

  addAssessment(assessment) {
    return new Promise((resolve, reject) => {
      console.log('DB: Adding new assessment:', assessment);
      const query = `
        INSERT INTO ster_assessments (
          date, situation, thoughts, emotions, reaction,
          situationRating, thoughtsRating, emotionsRating, reactionRating,
          post_session_id, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        assessment.date || new Date().toISOString().split('T')[0],
        assessment.situation || '',
        assessment.thoughts || '',
        assessment.emotions || '',
        assessment.reaction || '',
        parseInt(assessment.situationRating) || 0,
        parseInt(assessment.thoughtsRating) || 0,
        parseInt(assessment.emotionsRating) || 0,
        parseInt(assessment.reactionRating) || 0,
        assessment.postSessionId || null,
        assessment.tags || null
      ];

      this.db.run(query, params, function(err) {
        if (err) {
          console.error('DB: Error adding STER assessment:', err);
          reject(err);
        } else {
          console.log('DB: Assessment added successfully, ID:', this.lastID);
          resolve(this.lastID);
        }
      });
    });
  }

  updateAssessment(id, assessment) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE ster_assessments SET
          date = ?,
          situation = ?,
          thoughts = ?,
          emotions = ?,
          reaction = ?,
          situationRating = ?,
          thoughtsRating = ?,
          emotionsRating = ?,
          reactionRating = ?,
          post_session_id = ?,
          tags = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [
        assessment.date || new Date().toISOString().split('T')[0],
        assessment.situation || '',
        assessment.thoughts || '',
        assessment.emotions || '',
        assessment.reaction || '',
        parseInt(assessment.situationRating) || 0,
        parseInt(assessment.thoughtsRating) || 0,
        parseInt(assessment.emotionsRating) || 0,
        parseInt(assessment.reactionRating) || 0,
        assessment.postSessionId || null,
        assessment.tags || null,
        id
      ];

      this.db.run(query, params, (err) => {
        if (err) {
          console.error('Error updating STER assessment:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  deleteAssessment(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM ster_assessments WHERE id = ?';
      this.db.run(query, [id], (err) => {
        if (err) {
          console.error('Error deleting STER assessment:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  getAssessmentsByPostSessionId(postSessionId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM ster_assessments WHERE post_session_id = ? ORDER BY date DESC';
      this.db.all(query, [postSessionId], (err, rows) => {
        if (err) {
          console.error('Error getting STER assessments for postSession:', err);
          reject(err);
        } else {
          // Преобразуем строковые значения в числа для рейтингов
          const assessments = rows.map(row => ({
            ...row,
            situationRating: parseInt(row.situationRating) || 0,
            thoughtsRating: parseInt(row.thoughtsRating) || 0,
            emotionsRating: parseInt(row.emotionsRating) || 0,
            reactionRating: parseInt(row.reactionRating) || 0
          }));
          resolve(assessments);
        }
      });
    });
  }
}

module.exports = STERDB; 