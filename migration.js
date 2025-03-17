const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Шлях до бази даних
const vaultPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault');
const dbPath = path.join(vaultPath, 'trades.db');

// Колонки, які потрібно видалити
const columnsToRemove = [
  'entry_price',
  'stop_loss',
  'take_profit',
  'risk_reward',
  'outcome',
  'pnl',
  'notes'
];

// Функція для виконання міграції
async function migrateDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Помилка підключення до бази даних:', err);
        reject(err);
        return;
      }

      console.log('Підключено до бази даних');

      try {
        // Отримуємо інформацію про поточну структуру таблиці
        const tableInfo = await getTableInfo(db);
        console.log('Поточна структура таблиці:', tableInfo);

        // Створюємо нову таблицю без непотрібних колонок
        await createNewTable(db, tableInfo);
        console.log('Створено нову таблицю');

        // Копіюємо дані зі старої таблиці в нову
        await copyData(db, tableInfo);
        console.log('Дані скопійовано');

        // Видаляємо стару таблицю і перейменовуємо нову
        await renameTable(db);
        console.log('Таблицю перейменовано');

        console.log('Міграція завершена успішно');
        db.close();
        resolve();
      } catch (error) {
        console.error('Помилка міграції:', error);
        db.close();
        reject(error);
      }
    });
  });
}

// Отримання інформації про структуру таблиці
function getTableInfo(db) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(trades)`, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Фільтруємо колонки, які потрібно залишити
      const columns = rows.filter(row => !columnsToRemove.includes(row.name));
      resolve(columns);
    });
  });
}

// Створення нової таблиці без непотрібних колонок
function createNewTable(db, columns) {
  return new Promise((resolve, reject) => {
    // Формуємо SQL запит для створення нової таблиці
    const columnDefinitions = columns.map(col => {
      return `${col.name} ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`;
    }).join(', ');
    
    const createTableSQL = `CREATE TABLE trades_new (${columnDefinitions})`;
    
    db.run(createTableSQL, [], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Копіювання даних зі старої таблиці в нову
function copyData(db, columns) {
  return new Promise((resolve, reject) => {
    const columnNames = columns.map(col => col.name).join(', ');
    const copyDataSQL = `INSERT INTO trades_new (${columnNames}) SELECT ${columnNames} FROM trades`;
    
    db.run(copyDataSQL, [], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Перейменування таблиць
function renameTable(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`DROP TABLE trades`, [], (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        db.run(`ALTER TABLE trades_new RENAME TO trades`, [], (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  });
}

// Експортуємо функцію міграції
module.exports = { migrateDatabase }; 