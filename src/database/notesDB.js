const sqlite3 = require('sqlite3').verbose();

class NotesDB {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Could not connect to database', err);
      } else {
        console.log('Connected to notes database');
        // Включаємо підтримку зовнішніх ключів
        this.db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            console.error('Could not enable foreign keys:', err);
          } else {
            console.log('Foreign keys enabled');
            this.initializeDatabase();
          }
        });
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
          image_id INTEGER,
          source_type TEXT NOT NULL DEFAULT '',
          source_id TEXT NOT NULL DEFAULT '',
          trade_no INTEGER,
          trade_date TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tag_id) REFERENCES note_tags(id),
          FOREIGN KEY (image_id) REFERENCES note_images(id)
        )
      `);

      // Таблиця для зображень нотаток
      this.db.run(`
        CREATE TABLE IF NOT EXISTS note_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          note_id INTEGER NOT NULL,
          image_path TEXT NOT NULL,
          comment TEXT,
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
      console.log('notesDB.addNote отримав дані:', note);

      // Перевірка та встановлення обов'язкових полів
      let sourceType = note.source_type || note.sourceType;
      if (!sourceType) {
        console.warn('No source_type provided, defaulting to "trade"');
        sourceType = 'trade'; // Значення за замовчуванням
      }
      
      let sourceId = note.source_id || note.sourceId;
      if (!sourceId) {
        console.warn('No source_id provided, setting to empty string');
        sourceId = ''; // Порожній рядок як значення за замовчуванням
      }

      // Перевірка наявності обов'язкових полів
      if (!note.title) {
        console.error('Title is required');
        reject(new Error('Title is required'));
        return;
      }

      // Додаткова перевірка даних
      console.log('Підготовлені дані для SQL запиту:', {
        title: note.title,
        content: note.content || note.text || '',
        tagId: note.tagId || note.tag_id || null,
        sourceType: sourceType,
        sourceId: sourceId,
        tradeNo: note.tradeNo || note.trade_no || null,
        tradeDate: note.tradeDate || note.trade_date || null
      });

      this.db.run(
        `INSERT INTO notes (title, content, tag_id, source_type, source_id, trade_no, trade_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          note.title,
          note.content || note.text || '',
          note.tagId || note.tag_id || null,
          sourceType,
          sourceId,
          note.tradeNo || note.trade_no || null,
          note.tradeDate || note.trade_date || null
        ],
        function(err) {
          if (err) {
            console.error('Error creating note:', err);
            reject(err);
          } else {
            console.log('Note created successfully with ID:', this.lastID);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async updateNote(note) {
    return new Promise((resolve, reject) => {
      console.log('Updating note:', note);

      // Перевірка обов'язкових полів
      let sourceType = note.source_type || note.sourceType;
      if (!sourceType) {
        console.warn('No source_type provided, defaulting to "trade"');
        sourceType = 'trade'; // Значення за замовчуванням
      }
      
      let sourceId = note.source_id || note.sourceId;
      if (!sourceId) {
        console.warn('No source_id provided, setting to empty string');
        sourceId = ''; // Порожній рядок як значення за замовчуванням
        // reject(new Error('source_id is required'));
        // return;
      }

      // Виводимо повну інформацію про параметри
      console.log('Tag ID параметр:', {
        tagId: note.tagId,
        tag_id: note.tag_id
      });

      // Підготовка параметрів з перевіркою на null/undefined
      const tagId = note.tagId || note.tag_id || null;
      
      const params = [
        note.title || '',
        note.content || note.text || '',
        sourceType,
        sourceId,
        note.trade_no || note.tradeNo || null,
        note.trade_date || note.tradeDate || null,
        tagId,
          note.id
      ];

      const sql = `
        UPDATE notes 
        SET 
          title = ?, 
          content = ?, 
          source_type = ?, 
          source_id = ?, 
          trade_no = ?, 
          trade_date = ?, 
          tag_id = ?,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      console.log('SQL:', sql);
      console.log('Params:', params);

      this.db.run(sql, params, (err) => {
        if (err) {
          console.error('Error updating note:', err);
          reject(err);
        } else {
          console.log('Note updated successfully');
          resolve(true);
        }
      });
    });
  }

  async getNoteById(id) {
    return new Promise((resolve, reject) => {
      console.log(`Отримую нотатку за ID=${id}`);
      
      const sql = `
        SELECT n.*, nt.name as tag_name 
         FROM notes n 
         LEFT JOIN note_tags nt ON n.tag_id = nt.id 
        WHERE n.id = ?
      `;

      this.db.get(sql, [id], async (err, row) => {
        if (err) {
          console.error('Помилка отримання нотатки:', err);
          reject(err);
          return;
        }
        
        if (!row) {
          console.warn(`Нотатка з ID=${id} не знайдена`);
          resolve(null);
          return;
        }
        
        try {
          // Отримуємо зображення для нотатки
          const images = await this.getNoteImages(id);
          console.log(`Знайдено ${images.length} зображень для нотатки ID=${id}`);
          
          // Додаємо зображення до нотатки
          resolve({
            ...row,
            images
          });
        } catch (imagesError) {
          console.error(`Помилка отримання зображень для нотатки ID=${id}:`, imagesError);
          resolve(row); // Повертаємо нотатку без зображень у випадку помилки
        }
      });
    });
  }

  async getNotesBySource(sourceType, sourceId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          n.*,
          nt.name as tag_name,
          nt.id as tag_id,
          GROUP_CONCAT(ni.id || '::' || ni.image_path) as images
         FROM notes n 
         LEFT JOIN note_tags nt ON n.tag_id = nt.id 
        LEFT JOIN note_images ni ON n.id = ni.note_id
         WHERE n.source_type = ? AND n.source_id = ? 
        GROUP BY n.id, n.title, n.content, n.tag_id, n.source_type, n.source_id, n.trade_no, n.trade_date, n.created_at, n.updated_at, nt.name, nt.id
        ORDER BY n.created_at DESC
      `, [sourceType, sourceId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        const notes = rows.map(row => {
          // Перетворюємо рядок з зображеннями в масив об'єктів
          const images = row.images ? row.images.split(',').map(img => {
            const [id, path] = img.split('::');
            return {
              id: parseInt(id),
              image_path: path
            };
          }) : [];
          
          return {
            ...row,
            images,
            tag_id: row.tag_id || null,
            tag_name: row.tag_name || null
          };
        });
        
        resolve(notes);
      });
    });
  }

  async getAllNotes() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT 
          n.*,
          nt.name as tag_name,
          GROUP_CONCAT(ni.id || '::' || ni.image_path) as images,
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
        LEFT JOIN note_images ni ON n.id = ni.note_id
        GROUP BY n.id
        ORDER BY n.created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            console.error('Error getting all notes:', err);
            reject(err);
          } else {
            const notes = rows.map(row => {
              // Перетворюємо рядок з зображеннями в масив об'єктів
              const images = row.images ? row.images.split(',').map(img => {
                const [id, path] = img.split('::');
                return {
                  id: parseInt(id),
                  image_path: path
                };
              }) : [];
              
              return {
                ...row,
                images
              };
            });
            
            resolve(notes);
          }
        }
      );
    });
  }

  async deleteNote(id) {
    return new Promise((resolve, reject) => {
      // Спочатку видаляємо пов'язані зображення
      console.log(`Видалення нотатки з ID=${id} та пов'язаних зображень`);
      
      // Використовуємо транзакцію для забезпечення атомарності операції
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        // Видаляємо пов'язані зображення
        this.db.run('DELETE FROM note_images WHERE note_id = ?', [id], (err) => {
          if (err) {
            console.error(`Помилка видалення зображень для нотатки ID=${id}:`, err);
            this.db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          console.log(`Зображення для нотатки ID=${id} успішно видалені`);
          
          // Видаляємо саму нотатку
          this.db.run('DELETE FROM notes WHERE id = ?', [id], (err) => {
            if (err) {
              console.error(`Помилка видалення нотатки ID=${id}:`, err);
              this.db.run('ROLLBACK');
              reject(err);
              return;
            }
            
            console.log(`Нотатка ID=${id} успішно видалена`);
            this.db.run('COMMIT');
            resolve(true);
          });
        });
      });
    });
  }

  async deleteNotesBySource(sourceType, sourceId) {
    return new Promise((resolve, reject) => {
      console.log(`Видалення нотаток за джерелом: тип=${sourceType}, id=${sourceId}`);
      
      // Спочатку отримуємо ID всіх нотаток, які будуть видалені
      this.db.all(
        'SELECT id FROM notes WHERE source_type = ? AND source_id = ?',
        [sourceType, sourceId],
        (err, rows) => {
          if (err) {
            console.error('Помилка отримання ID нотаток для видалення:', err);
            reject(err);
            return;
          }
          
          const noteIds = rows.map(row => row.id);
          console.log(`Знайдено ${noteIds.length} нотаток для видалення:`, noteIds);
          
          if (noteIds.length === 0) {
            console.log('Нотатки не знайдені, нічого видаляти');
            resolve(true);
            return;
          }
          
          // Використовуємо транзакцію для забезпечення атомарності операції
          this.db.serialize(() => {
            this.db.run('BEGIN TRANSACTION');
            
            // Видаляємо пов'язані зображення для всіх нотаток
            const placeholders = noteIds.map(() => '?').join(',');
            this.db.run(
              `DELETE FROM note_images WHERE note_id IN (${placeholders})`,
              noteIds,
              (err) => {
                if (err) {
                  console.error('Помилка видалення зображень для нотаток:', err);
                  this.db.run('ROLLBACK');
                  reject(err);
                  return;
                }
                
                console.log('Зображення для нотаток успішно видалені');
                
                // Видаляємо самі нотатки
                this.db.run(
                  'DELETE FROM notes WHERE source_type = ? AND source_id = ?',
                  [sourceType, sourceId],
                  (err) => {
                    if (err) {
                      console.error('Помилка видалення нотаток:', err);
                      this.db.run('ROLLBACK');
                      reject(err);
                      return;
                    }
                    
                    console.log('Нотатки успішно видалені');
                    this.db.run('COMMIT');
                    resolve(true);
                  }
                );
              }
            );
          });
        }
      );
    });
  }

  // Методи для роботи з зображеннями
  async addNoteImage(noteId, imagePath, comment = null) {
    return new Promise((resolve, reject) => {
      console.log(`Додавання зображення до нотатки ID=${noteId}`);
      console.log(`Шлях до зображення:`, imagePath);
      console.log(`Коментар до зображення:`, comment);
      
      // Перетворюємо шлях у відносний, щоб забезпечити переносимість
      let relativeImagePath = imagePath;
      
      // Якщо шлях містить base64 дані, зберігаємо як є
      if (imagePath.startsWith('data:')) {
        console.log('Зображення в форматі base64, зберігаємо як є');
      } 
      // Якщо шлях вже починається з 'screenshots/', залишаємо як є
      else if (imagePath.startsWith('screenshots/')) {
        console.log('Шлях вже містить папку screenshots:', imagePath);
      }
      // Якщо шлях містить повний шлях до файлу
      else if (imagePath.includes('/') || imagePath.includes('\\')) {
        // Витягуємо тільки ім'я файлу
        relativeImagePath = require('path').basename(imagePath);
        console.log(`Перетворено на відносний шлях: ${relativeImagePath}`);
      }
      
      // Перевіряємо, чи вже існує зображення з таким ім'ям файлу для даної нотатки
      this.db.get(
        'SELECT id FROM note_images WHERE note_id = ? AND image_path = ?',
        [noteId, relativeImagePath],
        (err, existingImage) => {
          if (err) {
            console.error('Помилка перевірки існуючого зображення:', err);
            reject(err);
            return;
          }
          
          if (existingImage) {
            console.log(`Зображення з шляхом ${relativeImagePath} вже існує для нотатки ID=${noteId}, оновлюємо коментар`);
            
            // Оновлюємо коментар для існуючого зображення
            this.db.run(
              'UPDATE note_images SET comment = ? WHERE id = ?',
              [comment, existingImage.id],
              (err) => {
                if (err) {
                  console.error('Помилка оновлення коментаря до зображення:', err);
                  reject(err);
                } else {
                  console.log(`Коментар до зображення ID=${existingImage.id} оновлено`);
                  resolve(existingImage.id);
                }
              }
            );
            return;
          }
          
          // Зображення не знайдено, додаємо нове
          this.db.run(
            'INSERT INTO note_images (note_id, image_path, comment) VALUES (?, ?, ?)',
            [noteId, relativeImagePath, comment],
            function(err) {
              if (err) {
                console.error('Помилка додавання зображення:', err);
                reject(err);
              } else {
                console.log(`Зображення додано успішно з ID=${this.lastID}`);
                resolve(this.lastID);
              }
            }
          );
        }
      );
    });
  }

  async getNoteImages(noteId) {
    return new Promise((resolve, reject) => {
      console.log(`Отримую зображення для нотатки ID=${noteId}`);
      
      const sql = `
        SELECT 
          id,
          note_id,
          image_path,
          comment,
          created_at
        FROM note_images 
        WHERE note_id = ?
        ORDER BY created_at ASC
      `;

      console.log('SQL запит для зображень:', sql);
      console.log('Параметр noteId:', noteId);

      this.db.all(sql, [noteId], (err, rows) => {
        if (err) {
          console.error('Помилка отримання зображень нотатки:', err);
          reject(err);
        } else {
          console.log(`Знайдено ${rows.length} зображень для нотатки ID=${noteId}:`, rows);
          
          // Детальне логування знайдених шляхів зображень
          rows.forEach((row, index) => {
            console.log(`Зображення ${index + 1}:`, {
              id: row.id,
              note_id: row.note_id,
              image_path: row.image_path,
              comment: row.comment,
              created_at: row.created_at
            });
          });
          
          resolve(rows);
        }
      });
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

  async updateNoteImageComment(imageId, comment) {
    return new Promise((resolve, reject) => {
      console.log(`Оновлення коментаря для зображення ID=${imageId}:`, comment);
      
      this.db.run(
        'UPDATE note_images SET comment = ? WHERE id = ?',
        [comment, imageId],
        (err) => {
          if (err) {
            console.error('Помилка оновлення коментаря до зображення:', err);
            reject(err);
          } else {
            console.log(`Коментар до зображення ID=${imageId} успішно оновлено`);
            resolve(true);
          }
        }
      );
    });
  }

  async updateNotesWithTradeData(tradesDb, tradeId) {
    return new Promise((resolve, reject) => {
      console.log('Початок оновлення даних нотаток для трейду ID:', tradeId);
      
      // Отримуємо дані трейду
      tradesDb.get(
        'SELECT no, date FROM trades WHERE id = ?',
        [tradeId],
        async (err, trade) => {
          if (err) {
            console.error('Помилка отримання даних трейду:', err);
            reject(err);
            return;
          }

          if (!trade) {
            console.warn(`Трейд з ID=${tradeId} не знайдено`);
            resolve();
            return;
          }

          console.log('Отримані дані трейду:', trade);

          // Отримуємо всі нотатки, пов'язані з цим трейдом
          this.db.all(
            `SELECT id FROM notes WHERE source_type = 'trade' AND source_id = ?`,
            [tradeId],
            async (err, notes) => {
              if (err) {
                console.error('Помилка отримання нотаток для трейду:', err);
                reject(err);
                return;
              }

              try {
                console.log(`Знайдено ${notes.length} нотаток для оновлення`);
                
                for (const note of notes) {
                  console.log(`Оновлення даних для нотатки ID=${note.id}`);
                  
                  // Перевіряємо існування нотатки перед оновленням
                  const existingNote = await this.getNoteById(note.id);
                  if (!existingNote) {
                    console.warn(`Нотатка з ID=${note.id} не знайдена, пропускаємо`);
                    continue;
                  }
                  
                  console.log('Оновлення даних нотатки:', {
                    noteId: note.id,
                    tradeNo: trade.no,
                    tradeDate: trade.date
                  });
                  
                  // Оновлюємо нотатку з даними трейду, зберігаючи її ID
                  await new Promise((resolveUpdate, rejectUpdate) => {
                    this.db.run(
                      `UPDATE notes 
                       SET trade_no = ?, trade_date = ? 
                       WHERE id = ?`,
                      [trade.no, trade.date, note.id],
                      (updateErr) => {
                        if (updateErr) {
                          console.error(`Помилка оновлення нотатки ID=${note.id}:`, updateErr);
                          rejectUpdate(updateErr);
                        } else {
                          console.log(`Нотатка ID=${note.id} успішно оновлена`);
                          resolveUpdate();
                        }
                      }
                    );
                  });
                }
                
                console.log('Всі нотатки успішно оновлені');
                resolve(true);
              } catch (error) {
                console.error('Помилка оновлення нотаток з даними трейду:', error);
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

  async updateNotesWithPresessionData(routinesDb, presessionId) {
    return new Promise((resolve, reject) => {
      console.log('Starting updateNotesWithPresessionData for presessionId:', presessionId);
      
      // Отримуємо дані пресесії
      routinesDb.get(
        'SELECT date FROM presessions WHERE id = ?',
        [presessionId],
        async (err, presession) => {
          if (err) {
            console.error('Error getting presession data:', err);
            reject(err);
            return;
          }

          if (!presession) {
            console.log('No presession found for presessionId:', presessionId);
            resolve();
            return;
          }

          console.log('Retrieved presession data:', presession);

          // Отримуємо всі нотатки, пов'язані з цією пресесією
          this.db.all(
            `SELECT id FROM notes WHERE source_type = 'presession' AND source_id = ?`,
            [presessionId],
            async (err, notes) => {
              if (err) {
                console.error('Error getting notes:', err);
                reject(err);
                return;
              }

              try {
                console.log('Number of notes to update:', notes.length);
                for (const note of notes) {
                  console.log('Updating note with presession data:', {
                    noteId: note.id,
                    presessionDate: presession.date
                  });
                  
                  // Оновлюємо нотатку з даними пресесії
                  await new Promise((resolveUpdate, rejectUpdate) => {
                    this.db.run(
                      `UPDATE notes 
                       SET trade_date = ? 
                       WHERE id = ?`,
                      [presession.date, note.id],
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
                console.error('Error updating notes with presession data:', error);
                reject(error);
              }
            }
          );
        }
      );
    });
  }

  async getNote(noteId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          n.*,
          t.name as tag_name 
        FROM notes n
        LEFT JOIN note_tags t ON n.tag_id = t.id 
        WHERE n.id = ?
      `;

      this.db.get(sql, [noteId], (err, row) => {
        if (err) {
          console.error('Error fetching note:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getNotes(sourceType, sourceId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          n.*,
          nt.name as tag_name,
          nt.id as tag_id,
          GROUP_CONCAT(ni.id || '::' || ni.image_path) as images
        FROM notes n
        LEFT JOIN note_tags nt ON n.tag_id = nt.id
        LEFT JOIN note_images ni ON n.id = ni.note_id
        WHERE n.source_type = ? AND n.source_id = ?
        GROUP BY n.id, n.title, n.content, n.tag_id, n.source_type, n.source_id, n.trade_no, n.trade_date, n.created_at, n.updated_at, nt.name, nt.id
        ORDER BY n.created_at DESC
      `, [sourceType, sourceId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        const notes = rows.map(row => {
          // Перетворюємо рядок з зображеннями в масив об'єктів
          const images = row.images ? row.images.split(',').map(img => {
            const [id, path] = img.split('::');
            return {
              id: parseInt(id),
              image_path: path
            };
          }) : [];
          
          return {
            ...row,
            images,
            tag_id: row.tag_id || null,
            tag_name: row.tag_name || null
          };
        });
        
        resolve(notes);
      });
    });
  }
}

module.exports = NotesDB; 