const sqlite3 = require('sqlite3').verbose();

class DemonsDB {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to demons database:', err);
      } else {
        console.log('Successfully connected to demons database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    const query = `
      CREATE TABLE IF NOT EXISTS demons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        solutions TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(query, (err) => {
      if (err) {
        console.error('Error creating demons table:', err);
      } else {
        console.log('Demons table created/verified successfully');
        
        // Проверяем, есть ли уже демоны в базе данных
        this.db.get('SELECT COUNT(*) as count FROM demons', [], (err, row) => {
          if (err) {
            console.error('Error counting demons:', err);
            return;
          }
          
          // Если демонов нет, добавляем предустановленный список
          if (row.count === 0) {
            console.log('Adding default trading demons...');
            this.addDefaultDemons();
          }
        });
      }
    });
  }

  addDefaultDemons() {
    const defaultDemons = [
      {
        name: 'Inattentiveness',
        description: 'Lack of focus and attention during trading sessions, missing important market signals.',
        solutions: 'Create a distraction-free trading environment. Use pre-session checklists. Schedule regular breaks to maintain focus.',
        category: 'Psychological'
      },
      {
        name: 'Fear of missing profits',
        description: 'Anxiety about not maximizing potential profits from a trade, often leading to staying in positions too long.',
        solutions: 'Define clear profit targets before entering a trade. Use trailing stops. Remember that consistent small profits compound over time.',
        category: 'Emotional'
      },
      {
        name: 'FOMO',
        description: 'Fear of missing out on potential trading opportunities, often leading to impulsive entries.',
        solutions: 'Strictly follow your trading plan. Remind yourself that there will always be more opportunities. Focus on quality setups rather than quantity.',
        category: 'Emotional'
      },
      {
        name: 'Breaking the plan',
        description: 'Deviating from your pre-defined trading strategy or rules during market sessions.',
        solutions: 'Review your plan before each session. Keep a visible checklist nearby. Document and review instances when you broke your plan.',
        category: 'Discipline'
      },
      {
        name: 'Impulsive position opening',
        description: 'Opening trades without proper analysis or opening multiple positions in a row after a loss (tilt).',
        solutions: 'Implement a mandatory analysis period before any trade. After a loss, take a short break before considering new positions.',
        category: 'Discipline'
      },
      {
        name: 'Overconfidence',
        description: 'Excessive belief in your trading abilities, often after a series of winning trades.',
        solutions: 'Track your confidence level before each trade. Remember that markets are probabilistic. Review both winning and losing trades with equal scrutiny.',
        category: 'Psychological'
      },
      {
        name: 'Psychological pain and apathy',
        description: 'Emotional distress after losses leading to decreased motivation and detachment from trading.',
        solutions: 'Develop a healthy relationship with losing trades. Focus on process over outcomes. Consider taking a short break if emotions are overwhelming.',
        category: 'Emotional'
      },
      {
        name: 'Excessive risk-taking',
        description: 'Taking larger positions or risks than your trading plan allows, often to recover losses.',
        solutions: 'Use position sizing rules strictly. Set maximum daily risk limits. Use automated stops to prevent manual override.',
        category: 'Risk Management'
      },
      {
        name: 'Anger and disappointment',
        description: 'Strong negative emotions after losing trades affecting subsequent decisions.',
        solutions: 'Practice mindfulness techniques. Maintain an emotional trading journal. Develop a post-loss routine to reset your emotional state.',
        category: 'Emotional'
      },
      {
        name: 'Ignoring entry criteria',
        description: 'Entering trades that don\'t meet all your predefined criteria for a valid setup.',
        solutions: 'Use a checklist for every trade. Score each potential setup against your criteria. Don\'t enter unless all conditions are met.',
        category: 'Discipline'
      },
      {
        name: 'Ignoring exit criteria',
        description: 'Not following predetermined exit plans or breakeven rules, often due to hope or fear.',
        solutions: 'Set and automate exit orders when possible. Review your exit plan before entering a trade. Practice detachment from open positions.',
        category: 'Discipline'
      },
      {
        name: 'Position uncertainty',
        description: 'Lack of confidence in current positions, leading to premature exits or unnecessary adjustments.',
        solutions: 'Thoroughly analyze setups before entry. Document your conviction level. Stick to your original plan unless truly invalidated.',
        category: 'Psychological'
      },
      {
        name: 'Fear before opening a position',
        description: 'Hesitation or anxiety when preparing to enter a trade, even when it meets all criteria.',
        solutions: 'Start with smaller position sizes to build confidence. Use demo trading to practice entries. Focus on following your plan rather than outcomes.',
        category: 'Emotional'
      }
    ];

    const insertQuery = `
      INSERT INTO demons (name, description, solutions, category)
      VALUES (?, ?, ?, ?)
    `;

    // Begin a transaction for faster insertion
    this.db.serialize(() => {
      this.db.run('BEGIN TRANSACTION');
      
      const stmt = this.db.prepare(insertQuery);
      defaultDemons.forEach(demon => {
        stmt.run(demon.name, demon.description, demon.solutions, demon.category, err => {
          if (err) console.error(`Error adding demon ${demon.name}:`, err);
        });
      });
      stmt.finalize();
      
      this.db.run('COMMIT', err => {
        if (err) {
          console.error('Error committing default demons transaction:', err);
        } else {
          console.log('Added default demons successfully');
        }
      });
    });
  }

  getAllDemons() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM demons ORDER BY name';
      this.db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error getting all demons:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getDemonsByCategory(category) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM demons WHERE category = ? ORDER BY name';
      this.db.all(query, [category], (err, rows) => {
        if (err) {
          console.error('Error getting demons by category:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getDemonById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM demons WHERE id = ?';
      this.db.get(query, [id], (err, row) => {
        if (err) {
          console.error('Error getting demon by id:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  addDemon(demon) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO demons (name, description, solutions, category)
        VALUES (?, ?, ?, ?)
      `;
      
      this.db.run(query, [
        demon.name || '',
        demon.description || '',
        demon.solutions || '',
        demon.category || 'Uncategorized'
      ], function(err) {
        if (err) {
          console.error('Error adding demon:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  updateDemon(id, demon) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE demons
        SET name = ?,
            description = ?,
            solutions = ?,
            category = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      this.db.run(query, [
        demon.name || '',
        demon.description || '',
        demon.solutions || '',
        demon.category || 'Uncategorized',
        id
      ], function(err) {
        if (err) {
          console.error('Error updating demon:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  deleteDemon(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM demons WHERE id = ?';
      this.db.run(query, [id], function(err) {
        if (err) {
          console.error('Error deleting demon:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = DemonsDB; 