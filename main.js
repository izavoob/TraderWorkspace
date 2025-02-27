const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;

let db = null;
let vaultPath = null;

async function initializeDatabase() {
  if (vaultPath && db) return;
  vaultPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault');
  const dbPath = path.join(vaultPath, 'trades.db');
  try {
    await fs.mkdir(vaultPath, { recursive: true });
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) throw new Error(`Database connection failed: ${err.message}`);
      console.log('SQLite database initialized at:', dbPath);
    });

    // Таблиця trades
    db.run(`
      CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
        date TEXT,
        account TEXT,
        pair TEXT,
        direction TEXT,
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
        conclusion TEXT
      )
    `, (err) => {
      if (err) throw new Error(`Table trades creation failed: ${err.message}`);
    });

    // Таблиця notes
    db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tradeId TEXT,
        title TEXT,
        text TEXT,
        FOREIGN KEY (tradeId) REFERENCES trades(id)
      )
    `, (err) => {
      if (err) throw new Error(`Table notes creation failed: ${err.message}`);
    });

    // Таблиця daily_routines
    db.run(`
      CREATE TABLE IF NOT EXISTS daily_routines (
        date TEXT PRIMARY KEY,
        preSession TEXT,
        postSession TEXT,
        emotions TEXT,
        notes TEXT
      )
    `, (err) => {
      if (err) throw new Error(`Table daily_routines creation failed: ${err.message}`);
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Database initialization failed');
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('index.html');
  initializeDatabase().catch(console.error);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (db) db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('Database closed');
  });
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const ensureDatabaseInitialized = async () => {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) throw new Error('Database not initialized');
};

ipcMain.handle('save-trade', async (event, trade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO trades (id, date, account, pair, direction, positionType, risk, result, rr, profitLoss, gainedPoints, followingPlan, bestTrade, session, pointA, trigger, volumeConfirmation, entryModel, entryTF, fta, slPosition, score, category, topDownAnalysis, execution, management, conclusion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trade.id,
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
        trade.volumeConfirmation || '',
        trade.entryModel || '',
        trade.entryTF || '',
        trade.fta || '',
        trade.slPosition || '',
        trade.score || '',
        trade.category || '',
        JSON.stringify(trade.topDownAnalysis) || '[]',
        JSON.stringify(trade.execution) || '{}',
        JSON.stringify(trade.management) || '{}',
        JSON.stringify(trade.conclusion) || '{}',
      ],
      async (err) => {
        if (err) {
          console.error('Error saving trade:', err);
          reject(err);
          return;
        }
        if (trade.notes && trade.notes.length > 0) {
          for (const note of trade.notes) {
            await new Promise((noteResolve, noteReject) => {
              db.run(
                'INSERT INTO notes (tradeId, title, text) VALUES (?, ?, ?)',
                [trade.id, note.title, note.text],
                (noteErr) => {
                  if (noteErr) noteReject(noteErr);
                  else noteResolve();
                }
              );
            });
          }
        }
        resolve(true);
      }
    );
  });
});

ipcMain.handle('get-trades', async () => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, tradeRows) => {
      if (err) {
        console.error('Error fetching trades:', err);
        reject(err);
        return;
      }
      const trades = tradeRows.map(row => ({
        ...row,
        topDownAnalysis: JSON.parse(row.topDownAnalysis || '[]'),
        execution: JSON.parse(row.execution || '{}'),
        management: JSON.parse(row.management || '{}'),
        conclusion: JSON.parse(row.conclusion || '{}'),
        notes: [],
      }));
      const tradeIds = trades.map(trade => trade.id);
      if (tradeIds.length === 0) {
        resolve(trades);
        return;
      }
      db.all(
        'SELECT * FROM notes WHERE tradeId IN (' + tradeIds.map(() => '?').join(',') + ')',
        tradeIds,
        (err, noteRows) => {
          if (err) {
            console.error('Error fetching notes:', err);
            reject(err);
            return;
          }
          trades.forEach(trade => {
            trade.notes = noteRows
              .filter(note => note.tradeId === trade.id)
              .map(note => ({ title: note.title, text: note.text }));
          });
          resolve(trades || []);
        }
      );
    });
  });
});

ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE trades SET date = ?, account = ?, pair = ?, direction = ?, positionType = ?, risk = ?, result = ?, rr = ?, profitLoss = ?, gainedPoints = ?, followingPlan = ?, bestTrade = ?, session = ?, pointA = ?, trigger = ?, volumeConfirmation = ?, entryModel = ?, entryTF = ?, fta = ?, slPosition = ?, score = ?, category = ?, topDownAnalysis = ?, execution = ?, management = ?, conclusion = ? WHERE id = ?`,
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
        updatedTrade.volumeConfirmation || '',
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
        tradeId,
      ],
      async (err) => {
        if (err) {
          console.error('Error updating trade:', err);
          reject(err);
          return;
        }
        await new Promise((delResolve, delReject) => {
          db.run('DELETE FROM notes WHERE tradeId = ?', [tradeId], (delErr) => {
            if (delErr) delReject(delErr);
            else delResolve();
          });
        });
        if (updatedTrade.notes && updatedTrade.notes.length > 0) {
          for (const note of updatedTrade.notes) {
            await new Promise((noteResolve, noteReject) => {
              db.run(
                'INSERT INTO notes (tradeId, title, text) VALUES (?, ?, ?)',
                [tradeId, note.title, note.text],
                (noteErr) => {
                  if (noteErr) noteReject(noteErr);
                  else noteResolve();
                }
              );
            });
          }
        }
        resolve(true);
      }
    );
  });
});

ipcMain.handle('delete-trade', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
      if (err) {
        console.error('Error deleting trade:', err);
        reject(err);
        return;
      }
      db.run('DELETE FROM notes WHERE tradeId = ?', [tradeId], (noteErr) => {
        if (noteErr) reject(noteErr);
        else resolve(true);
      });
    });
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
        JSON.stringify(routine.preSession || ''),
        JSON.stringify(routine.postSession || ''),
        JSON.stringify(routine.emotions || ''),
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