const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class ExecutionDB {
  constructor(dbPath) {
    console.log(`Initializing ExecutionDB with path: ${dbPath}`);
    try {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Could not connect to execution database', err);
        } else {
          console.log('Connected to execution database successfully');
          this.initializeDatabase();
        }
      });
    } catch (error) {
      console.error('Error creating ExecutionDB instance:', error);
    }
  }

  initializeDatabase() {
    console.log('Initializing execution database tables');
    const defaultData = {
      pointA: ['Fractal Raid', 'FVG', 'SNR', 'RB'],
      trigger: ['Fractal Swing', 'Fractal+FVG', 'FVG'],
      pointB: ['Fractal Swing', 'FVG'],
      entryModel: ['Displacement', 'Inversion', 'IDM', 'SNR'],
      entryTF: ['3m', '5m', '15m', '30m', '1h', '4h'],
      fta: ['Fractal Swing', 'SNR', 'RB', 'FVG'],
      slPosition: ['LTF Manipulation', 'Lunch Manipulation', '30m Raid', '1h Raid', '4h Raid'],
      volumeConfirmation: ['Inversion', 'FVG', 'SNR'],
      
      pairs: ['EURUSD', 'GBPUSD', 'XAUUSD', 'XAGUSD', 'GER40', 'USDJPY'],
      directions: ['Long', 'Short'],
      sessions: ['Asia', 'Frankfurt', 'London', 'Out of OTT', 'New York'],
      positionType: ['Intraday', 'Swing']
    };

    this.db.serialize(() => {
      Object.keys(defaultData).forEach(section => {
        console.log(`Creating table if not exists: ${section}`);
        this.db.run(`CREATE TABLE IF NOT EXISTS ${section} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          trades TEXT DEFAULT '[]',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error(`Error creating table ${section}:`, err);
          } else {
            console.log(`Table ${section} created or already exists`);
          }
        });

        // Перевіряємо чи таблиця порожня перед додаванням значень за замовчуванням
        this.db.get(`SELECT COUNT(*) as count FROM ${section}`, [], (err, row) => {
          if (err) {
            console.error(`Error checking ${section} table:`, err);
            return;
          }

          console.log(`Table ${section} has ${row.count} records`);

          // Додаємо значення за замовчуванням тільки якщо таблиця порожня
          if (row.count === 0) {
            console.log(`Adding default values to ${section} table`);
            const stmt = this.db.prepare(`INSERT OR IGNORE INTO ${section} (name, trades) VALUES (?, '[]')`);
            defaultData[section].forEach(item => {
              console.log(`Adding item to ${section}: ${item}`);
              stmt.run(item, (err) => {
                if (err) {
                  console.error(`Error adding ${item} to ${section}:`, err);
                }
              });
            });
            stmt.finalize();
            console.log(`Default values added to ${section} table`);
          } else {
            console.log(`Table ${section} already has data, skipping default values`);
          }
        });
      });
    });
  }

  async getAllItems(section) {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${section} ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Перетворюємо JSON-рядок trades у масив JavaScript
          rows.forEach(row => {
            try {
              row.trades = JSON.parse(row.trades);
            } catch (e) {
              row.trades = [];
            }
          });
          resolve(rows);
        }
      });
    });
  }

  async addItem(section, name) {
    return new Promise((resolve, reject) => {
      this.db.run(`INSERT INTO ${section} (name, trades) VALUES (?, '[]')`, [name], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async updateItem(section, id, name) {
    return new Promise((resolve, reject) => {
      this.db.run(`UPDATE ${section} SET name = ? WHERE id = ?`, [name, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async deleteItem(section, id) {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM ${section} WHERE id = ?`, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async getItemByName(section, name) {
    return new Promise((resolve, reject) => {
      console.log(`Getting item from section ${section} with name ${name}`);
      this.db.get(`SELECT * FROM ${section} WHERE name = ?`, [name], (err, row) => {
        if (err) {
          console.error(`Error getting item from ${section} with name ${name}:`, err);
          reject(err);
        } else {
          if (row) {
            try {
              console.log(`Found item in ${section}: ${row.name}, trades before parsing:`, row.trades);
              row.trades = JSON.parse(row.trades);
              console.log(`Trades after parsing:`, JSON.stringify(row.trades, null, 2));
            } catch (e) {
              console.error(`Error parsing trades for ${section}/${name}:`, e);
              row.trades = [];
            }
          } else {
            console.log(`No item found in ${section} with name ${name}`);
          }
          resolve(row);
        }
      });
    });
  }

  async updateItemTrades(section, name, tradeData) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Starting updateItemTrades for section: ${section}, name: ${name}, tradeData:`, JSON.stringify(tradeData, null, 2));
        
        // Отримуємо поточні дані для елемента
        const item = await this.getItemByName(section, name);
        
        if (!item) {
          console.error(`Item with name "${name}" not found in section "${section}"`);
          // Спробуємо створити елемент
          try {
            console.log(`Creating new item ${section}/${name}`);
            const newId = await this.addItem(section, name);
            
            if (newId) {
              console.log(`Successfully created ${section}/${name} with ID ${newId}`);
              // Отримуємо створений елемент
              const newItem = await this.getItemByName(section, name);
              
              if (newItem) {
                console.log(`Successfully retrieved new item ${section}/${name}`);
                // Встановлюємо новостворений елемент як поточний
                item = newItem;
              } else {
                console.error(`Failed to retrieve newly created item ${section}/${name}`);
                reject(new Error(`Failed to retrieve newly created item ${section}/${name}`));
                return;
              }
            } else {
              console.error(`Failed to create new item ${section}/${name}`);
              reject(new Error(`Failed to create new item ${section}/${name}`));
              return;
            }
          } catch (createError) {
            console.error(`Error creating item ${section}/${name}:`, createError);
            reject(createError);
            return;
          }
        }
        
        console.log(`Found item in database, current trades:`, JSON.stringify(item.trades, null, 2));
        
        // Додаємо новий трейд або оновлюємо існуючий
        let trades = item.trades || [];
        const existingTradeIndex = trades.findIndex(t => t.id === tradeData.id);
        
        if (existingTradeIndex !== -1) {
          // Оновлюємо існуючий трейд
          console.log(`Updating existing trade at index ${existingTradeIndex}`);
          trades[existingTradeIndex] = tradeData;
          console.log(`Trade ${tradeData.id} updated in trades array`);
        } else {
          // Додаємо новий трейд
          console.log(`Adding new trade with id ${tradeData.id}`);
          trades.push(tradeData);
          console.log(`Trade ${tradeData.id} added to trades array`);
        }
        
        console.log(`Updated trades array:`, JSON.stringify(trades, null, 2));
        
        // Оновлюємо запис у базі даних
        this.db.run(
          `UPDATE ${section} SET trades = ? WHERE name = ?`, 
          [JSON.stringify(trades), name], 
          (err) => {
            if (err) {
              console.error(`Error updating trades in database:`, err);
              reject(err);
            } else {
              console.log(`Successfully updated trades for ${section}/${name}`);
              
              // Перевіряємо, що трейд дійсно був доданий/оновлений
              this.getItemByName(section, name).then(updatedItem => {
                if (updatedItem && updatedItem.trades) {
                  const tradeExists = updatedItem.trades.some(t => t.id === tradeData.id);
                  if (tradeExists) {
                    console.log(`Verified that trade ${tradeData.id} exists in ${section}/${name} trades`);
                  } else {
                    console.error(`Trade ${tradeData.id} was not properly added to ${section}/${name} trades!`);
                    console.log(`Current trades in ${section}/${name}:`, JSON.stringify(updatedItem.trades, null, 2));
                  }
                }
                resolve(true);
              }).catch(verifyErr => {
                console.error(`Error verifying trade update:`, verifyErr);
                resolve(true); // Все ж повертаємо успіх, оскільки оновлення могло пройти успішно
              });
            }
          }
        );
      } catch (error) {
        console.error(`Error in updateItemTrades:`, error);
        reject(error);
      }
    });
  }

  async removeTradeFromItem(section, name, tradeId) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Removing trade ${tradeId} from ${section}/${name}`);
        
        // Отримуємо поточні дані для елемента
        const item = await this.getItemByName(section, name);
        
        if (!item) {
          console.log(`Item with name "${name}" not found in section "${section}". Nothing to remove.`);
          resolve(true);
          return;
        }
        
        console.log(`Found item in database, current trades:`, JSON.stringify(item.trades, null, 2));
        
        // Перевіряємо, чи є масив trades
        if (!item.trades || !Array.isArray(item.trades)) {
          console.log(`No trades array found for ${section}/${name}. Nothing to remove.`);
          resolve(true);
          return;
        }
        
        // Перевіряємо, чи є трейд у масиві
        const existingIndex = item.trades.findIndex(t => t.id === tradeId);
        if (existingIndex === -1) {
          console.log(`Trade ${tradeId} not found in ${section}/${name} trades. Nothing to remove.`);
          resolve(true);
          return;
        }
        
        // Видаляємо трейд з масиву
        const trades = item.trades.filter(t => t.id !== tradeId);
        console.log(`Trade ${tradeId} removed from trades array. New array length: ${trades.length} (was ${item.trades.length})`);
        
        // Оновлюємо запис у базі даних
        this.db.run(
          `UPDATE ${section} SET trades = ? WHERE name = ?`, 
          [JSON.stringify(trades), name], 
          async (err) => {
            if (err) {
              console.error(`Error removing trade from ${section}/${name}:`, err);
              reject(err);
            } else {
              console.log(`Successfully removed trade ${tradeId} from ${section}/${name}`);
              
              // Перевіряємо, що трейд дійсно був видалений
              try {
                const updatedItem = await this.getItemByName(section, name);
                if (updatedItem && updatedItem.trades) {
                  const tradeStillExists = updatedItem.trades.some(t => t.id === tradeId);
                  if (tradeStillExists) {
                    console.error(`Trade ${tradeId} still exists in ${section}/${name} trades after removal!`);
                    console.log(`Current trades in ${section}/${name}:`, JSON.stringify(updatedItem.trades, null, 2));
                    
                    // Спробуємо ще раз видалити, але вже більш прямим методом
                    this.db.run(
                      `UPDATE ${section} SET trades = ? WHERE name = ?`,
                      [JSON.stringify(updatedItem.trades.filter(t => t.id !== tradeId)), name],
                      function(retryErr) {
                        if (retryErr) {
                          console.error(`Second attempt to remove trade failed:`, retryErr);
                        } else {
                          console.log(`Second attempt to remove trade completed. Changes: ${this.changes}`);
                        }
                        resolve(true);
                      }
                    );
                  } else {
                    console.log(`Verified that trade ${tradeId} was removed from ${section}/${name} trades`);
                    resolve(true);
                  }
                } else {
                  console.log(`Item ${section}/${name} not found after update or has no trades array.`);
                  resolve(true);
                }
              } catch (verifyErr) {
                console.error(`Error verifying trade removal:`, verifyErr);
                resolve(true); // Все ж повертаємо успіх, оскільки видалення могло пройти успішно
              }
            }
          }
        );
      } catch (error) {
        console.error(`Error in removeTradeFromItem:`, error);
        reject(error);
      }
    });
  }
}

module.exports = ExecutionDB; 