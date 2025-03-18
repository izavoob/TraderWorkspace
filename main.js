const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const AccountsDB = require('./src/database/accountsDB');
const ExecutionDB = require('./src/database/executionDB');
const NotesDB = require('./src/database/notesDB');
const RoutinesDB = require('./src/database/routinesDB');
const PerformanceDB = require('./src/database/performanceDB');
const { migrateDatabase } = require('./migration');
const STERDB = require('./src/database/sterDB');
const DemonsDB = require('./src/database/demonsDB');

let db = null;
let accountsDB = null;
let executionDB = null;
let performanceDB = null;
let vaultPath = null;
let mainWindow = null;
let notesDB;
let routinesDB;
let sterDB = null;
let demonsDB = null;

async function reorderTradeNumbers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM trades ORDER BY date DESC', [], async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      for (let i = 0; i < rows.length; i++) {
        await new Promise((updateResolve, updateReject) => {
          db.run('UPDATE trades SET no = ? WHERE id = ?', [i + 1, rows[i].id], (updateErr) => {
            if (updateErr) updateReject(updateErr);
            else updateResolve();
          });
        });
      }
      resolve();
    });
  });
}

async function initializeDatabase() {
  if (vaultPath && db) return;
  
  vaultPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault');
  console.log('Vault path:', vaultPath);
  
  const dbPath = path.join(vaultPath, 'trades.db');
  const accountsDbPath = path.join(vaultPath, 'accounts.db');
  const executionDbPath = path.join(vaultPath, 'execution.db');
  const performanceDbPath = path.join(vaultPath, 'performance.db');
  const notesDbPath = path.join(vaultPath, 'notes.db');
  const routinesDbPath = path.join(vaultPath, 'routines.db');
  const sterDbPath = path.join(vaultPath, 'ster.db');
  const demonsDbPath = path.join(vaultPath, 'demons.db');
  
  console.log('Database paths:');
  console.log('- trades.db:', dbPath);
  console.log('- accounts.db:', accountsDbPath);
  console.log('- execution.db:', executionDbPath);
  console.log('- performance.db:', performanceDbPath);
  console.log('- notes.db:', notesDbPath);
  console.log('- routines.db:', routinesDbPath);
  console.log('- ster.db:', sterDbPath);
  console.log('- demons.db:', demonsDbPath);
  
  try {
    await fs.mkdir(vaultPath, { recursive: true });
    console.log('Vault directory created/verified');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to trades database:', err);
      } else {
        console.log('trades.db initialized successfully');
        
        // Створюємо таблицю trades, якщо вона не існує
        db.run(`
          CREATE TABLE IF NOT EXISTS trades (
            id TEXT PRIMARY KEY,
            no INTEGER,
            date TEXT,
            pair TEXT,
            direction TEXT,
            account TEXT,
            positionType TEXT,
            risk TEXT,
            result TEXT,
            rr TEXT,
            profitLoss TEXT,
            gainedPoints TEXT,
            followingPlan INTEGER,
            bestTrade INTEGER,
            session TEXT,
            pointA TEXT,
            trigger TEXT,
            volumeConfirmation TEXT,
            entryModel TEXT,
            entryTF TEXT,
            fta TEXT,
            slPosition TEXT,
            score TEXT,
            category TEXT,
            topDownAnalysis TEXT,
            execution TEXT,
            management TEXT,
            conclusion TEXT,
            parentTradeId TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating trades table:', err);
          } else {
            console.log('Trades table created/verified successfully');
            
            // Виконуємо міграцію для видалення непотрібних колонок
            migrateDatabase()
              .then(() => console.log('Database migration completed successfully'))
              .catch(err => console.error('Error during database migration:', err));
          }
        });
      }
    });

    // Initialize accounts database
    accountsDB = new AccountsDB(accountsDbPath);
    
    // Initialize execution database
    executionDB = new ExecutionDB(executionDbPath);

    // Initialize performance database
    performanceDB = new PerformanceDB(performanceDbPath);

    // Initialize notes database
    notesDB = new NotesDB(notesDbPath);
    console.log('notes.db initialized');

    // Initialize routines database
    routinesDB = new RoutinesDB(routinesDbPath);
    if (!routinesDB) {
      throw new Error('Failed to create routinesDB instance');
    }
    console.log('routines.db initialized at:', routinesDbPath);
    console.log('routinesDB:', routinesDB); // Added this line to log routinesDB

    // Initialize STER database
    sterDB = new STERDB(sterDbPath);
    console.log('ster.db initialized at:', sterDbPath);

    // Initialize demons database
    demonsDB = new DemonsDB(demonsDbPath);
    console.log('demons.db initialized at:', demonsDbPath);

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize(); // Додаємо максимізацію вікна
    mainWindow.show();
  });

  mainWindow.loadFile('index.html');
  initializeDatabase().catch(console.error);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (db) db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('Database closed');
  });
  if (process.platform !== 'darwin') app.quit();
});

const ensureDatabaseInitialized = async () => {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) throw new Error('Database not initialized');
};

ipcMain.handle('saveNote', async (event, note) => {
  try {
    if (note.id) {
      await notesDB.updateNote(note);
      return note.id;
    } else {
      const noteId = await notesDB.addNote(note);
      return noteId;
    }
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
});

ipcMain.handle('getAllNotes', async () => {
  try {
    return await notesDB.getAllNotes();
  } catch (error) {
    console.error('Error getting all notes:', error);
    throw error;
  }
});

ipcMain.handle('deleteNote', async (event, id) => {
  return await notesDB.deleteNote(id);
});

ipcMain.on('toggle-sidebar', (event, isCollapsed) => {
  mainWindow.webContents.send('sidebar-state-changed', isCollapsed);
});

ipcMain.handle('get-trade', async (event, id) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Отримання трейду з бази даних, ID:', id);
    
    db.get('SELECT * FROM trades WHERE id = ?', [id], (err, trade) => {
      if (err) {
        console.error('Помилка при отриманні трейду:', err);
        reject(err);
        return;
      }
      
      if (trade) {
        console.log('Трейд знайдено в базі даних');
        console.log('volumeConfirmation до парсингу:', trade.volumeConfirmation);
        
        try {
          // Перетворюємо JSON рядки в об'єкти
          trade.topDownAnalysis = JSON.parse(trade.topDownAnalysis || '[]');
          trade.execution = JSON.parse(trade.execution || '{}');
          trade.management = JSON.parse(trade.management || '{}');
          trade.conclusion = JSON.parse(trade.conclusion || '{}');
          trade.notes = JSON.parse(trade.notes || '[]');
          trade.volumeConfirmation = JSON.parse(trade.volumeConfirmation || '[]');
          
          console.log('volumeConfirmation після парсингу:', trade.volumeConfirmation);
          
          // Переконуємося що no існує
          if (!trade.no) {
            trade.no = id;
          }
          
          resolve(trade);
        } catch (parseError) {
          console.error('Помилка при парсингу JSON:', parseError);
          reject(parseError);
        }
      } else {
        console.log('Трейд не знайдено');
        resolve(null);
      }
    });
  });
});

ipcMain.handle('save-trade', async (event, trade) => {
  await ensureDatabaseInitialized();
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Початок збереження трейду');
      
      // Get next trade number
      const row = await new Promise((res, rej) => {
        db.get('SELECT MAX(no) as maxNo FROM trades', [], (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
      
      const nextNo = (row.maxNo || 0) + 1;
      const volumeConfirmationJson = JSON.stringify(Array.isArray(trade.volumeConfirmation) ? trade.volumeConfirmation : []);
      
      // Save trade
      await new Promise((res, rej) => {
        db.run(
          `INSERT OR REPLACE INTO trades (
            id, no, date, account, pair, direction, positionType, 
            risk, result, rr, profitLoss, gainedPoints, 
            followingPlan, bestTrade, session, pointA, trigger, 
            volumeConfirmation, entryModel, entryTF, fta, 
            slPosition, score, category, topDownAnalysis, 
            execution, management, conclusion, parentTradeId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            trade.id,
            nextNo,
            trade.date || '',
            trade.account || '',
            trade.pair || '',
            trade.direction || '',
            trade.positionType || '',
            trade.risk || '',
            trade.result || '',
            trade.rr || '',
            trade.profitLoss || '',
            trade.gainedPoints || '',
            trade.followingPlan ? 1 : 0,
            trade.bestTrade ? 1 : 0,
            trade.session || '',
            trade.pointA || '',
            trade.trigger || '',
            volumeConfirmationJson,
            trade.entryModel || '',
            trade.entryTF || '',
            trade.fta || '',
            trade.slPosition || '',
            trade.score || '',
            trade.category || '',
            JSON.stringify(trade.topDownAnalysis || []),
            JSON.stringify(trade.execution || {}),
            JSON.stringify(trade.management || {}),
            JSON.stringify(trade.conclusion || {}),
            trade.parentTradeId || null
          ],
          function(err) {
            if (err) rej(err);
            else res();
          }
        );
      });

      // Save notes if present
      if (trade.notes && trade.notes.length > 0) {
        for (const note of trade.notes) {
          await notesDB.addNote({
            ...note,
            sourceType: 'trade',
            sourceId: trade.id,
            tradeNo: nextNo,
            tradeDate: trade.date
          });
        }
      }

      console.log('Трейд успішно збережено');
      resolve(true);
    } catch (error) {
      console.error('Error saving trade:', error);
      reject(error);
    }
  });
});

ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Початок оновлення трейду');
      
      const volumeConfirmationJson = JSON.stringify(Array.isArray(updatedTrade.volumeConfirmation) ? updatedTrade.volumeConfirmation : []);
      
      // Update trade
      await new Promise((res, rej) => {
        db.run(
          `UPDATE trades SET 
            date = ?, account = ?, pair = ?, direction = ?, 
            positionType = ?, risk = ?, result = ?, rr = ?, 
            profitLoss = ?, gainedPoints = ?, followingPlan = ?, 
            bestTrade = ?, session = ?, pointA = ?, trigger = ?, 
            volumeConfirmation = ?, entryModel = ?, entryTF = ?, 
            fta = ?, slPosition = ?, score = ?, category = ?, 
            topDownAnalysis = ?, execution = ?, management = ?, 
            conclusion = ?, parentTradeId = ? 
          WHERE id = ?`,
          [
            updatedTrade.date || '',
            updatedTrade.account || '',
            updatedTrade.pair || '',
            updatedTrade.direction || '',
            updatedTrade.positionType || '',
            updatedTrade.risk || '',
            updatedTrade.result || '',
            updatedTrade.rr || '',
            updatedTrade.profitLoss || '',
            updatedTrade.gainedPoints || '',
            updatedTrade.followingPlan ? 1 : 0,
            updatedTrade.bestTrade ? 1 : 0,
            updatedTrade.session || '',
            updatedTrade.pointA || '',
            updatedTrade.trigger || '',
            volumeConfirmationJson,
            updatedTrade.entryModel || '',
            updatedTrade.entryTF || '',
            updatedTrade.fta || '',
            updatedTrade.slPosition || '',
            updatedTrade.score || '',
            updatedTrade.category || '',
            JSON.stringify(updatedTrade.topDownAnalysis) || '[]',
            JSON.stringify(updatedTrade.execution) || '{}',
            JSON.stringify(updatedTrade.management) || '{}',
            JSON.stringify(updatedTrade.conclusion) || '{}',
            updatedTrade.parentTradeId || null,
            tradeId
          ],
          function(err) {
            if (err) rej(err);
            else res();
          }
        );
      });

      // Update or add notes
      if (updatedTrade.notes && updatedTrade.notes.length > 0) {
        console.log(`Обробка ${updatedTrade.notes.length} нотаток для трейду ID=${tradeId}`);
        for (const note of updatedTrade.notes) {
          if (note.id) {
            console.log(`Оновлення існуючої нотатки з ID=${note.id}`);
            // Оновлюємо існуючу нотатку
            await notesDB.updateNote({
              ...note,
              source_type: 'trade',
              source_id: tradeId,
              trade_no: updatedTrade.no,
              trade_date: updatedTrade.date
            });
            
            // Оновлюємо зображення для нотатки
            if (note.images && note.images.length > 0) {
              for (const image of note.images) {
                if (!image.id) {
                  await notesDB.addNoteImage(note.id, image.image_path);
                }
              }
            }
          } else {
            console.log('Створення нової нотатки для трейду');
            // Створюємо нову нотатку
            const newNoteId = await notesDB.addNote({
              ...note,
              source_type: 'trade',
              source_id: tradeId,
              trade_no: updatedTrade.no,
              trade_date: updatedTrade.date
            });
            
            // Додаємо зображення до нової нотатки
            if (note.images && note.images.length > 0) {
              for (const image of note.images) {
                await notesDB.addNoteImage(newNoteId, image.image_path);
              }
            }
          }
        }
      }

      resolve(true);
    } catch (error) {
      console.error('Error updating trade:', error);
      reject(error);
    }
  });
});

