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
    const queries = [
      `
      CREATE TABLE IF NOT EXISTS demons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        solutions TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS demons_causes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS demon_cause_relations (
        demon_id INTEGER,
        cause_id INTEGER,
        count INTEGER DEFAULT 0,
        PRIMARY KEY (demon_id, cause_id),
        FOREIGN KEY (demon_id) REFERENCES demons (id) ON DELETE CASCADE,
        FOREIGN KEY (cause_id) REFERENCES demons_causes (id) ON DELETE CASCADE
      )
      `
    ];

    // Выполняем запросы последовательно
    this.db.serialize(() => {
      this.db.run('BEGIN TRANSACTION');
      
      queries.forEach(query => {
        this.db.run(query, (err) => {
          if (err) {
            console.error('Error creating database tables:', err);
          }
        });
      });
      
      this.db.run('COMMIT', (err) => {
        if (err) {
          console.error('Error committing transaction:', err);
        } else {
          console.log('Database tables created/verified successfully');
          
          // Проверяем наличие демонов
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
          
          // Проверяем наличие причин
          this.db.get('SELECT COUNT(*) as count FROM demons_causes', [], (err, row) => {
            if (err) {
              console.error('Error counting causes:', err);
              return;
            }
            
            // Если причин нет, добавляем предустановленный список
            if (row.count === 0) {
              console.log('Adding default demon causes...');
              this.addDefaultCauses();
            }
          });

          // После создания таблиц и добавления демонов и причин
          this.db.get('SELECT COUNT(*) as count FROM demon_cause_relations', [], (err, row) => {
            if (err) {
              console.error('Error counting demon-cause relations:', err);
              return;
            }
            
            if (row.count === 0) {
              console.log('Adding sample demon-cause relations...');
              this.addSampleRelations();
            }
          });
        }
      });
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

  addDefaultCauses() {
    const defaultCauses = [
      {
        name: 'Concentration Issues',
        description: 'Factors that interfere with your ability to focus on market analysis and decision-making'
      },
      {
        name: 'External Distractions',
        description: 'Disruptive elements in your environment such as noise, notifications, or other people'
      },
      {
        name: 'Challenge Pressure',
        description: 'Stress from attempting to meet specific trading goals or challenges within a timeframe'
      },
      {
        name: 'Long Period Without Positions',
        description: 'Extended waiting time when you haven\'t entered the market, creating impatience'
      },
      {
        name: 'Financial Needs',
        description: 'Pressure to generate income for personal expenses or financial obligations'
      },
      {
        name: 'Poor Sleep',
        description: 'Insufficient or low-quality sleep before trading sessions affecting cognitive abilities'
      },
      {
        name: 'Chat Influence (External Opinions)',
        description: 'Being swayed by other traders\' opinions from chat rooms or social media'
      },
      {
        name: 'Chat Influence (Boasting)',
        description: 'Desire to share successful trades with others, affecting your decision-making'
      },
      {
        name: 'Family Argument',
        description: 'Emotional disturbances from conflicts with close ones affecting trading psychology'
      },
      {
        name: 'Poor Physical Condition',
        description: 'Illness, fatigue, or other physical issues compromising your trading performance'
      },
      {
        name: 'Series of Stop Losses',
        description: 'Psychological impact of consecutive losing trades closed by stop-loss orders'
      },
      {
        name: 'Previous Position Closed with Profit',
        description: 'Overconfidence following successful trades leading to risky decisions'
      }
    ];

    const insertQuery = `
      INSERT INTO demons_causes (name, description)
      VALUES (?, ?)
    `;

    this.db.serialize(() => {
      this.db.run('BEGIN TRANSACTION');
      
      const stmt = this.db.prepare(insertQuery);
      defaultCauses.forEach(cause => {
        stmt.run(cause.name, cause.description, err => {
          if (err) console.error(`Error adding cause ${cause.name}:`, err);
        });
      });
      stmt.finalize();
      
      this.db.run('COMMIT', err => {
        if (err) {
          console.error('Error committing default causes transaction:', err);
        } else {
          console.log('Added default causes successfully');
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

  // Получение всех причин
  getAllCauses() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM demons_causes ORDER BY name';
      this.db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error getting all causes:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Получение причины по ID
  getCauseById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM demons_causes WHERE id = ?';
      this.db.get(query, [id], (err, row) => {
        if (err) {
          console.error('Error getting cause by id:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Добавление новой причины
  addCause(cause) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO demons_causes (name, description)
        VALUES (?, ?)
      `;
      
      this.db.run(query, [
        cause.name || '',
        cause.description || ''
      ], function(err) {
        if (err) {
          console.error('Error adding cause:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  // Обновление причины
  updateCause(id, cause) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE demons_causes
        SET name = ?,
            description = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      this.db.run(query, [
        cause.name || '',
        cause.description || '',
        id
      ], function(err) {
        if (err) {
          console.error('Error updating cause:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Удаление причины
  deleteCause(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM demons_causes WHERE id = ?';
      this.db.run(query, [id], function(err) {
        if (err) {
          console.error('Error deleting cause:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Связывание демона с причиной
  connectDemonToCause(demonId, causeId, count = 1) {
    return new Promise((resolve, reject) => {
      const checkQuery = 'SELECT count FROM demon_cause_relations WHERE demon_id = ? AND cause_id = ?';
      
      this.db.get(checkQuery, [demonId, causeId], (err, row) => {
        if (err) {
          console.error('Error checking demon-cause relation:', err);
          reject(err);
          return;
        }
        
        let query;
        let params;
        
        if (row) {
          // Обновляем существующую связь
          query = 'UPDATE demon_cause_relations SET count = count + ? WHERE demon_id = ? AND cause_id = ?';
          params = [count, demonId, causeId];
        } else {
          // Создаем новую связь
          query = 'INSERT INTO demon_cause_relations (demon_id, cause_id, count) VALUES (?, ?, ?)';
          params = [demonId, causeId, count];
        }
        
        this.db.run(query, params, function(err) {
          if (err) {
            console.error('Error connecting demon to cause:', err);
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
    });
  }

  // Получение причин для демона
  getCausesForDemon(demonId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT dc.id, dc.name, dc.description, dcr.count
        FROM demons_causes dc
        JOIN demon_cause_relations dcr ON dc.id = dcr.cause_id
        WHERE dcr.demon_id = ?
        ORDER BY dcr.count DESC
      `;
      
      this.db.all(query, [demonId], (err, rows) => {
        if (err) {
          console.error('Error getting causes for demon:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Получение всей статистики причин
  getCausesStatistics() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          dc.id, 
          dc.name, 
          dc.description, 
          SUM(dcr.count) as total_count
        FROM 
          demons_causes dc
        LEFT JOIN 
          demon_cause_relations dcr ON dc.id = dcr.cause_id
        GROUP BY 
          dc.id
        ORDER BY 
          total_count DESC
      `;
      
      this.db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error getting causes statistics:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Добавление примеров связей для тестирования
  addSampleRelations() {
    // Связывание нескольких демонов с причинами
    const sampleRelations = [
      { demonName: 'FOMO', causeName: 'Financial Needs', count: 5 },
      { demonName: 'FOMO', causeName: 'Chat Influence (External Opinions)', count: 3 },
      { demonName: 'Inattentiveness', causeName: 'External Distractions', count: 4 },
      { demonName: 'Inattentiveness', causeName: 'Poor Sleep', count: 2 },
      { demonName: 'Overconfidence', causeName: 'Previous Position Closed with Profit', count: 6 },
      { demonName: 'Fear of missing profits', causeName: 'Financial Needs', count: 3 },
      { demonName: 'Breaking the plan', causeName: 'Concentration Issues', count: 2 },
      { demonName: 'Impulsive position opening', causeName: 'Long Period Without Positions', count: 4 }
    ];

    // Функция для поиска ID демона по имени
    const findDemonId = (name) => {
      return new Promise((resolve, reject) => {
        this.db.get('SELECT id FROM demons WHERE name = ?', [name], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? row.id : null);
          }
        });
      });
    };

    // Функция для поиска ID причины по имени
    const findCauseId = (name) => {
      return new Promise((resolve, reject) => {
        this.db.get('SELECT id FROM demons_causes WHERE name = ?', [name], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? row.id : null);
          }
        });
      });
    };

    // Добавляем связи
    const addRelation = async (demonName, causeName, count) => {
      try {
        const demonId = await findDemonId(demonName);
        const causeId = await findCauseId(causeName);
        
        if (demonId && causeId) {
          await this.connectDemonToCause(demonId, causeId, count);
          console.log(`Added relation: ${demonName} -> ${causeName} (${count})`);
        }
      } catch (error) {
        console.error(`Error adding relation for ${demonName} -> ${causeName}:`, error);
      }
    };

    // Выполняем добавление связей
    sampleRelations.forEach(relation => {
      addRelation(relation.demonName, relation.causeName, relation.count);
    });
  }
}

module.exports = DemonsDB; 