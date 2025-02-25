const fs = require('fs').promises;
const path = require('path');

async function readFiles() {
  const projectDir = ''; // Оновіть шлях, якщо інший
  const filesToRead = [
    'src/App.jsx', // Оновлено з .js на .jsx
    'src/components/CreateTrade.jsx', // Оновлено з .js на .jsx
    'src/components/GalleryItem.jsx', // Оновлено з .js на .jsx
    'src/components/Placeholder.jsx', // Оновлено з .js на .jsx
    'src/components/TradeDetail.jsx', // Оновлено з .js на .jsx
    'src/components/TradeJournal.jsx', // Оновлено з .js на .jsx, але розділено на підкомпоненти
    'src/components/TradeTableComponent.jsx', // Доданий файл для таблиці трейдів
    'src/components/ActionButtons.jsx', // Доданий файл для кнопок "Edit"/"Delete"
    'src/components/Home.jsx', // Новий файл, доданий для "Home"
    'src/components/Trash.jsx', // Новий файл, доданий для кошика
    'src/index.jsx', // Оновлено з .js на .jsx
    'index.html', // У кореневій директорії, а не в public/
    'main.js',
    'preload.js',
    'webpack.config.js',
    'package.json',
    'README.md',
    '.gitignore'
  ];

  const projectData = {};

  for (const file of filesToRead) {
    const filePath = path.join(projectDir, file);
    try {
      projectData[file] = await fs.readFile(filePath, 'utf8');
      console.log(`Successfully read ${file}`);
    } catch (error) {
      console.error(`Error reading ${file}: ${error.message}`);
    }
  }

  // Зберігаємо JSON у папку dist/
  const outputPath = path.join(projectDir, 'dist', 'projectData.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true }); // Створюємо папку dist/, якщо її немає
  await fs.writeFile(outputPath, JSON.stringify(projectData, null, 2), 'utf8');
  console.log('JSON saved to projectData.json in dist/ directory');
}

readFiles().catch(console.error);