ipcMain.handle('get-trades', async () => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    // Додаємо параметризований запит з можливістю сортування
    const query = `
      SELECT * FROM trades 
      ORDER BY 
      CASE 
        WHEN no IS NULL THEN 1 
        ELSE 0 
      END,
      CAST(no AS INTEGER) DESC
    `;
    
    db.all(query, [], async (err, tradeRows) => {
      if (err) {
        console.error('Error fetching trades:', err);
        reject(err);
        return;
      }

      try {
        const trades = tradeRows.map(row => ({
          ...row,
          topDownAnalysis: JSON.parse(row.topDownAnalysis || '[]'),
          execution: JSON.parse(row.execution || '{}'),
          management: JSON.parse(row.management || '{}'),
          conclusion: JSON.parse(row.conclusion || '{}'),
          volumeConfirmation: JSON.parse(row.volumeConfirmation || '[]'),
          notes: [],
        }));

        // Get notes for each trade using notesDB
        for (const trade of trades) {
          const notes = await notesDB.getNotesBySource('trade', trade.id);
          trade.notes = notes || [];
        }

        resolve(trades);
      } catch (error) {
        console.error('Error processing trades:', error);
        reject(error);
      }
    });
  });
});

ipcMain.handle('delete-trade', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise(async (resolve, reject) => {
    try {
      // Спочатку видаляємо пов'язані нотатки
      await notesDB.deleteNotesBySource('trade', tradeId);
      
      // Потім видаляємо сам трейд
      await new Promise((resolveDelete, rejectDelete) => {
        db.run('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
          if (err) {
            rejectDelete(err);
          } else {
            resolveDelete();
          }
        });
      });
      
      resolve(true);
    } catch (error) {
      console.error('Error deleting trade:', error);
      reject(error);
    }
  });
});

