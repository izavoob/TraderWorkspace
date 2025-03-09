const sqlite3 = require('sqlite3').verbose();

class NotesDB {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to database', err);
      } else {
        console.log('Connected to notes database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    this.db.serialize(() => {
      // Таблиця для тегів
      this.db.run(`
        CREATE TABLE IF NOT EXISTS note_tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Додаємо стандартні теги
      const defaultTags = ['Note', 'Mistake'];
      const stmt = this.db.prepare('INSERT OR IGNORE INTO note_tags (name) VALUES (?)');
      defaultTags.forEach(tag => stmt.run(tag));
      stmt.finalize();

      // Таблиця для нотаток з оновленою структурою
      this.db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          tag_id INTEGER,
          source_type TEXT NOT NULL DEFAULT '',
          source_id TEXT NOT NULL DEFAULT '',
          trade_no INTEGER,
          trade_date TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tag_id) REFERENCES note_tags(id)
        )
      `);

      // Таблиця для зображень нотаток
      this.db.run(`
        CREATE TABLE IF NOT EXISTS note_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          note_id INTEGER,
          image_path TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
        )
      `);
    });
  }

  // Методи для роботи з тегами
  async getAllTags() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM note_tags ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async addTag(name) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO note_tags (name) VALUES (?)', [name], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  // Методи для роботи з нотатками
  async addNote(note) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO notes (title, content, tag_id, source_type, source_id, trade_no, trade_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          note.title,
          note.content,
          note.tagId,
          note.sourceType,
          note.sourceId,
          note.tradeNo || null,
          note.tradeDate || null
        ],
        function(err) {
          if (err) {
            console.error('Error creating note:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async updateNote(note) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE notes 
         SET title = ?, content = ?, tag_id = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [note.title, note.content, note.tagId, note.id],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  async getNoteById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT n.*, nt.name as tag_name 
         FROM notes n 
         LEFT JOIN note_tags nt ON n.tag_id = nt.id 
         WHERE n.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getNotesBySource(sourceType, sourceId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT n.*, nt.name as tag_name 
         FROM notes n 
         LEFT JOIN note_tags nt ON n.tag_id = nt.id 
         WHERE n.source_type = ? AND n.source_id = ? 
         ORDER BY n.created_at DESC`,
        [sourceType, sourceId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getAllNotes() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT n.*, nt.name as tag_name,
         CASE 
           WHEN n.source_type = 'trade' THEN n.trade_no 
           ELSE NULL 
         END as tradeNo,
         CASE 
           WHEN n.source_type = 'trade' THEN n.trade_date 
           WHEN n.source_type = 'presession' THEN n.created_at
           ELSE NULL 
         END as tradeDate
         FROM notes n 
         LEFT JOIN note_tags nt ON n.tag_id = nt.id 
         ORDER BY n.created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.error('Error getting all notes:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async deleteNote(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM notes WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async deleteNotesBySource(sourceType, sourceId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM notes WHERE source_type = ? AND source_id = ?',
        [sourceType, sourceId],
        (err) => {
          if (err) {
            console.error('Error deleting notes by source:', err);
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  // Методи для роботи з зображеннями
  async addNoteImage(noteId, imagePath) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO note_images (note_id, image_path) VALUES (?, ?)',
        [noteId, imagePath],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getNoteImages(noteId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM note_images WHERE note_id = ? ORDER BY created_at ASC',
        [noteId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async deleteNoteImage(imageId) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM note_images WHERE id = ?', [imageId], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async updateNotesWithTradeData(tradesDb, tradeId) {
    return new Promise((resolve, reject) => {
      // Отримуємо дані трейду
      tradesDb.get(
        'SELECT no, date FROM trades WHERE id = ?',
        [tradeId],
        async (err, trade) => {
          if (err) {
            console.error('Error getting trade data:', err);
            reject(err);
            return;
          }

          if (!trade) {
            console.log('No trade found for tradeId:', tradeId);
            resolve();
            return;
          }

          console.log('Retrieved trade data:', trade);

          // Отримуємо всі нотатки, пов'язані з цим трейдом
          this.db.all(
            `SELECT id FROM notes WHERE source_type = 'trade' AND source_id = ?`,
            [tradeId],
            async (err, notes) => {
              if (err) {
                console.error('Error getting notes:', err);
                reject(err);
                return;
              }

              try {
                console.log('Number of notes to update:', notes.length);
                for (const note of notes) {
                  console.log('Updating note with trade data:', {
                    noteId: note.id,
                    tradeNo: trade.no,
                    tradeDate: trade.date
                  });
                  
                  // Оновлюємо нотатку з даними трейду
                  await new Promise((resolveUpdate, rejectUpdate) => {
                    this.db.run(
                      `UPDATE notes 
                       SET trade_no = ?, trade_date = ? 
                       WHERE id = ?`,
                      [trade.no, trade.date, note.id],
                      (err) => {
                        if (err) {
                          console.error('Error updating note:', err);
                          rejectUpdate(err);
                        } else {
                          console.log('Note updated successfully');
                          resolveUpdate();
                        }
                      }
                    );
                  });
                }
                console.log('All notes updated successfully');
                resolve();
              } catch (error) {
                console.error('Error updating notes with trade data:', error);
                reject(error);
              }
            }
          );
        }
      );
    });
  }

  async updateAllNotesWithTradeData(tradesDb) {
    return new Promise((resolve, reject) => {
      // Отримуємо всі нотатки, пов'язані з трейдами
      this.db.all(
        `SELECT id, source_id FROM notes WHERE source_type = 'trade'`,
        [],
        async (err, notes) => {
          if (err) {
            console.error('Error getting notes:', err);
            reject(err);
            return;
          }

          try {
            console.log('Number of notes to update:', notes.length);
            for (const note of notes) {
              // Отримуємо дані трейду
              const trade = await new Promise((resolveInner, rejectInner) => {
                tradesDb.get(
                  'SELECT no, date FROM trades WHERE id = ?',
                  [note.source_id],
                  (err, row) => {
                    if (err) {
                      console.error('Error getting trade data:', err);
                      rejectInner(err);
                    } else {
                      console.log('Retrieved trade data:', row);
                      resolveInner(row);
                    }
                  }
                );
              });

              if (trade) {
                console.log('Updating note with trade data:', {
                  noteId: note.id,
                  tradeNo: trade.no,
                  tradeDate: trade.date
                });
                
                // Оновлюємо нотатку з даними трейду
                await new Promise((resolveUpdate, rejectUpdate) => {
                  this.db.run(
                    `UPDATE notes 
                     SET trade_no = ?, trade_date = ? 
                     WHERE id = ?`,
                    [trade.no, trade.date, note.id],
                    (err) => {
                      if (err) {
                        console.error('Error updating note:', err);
                        rejectUpdate(err);
                      } else {
                        console.log('Note updated successfully');
                        resolveUpdate();
                      }
                    }
                  );
                });
              } else {
                console.log('No trade found for source_id:', note.source_id);
              }
            }
            console.log('All notes updated successfully');
            resolve();
          } catch (error) {
            console.error('Error updating notes with trade data:', error);
            reject(error);
          }
        }
      );
    });
  }
}

module.exports = NotesDB; 