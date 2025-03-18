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
    const query = `
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(query, (err) => {
      if (err) {
        console.error('Error creating STER assessments table:', err);
      } else {
        console.log('STER assessments table created/verified successfully');
      }
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
          situationRating, thoughtsRating, emotionsRating, reactionRating
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        parseInt(assessment.reactionRating) || 0
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
}

module.exports = STERDB; 