ipcMain.handle('save-file', async (event, file) => {
  await ensureDatabaseInitialized();
  const screenshotsPath = path.join(vaultPath, 'screenshots');
  await fs.mkdir(screenshotsPath, { recursive: true });
  const filePath = path.join(screenshotsPath, `${Date.now()}-${file.name}`);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return filePath;
});

ipcMain.handle('save-blob-as-file', async (event, buffer) => {
  await ensureDatabaseInitialized();
  const screenshotsPath = path.join(vaultPath, 'screenshots');
  await fs.mkdir(screenshotsPath, { recursive: true });
  const filePath = path.join(screenshotsPath, `${Date.now()}.png`);
  await fs.writeFile(filePath, Buffer.from(buffer));
  return filePath;
});

ipcMain.handle('save-daily-routine', async (event, routine) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO daily_routines (date, preSession, postSession, emotions, notes) VALUES (?, ?, ?, ?, ?)`,
      [
        routine.date,
        JSON.stringify(routine.preSession || '[]'),
        JSON.stringify(routine.postSession || '[]'),
        JSON.stringify(routine.emotions || '[]'),
        JSON.stringify(routine.notes || ''),
      ],
      (err) => {
        if (err) {
          console.error('Error saving daily routine:', err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
});

ipcMain.handle('get-daily-routine', async (event, date) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM daily_routines WHERE date = ?', [date], (err, row) => {
      if (err) {
        console.error('Error fetching daily routine:', err);
        reject(err);
      } else if (row) {
        resolve({
          date: row.date,
          preSession: JSON.parse(row.preSession || '[]'),
          postSession: JSON.parse(row.postSession || '[]'),
          emotions: JSON.parse(row.emotions || '[]'),
          notes: JSON.parse(row.notes || '[]'),
        });
      } else {
        resolve({
          date,
          preSession: [],
          postSession: [],
          emotions: [],
          notes: [],
        });
      }
    });
  });
});

ipcMain.handle('saveNoteWithTrade', async (event, note) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO notes (title, text, tradeId) 
      VALUES (?, ?, ?)
    `;
    
    db.run(query, [note.title, note.text, note.tradeId], function(err) {
      if (err) {
        console.error('Error saving note with trade:', err);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
});

ipcMain.handle('getAllNoteTags', async () => {
  return await notesDB.getAllTags();
});

ipcMain.handle('addNoteTag', async (event, name) => {
  return await notesDB.addTag(name);
});

ipcMain.handle('addNote', async (event, note) => {
  try {
    console.log('Received note data:', note);

    // Перевірка та встановлення обов'язкових полів
    if (!note.source_type) {
      console.warn('No source_type provided, defaulting to "trade"');
      note.source_type = 'trade'; // Значення за замовчуванням
    }
    
    if (!note.source_id) {
      console.warn('No source_id provided, setting to empty string');
      note.source_id = ''; // Порожній рядок як значення за замовчуванням
    }

    // Перевірка наявності обов'язкових полів
    if (!note.title || !note.content) {
      console.error('Missing required fields:', { title: note.title, content: note.content });
      throw new Error('Title and content are required');
    }

    // Додаткова перевірка та встановлення тегу
    let tagId = note.tagId || note.tag_id;
    if (!tagId && note.tag_name) {
      // Якщо тег вказаний за назвою, але немає ID, спробуємо знайти або створити
      const existingTag = await new Promise((resolve, reject) => {
        notesDB.db.get('SELECT id FROM note_tags WHERE name = ?', [note.tag_name], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Створюємо новий тег, якщо не існує
        tagId = await notesDB.addTag(note.tag_name);
      }
    }

    // Підготовка даних для додавання
    const noteToAdd = {
      title: note.title,
      content: note.content || note.text,
      source_type: note.source_type,
      source_id: note.source_id,
      tagId: tagId,
      tradeNo: note.tradeNo || note.trade_no,
      tradeDate: note.tradeDate || note.trade_date
    };

    console.log('Note to add:', noteToAdd);

    // Додаємо нотатку
    const noteId = await notesDB.addNote(noteToAdd);

    // Зберігаємо зображення
    if (note.images && note.images.length > 0) {
      for (const image of note.images) {
        if (!image.id) {
          // Якщо це base64 або локальний шлях, зберігаємо як файл
          let imagePath = image.image_path;
          if (image.image_path.startsWith('data:') || !image.image_path.includes('screenshots')) {
            const buffer = image.image_path.startsWith('data:') 
              ? Buffer.from(image.image_path.split(',')[1], 'base64')
              : await require('fs').promises.readFile(image.image_path);
            
            imagePath = await ipcMain.invoke('save-blob-as-file', buffer);
          }
          
          await notesDB.addNoteImage(noteId, imagePath);
        }
      }
    }

    console.log('Note added successfully with ID:', noteId);
    return noteId;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
});

ipcMain.handle('updateNote', async (event, note) => {
  try {
    console.log('[main.js] Оновлення нотатки:', note);
    console.log('[main.js] ID нотатки:', note.id);
    
    // Базова перевірка параметрів
    if (!note || !note.id) {
      console.error('[main.js] ID нотатки відсутній');
      throw new Error('Note ID is required for update');
    }
    
    // Перевіряємо чи існує нотатка в базі даних перед оновленням
    try {
      const existingNote = await notesDB.getNoteById(note.id);
      if (!existingNote) {
        console.error(`[main.js] Нотатка з ID=${note.id} не знайдена в базі даних`);
        
        // Якщо нотатка не знайдена, але ми маємо достатньо даних, створимо нову нотатку зі збереженням ID
        if (note.title && (note.content || note.text)) {
          console.log(`[main.js] Створення нової нотатки з ID=${note.id}`);
          
          // Створюємо SQL запит для додавання нотатки із заданим ID
          const insertResult = await new Promise((resolve, reject) => {
            const sql = `
              INSERT INTO notes (
                id, title, content, tag_id, source_type, source_id, 
                trade_no, trade_date, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            
            const params = [
              note.id,
              note.title,
              note.content || note.text || '',
              note.tagId || note.tag_id || null,
              note.source_type || note.sourceType || 'trade',
              note.source_id || note.sourceId || '',
              note.trade_no || note.tradeNo || null,
              note.trade_date || note.tradeDate || null
            ];
            
            notesDB.db.run(sql, params, function(err) {
              if (err) {
                console.error('[main.js] Помилка створення нотатки зі збереженням ID:', err);
                reject(err);
              } else {
                console.log(`[main.js] Нотатка створена з ID=${note.id}`);
                resolve(true);
              }
            });
          });
          
          // Перевіряємо результат створення нотатки
          if (!insertResult) {
            throw new Error(`Failed to create note with ID=${note.id}`);
          }
          
          // Отримуємо створену нотатку
          const createdNote = await notesDB.getNoteById(note.id);
          return createdNote;
        } else {
          throw new Error(`Note with ID=${note.id} not found and cannot be created due to missing data`);
        }
      }
      
      // Якщо нотатка існує, оновлюємо її
      console.log(`[main.js] Нотатка з ID=${note.id} знайдена, оновлюємо її`);
      await notesDB.updateNote(note);
      
      // Повертаємо оновлену нотатку
      const updatedNote = await notesDB.getNoteById(note.id);
      return updatedNote;
      
    } catch (checkError) {
      console.error('[main.js] Помилка при перевірці існування нотатки:', checkError);
      throw checkError;
    }
  } catch (error) {
    console.error('[main.js] Помилка оновлення нотатки:', error);
    throw error;
  }
});

ipcMain.handle('getNoteById', async (event, id) => {
  return await notesDB.getNoteById(id);
});

ipcMain.handle('getNotesBySource', async (event, sourceType, sourceId) => {
  try {
    console.log(`[main.js] Отримую нотатки для sourceType=${sourceType}, sourceId=${sourceId}`);
    const notes = await notesDB.getNotesBySource(sourceType, sourceId);
    console.log(`[main.js] Отримано ${notes.length} нотаток`);
    
    // Додаємо зображення до кожної нотатки
    const notesWithImages = await Promise.all(notes.map(async (note) => {
      try {
        console.log(`[main.js] Завантаження зображень для нотатки ID=${note.id}`);
        
        // Якщо нотатка вже має зображення від SQL запиту, обробляємо їх
        if (note.images && note.images.length > 0) {
          console.log(`[main.js] Знайдено ${note.images.length} зображень у нотатці з SQL запиту`);
          
          // Обробляємо наявні зображення
          const processedImages = await Promise.all(note.images.map(async (image) => {
            const screenshotsPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'screenshots');
            
            // Якщо шлях не є абсолютним, додаємо повний шлях
            let imagePath = image.image_path;
            if (!path.isAbsolute(imagePath)) {
              imagePath = path.join(screenshotsPath, path.basename(imagePath));
            }
            
            // Перевіряємо чи файл існує
            try {
              await fs.access(imagePath);
              console.log(`[main.js] Файл існує: ${imagePath}`);
              return {
                ...image,
                image_path: imagePath
              };
            } catch (fileError) {
              // Спробуємо пошукати файл в директорії screenshots з використанням тільки базового імені
              try {
                const baseFilename = path.basename(imagePath);
                const alternativePath = path.join(screenshotsPath, baseFilename);
                await fs.access(alternativePath);
                console.log(`[main.js] Знайдено альтернативний шлях: ${alternativePath}`);
                return {
                  ...image,
                  image_path: alternativePath
                };
              } catch (altError) {
                console.warn(`[main.js] Зображення не знайдено: ${imagePath}`);
                return {
                  ...image,
                  image_path: imagePath
                };
              }
            }
          }));
          
          return {
            ...note,
            images: processedImages
          };
        } else {
          // Якщо нотатка не має зображень від SQL запиту, отримуємо їх окремо
          console.log(`[main.js] Немає зображень у SQL запиті, отримую з getNoteImages`);
          const images = await notesDB.getNoteImages(note.id);
          
          if (images && images.length > 0) {
            console.log(`[main.js] Знайдено ${images.length} зображень через getNoteImages`);
            
            // Обробляємо зображення отримані через getNoteImages
            const processedImages = await Promise.all(images.map(async (image) => {
              const screenshotsPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'screenshots');
              
              // Нормалізуємо шлях до зображення
              let imagePath = image.image_path;
              if (!path.isAbsolute(imagePath)) {
                imagePath = path.join(screenshotsPath, path.basename(imagePath));
              }
              
              // Перевіряємо чи файл існує
              try {
                await fs.access(imagePath);
                return {
                  ...image,
                  image_path: imagePath
                };
              } catch (fileError) {
                console.warn(`[main.js] Зображення не знайдено: ${imagePath}`);
                return {
                  ...image,
                  image_path: imagePath
                };
              }
            }));
            
            return {
              ...note,
              images: processedImages
            };
          }
        }
        
        return note;
      } catch (imageError) {
        console.error(`[main.js] Помилка при обробці зображень для нотатки ${note.id}:`, imageError);
        return note;
      }
    }));
    
    return notesWithImages;
  } catch (error) {
    console.error('[main.js] Помилка отримання нотаток за джерелом:', error);
    throw error;
  }
});

ipcMain.handle('updateNotesWithTradeData', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Starting to update notes with trade data for tradeId:', tradeId);
    console.log('Database instance:', db);
    await notesDB.updateNotesWithTradeData(db, tradeId);
    console.log('Notes updated with trade data successfully');
  } catch (error) {
    console.error('Error updating notes with trade data:', error);
    throw error;
  }
});

ipcMain.handle('addNoteImage', async (event, noteId, imagePath, comment) => {
  try {
    console.log('Додавання зображення до нотатки ID:', noteId);
    console.log('Шлях до зображення:', imagePath);
    console.log('Коментар до зображення:', comment);
    
    // Перевіряємо, чи існує нотатка
    const note = await notesDB.getNoteById(noteId);
    if (!note) {
      throw new Error(`Нотатка з ID=${noteId} не знайдена`);
    }
    
    // Додаємо зображення до нотатки
    const imageId = await notesDB.addNoteImage(noteId, imagePath, comment);
    console.log('Зображення додано з ID:', imageId);
    return imageId;
  } catch (error) {
    console.error('Помилка додавання зображення:', error);
    throw error;
  }
});

ipcMain.handle('getNoteImages', async (event, noteId) => {
  try {
    console.log('Отримання зображень для нотатки ID:', noteId);
    
    // Перевіряємо, чи існує нотатка
    const note = await notesDB.getNoteById(noteId);
    if (!note) {
      console.warn(`Нотатка з ID=${noteId} не знайдена`);
      return [];
    }
    
    // Отримуємо зображення для нотатки
    const images = await notesDB.getNoteImages(noteId);
    console.log(`Знайдено ${images.length} зображень для нотатки ID=${noteId}`);
    
    // Перетворюємо відносні шляхи на абсолютні
    const screenshotsPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'screenshots');
    
    const processedImages = images.map(img => {
      // Якщо шлях вже містить повний шлях або це base64, залишаємо як є
      if (img.image_path.startsWith('data:') || 
          img.image_path.includes('://') || 
          path.isAbsolute(img.image_path)) {
        return {
          ...img,
          fullImagePath: img.image_path
        };
      }
      
      // Інакше додаємо шлях до папки screenshots
      return {
        ...img,
        fullImagePath: path.join(screenshotsPath, img.image_path)
      };
    });
    
    return processedImages;
  } catch (error) {
    console.error('Помилка отримання зображень нотатки:', error);
    throw error;
  }
});

ipcMain.handle('deleteNoteImage', async (event, imageId) => {
  try {
    console.log('Видалення зображення з ID:', imageId);
    await notesDB.deleteNoteImage(imageId);
    return true;
  } catch (error) {
    console.error('Помилка видалення зображення:', error);
    throw error;
  }
});

ipcMain.handle('updateNoteImageComment', async (event, imageId, comment) => {
  try {
    console.log('Оновлення коментаря для зображення з ID:', imageId, comment);
    await notesDB.updateNoteImageComment(imageId, comment);
    return true;
  } catch (error) {
    console.error('Помилка оновлення коментаря до зображення:', error);
    throw error;
  }
});

ipcMain.handle('testUpdateNotes', async (event, tradeId) => {
  try {
    await ensureDatabaseInitialized();
    console.log('Testing updateNotesWithTradeData for tradeId:', tradeId);
    await notesDB.updateNotesWithTradeData(db, tradeId);
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
});

// Account management handlers
ipcMain.handle('getAllAccounts', async () => {
  try {
    return accountsDB.getAllAccounts();
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
});

ipcMain.handle('addAccount', async (event, account) => {
  try {
    return accountsDB.addAccount(account);
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
});

ipcMain.handle('updateAccount', async (event, account) => {
  try {
    return accountsDB.updateAccount(account);
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
});

ipcMain.handle('deleteAccount', async (event, id) => {
  try {
    return accountsDB.deleteAccount(id);
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
});

ipcMain.handle('getAccountById', async (event, id) => {
  await ensureDatabaseInitialized();
  return accountsDB.getAccountById(id);
});

ipcMain.handle('updateAccountBalance', async (event, accountId, profitPercent) => {
  await ensureDatabaseInitialized();
  try {
    const account = await accountsDB.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Розраховуємо прибуток/збиток в доларах від поточного currentEquity
    const profitAmount = (account.currentEquity * profitPercent) / 100;
    
    // Оновлюємо баланс
    const newBalance = account.balance + profitAmount;
    
    // Оновлюємо акаунт з новим балансом
    const updatedAccount = {
      ...account,
      balance: newBalance
    };

    return await accountsDB.updateAccount(updatedAccount);
  } catch (error) {
    console.error('Error updating account balance:', error);
    throw error;
  }
});

// Execution database handlers
ipcMain.handle('getAllExecutionItems', async (event, section) => {
  try {
    return await executionDB.getAllItems(section);
  } catch (error) {
    console.error('Error getting execution items:', error);
    throw error;
  }
});

ipcMain.handle('addExecutionItem', async (event, section, name) => {
  try {
    return await executionDB.addItem(section, name);
  } catch (error) {
    console.error('Error adding execution item:', error);
    throw error;
  }
});

ipcMain.handle('updateExecutionItem', async (event, section, id, name) => {
  try {
    return await executionDB.updateItem(section, id, name);
  } catch (error) {
    console.error('Error updating execution item:', error);
    throw error;
  }
});

ipcMain.handle('deleteExecutionItem', async (event, section, id) => {
  try {
    return await executionDB.deleteItem(section, id);
  } catch (error) {
    console.error('Error deleting execution item:', error);
    throw error;
  }
});

// Performance analysis handlers
ipcMain.handle('savePerformanceAnalysis', async (event, analysis) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Saving performance analysis:', analysis);
    const result = await performanceDB.savePerformanceAnalysis(analysis);
    
    // Якщо є трейди, додаємо їх до аналізу
    if (analysis.trades && analysis.trades.length > 0) {
      for (const tradeId of analysis.trades) {
        await performanceDB.addTradeToPerformance(analysis.id, tradeId);
      }
    }
    
    // Якщо є пресесії, додаємо їх до аналізу
    if (analysis.routines && analysis.routines.length > 0) {
      for (const routine of analysis.routines) {
        await performanceDB.addRoutineToPerformance(analysis.id, routine.id, routine.type);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error saving performance analysis:', error);
    throw error;
  }
});

ipcMain.handle('getPerformanceAnalyses', async (event, type) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting performance analyses of type:', type);
    const analyses = await performanceDB.getPerformanceAnalyses(type);
    return analyses;
  } catch (error) {
    console.error('Error getting performance analyses:', error);
    throw error;
  }
});

ipcMain.handle('getPerformanceAnalysis', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting performance analysis by ID:', id);
    const analysis = await performanceDB.getPerformanceAnalysis(id);
    
    // Отримуємо пов'язані трейди
    const tradeIds = await performanceDB.getTradesForPerformance(id);
    analysis.trades = [];
    
    if (tradeIds && tradeIds.length > 0) {
      for (const tradeId of tradeIds) {
        const trade = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM trades WHERE id = ?', [tradeId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
        if (trade) analysis.trades.push(trade);
      }
    }
    
    // Отримуємо пов'язані пресесії
    const routines = await performanceDB.getRoutinesForPerformance(id);
    analysis.routines = [];
    
    if (routines && routines.length > 0) {
      for (const routine of routines) {
        if (routine.routine_type === 'presession') {
          const presession = await routinesDB.getPreSessionById(routine.routine_id);
          if (presession) analysis.routines.push({...presession, type: 'presession'});
        }
      }
    }
    
    return analysis;
  } catch (error) {
    console.error('Error getting performance analysis:', error);
    throw error;
  }
});

ipcMain.handle('updatePerformanceAnalysis', async (event, id, analysis) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Updating performance analysis:', id, analysis);
    const result = await performanceDB.updatePerformanceAnalysis(id, analysis);
    return result;
  } catch (error) {
    console.error('Error updating performance analysis:', error);
    throw error;
  }
});

ipcMain.handle('deletePerformanceAnalysis', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Deleting performance analysis:', id);
    const result = await performanceDB.deletePerformanceAnalysis(id);
    return result;
  } catch (error) {
    console.error('Error deleting performance analysis:', error);
    throw error;
  }
});

// Pre-session handlers
ipcMain.handle('getPresession', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting pre-session by ID:', id);
    const presession = await routinesDB.getPreSessionById(id);
    console.log('Retrieved pre-session:', presession);
    return presession;
  } catch (error) {
    console.error('Error getting pre-session:', error);
    throw error;
  }
});

ipcMain.handle('getAllPresessions', async () => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting all pre-sessions');
    const presessions = await routinesDB.getAllPreSessions();
    console.log(`Retrieved ${presessions.length} pre-sessions`);
    return presessions;
  } catch (error) {
    console.error('Error getting all pre-sessions:', error);
    throw error;
  }
});

ipcMain.handle('savePresession', async (event, presessionData) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Saving pre-session data:', presessionData);
    console.log('Database path:', routinesDB.dbPath);
    
    let result;
    if (presessionData.id) {
      console.log('Updating existing pre-session with ID:', presessionData.id);
      result = await routinesDB.updatePreSession(presessionData);
    } else {
      console.log('Creating new pre-session');
      result = await routinesDB.addPreSession(presessionData);
    }
    
    console.log('Pre-session saved successfully. Result:', result);
    console.log('Database location:', path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'routines.db'));
    
    return { success: true, id: presessionData.id || result };
  } catch (error) {
    console.error('Error saving pre-session:', error);
    throw error;
  }
});

ipcMain.handle('deletePresession', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Deleting pre-session:', id);
    await routinesDB.deletePreSession(id);
    return true;
  } catch (error) {
    console.error('Error deleting pre-session:', error);
    throw error;
  }
});

ipcMain.handle('app-ready', () => {
  return true;
});

ipcMain.handle('updatePresession', async (event, presessionData) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Updating pre-session data:', presessionData);
    const result = await routinesDB.updatePreSession(presessionData);
    console.log('Pre-session updated successfully');
    return result;
  } catch (error) {
    console.error('Error updating presession:', error);
    throw error;
  }
});

ipcMain.handle('updateNotesWithPresessionData', async (event, presessionId) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Starting to update notes with presession data for presessionId:', presessionId);
    await notesDB.updateNotesWithPresessionData(routinesDB.db, presessionId);
    console.log('Notes updated with presession data successfully');
  } catch (error) {
    console.error('Error updating notes with presession data:', error);
    throw error;
  }
});

// Post-session handlers
ipcMain.handle('addPostSession', async (event, postSession) => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.addPostSession(postSession);
  } catch (error) {
    console.error('Error adding post session:', error);
    throw error;
  }
});

ipcMain.handle('updatePostSession', async (event, postSession) => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.updatePostSession(postSession);
  } catch (error) {
    console.error('Error updating post session:', error);
    throw error;
  }
});

ipcMain.handle('getPostSessionById', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.getPostSessionById(id);
  } catch (error) {
    console.error('Error getting post session:', error);
    throw error;
  }
});

ipcMain.handle('getAllPostSessions', async () => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.getAllPostSessions();
  } catch (error) {
    console.error('Error getting all post sessions:', error);
    throw error;
  }
});

// STER Assessment handlers
ipcMain.handle('getSTERAssessments', async () => {
  await ensureDatabaseInitialized();
  return sterDB.getAllAssessments();
});

ipcMain.handle('addSTERAssessment', async (event, assessment) => {
  await ensureDatabaseInitialized();
  return sterDB.addAssessment(assessment);
});

ipcMain.handle('updateSTERAssessment', async (event, id, assessment) => {
  await ensureDatabaseInitialized();
  return sterDB.updateAssessment(id, assessment);
});

ipcMain.handle('deleteSTERAssessment', async (event, id) => {
  await ensureDatabaseInitialized();
  return sterDB.deleteAssessment(id);
});

// Trading Demons handlers
ipcMain.handle('getAllDemons', async () => {
  await ensureDatabaseInitialized();
  return demonsDB.getAllDemons();
});

ipcMain.handle('getDemonsByCategory', async (event, category) => {
  await ensureDatabaseInitialized();
  return demonsDB.getDemonsByCategory(category);
});

ipcMain.handle('getDemonById', async (event, id) => {
  await ensureDatabaseInitialized();
  return demonsDB.getDemonById(id);
});

ipcMain.handle('addDemon', async (event, demon) => {
  await ensureDatabaseInitialized();
  return demonsDB.addDemon(demon);
});

ipcMain.handle('updateDemon', async (event, id, demon) => {
  await ensureDatabaseInitialized();
  return demonsDB.updateDemon(id, demon);
});

ipcMain.handle('deleteDemon', async (event, id) => {
  await ensureDatabaseInitialized();
  return demonsDB.deleteDemon(id);
});