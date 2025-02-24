const fs = require('fs').promises;
const path = require('path');

async function readFiles() {
  const projectDir = ''; // Оновіть шлях, якщо інший
  const filesToRead = [
    'src/App.jsx', // Оновлено з .js на .jsx, як ми перейменували
    'src/components/CreateTrade.jsx', // Оновлено з .js на .jsx
    'src/components/GalleryItem.jsx', // Оновлено з .js на .jsx
    'src/components/Placeholder.jsx', // Оновлено з .js на .jsx
    'src/components/TradeDetail.jsx', // Оновлено з .js на .jsx
    'src/components/TradeJournal.jsx', // Оновлено з .js на .jsx
    'src/index.jsx', // Оновлено з .js на .jsx
    'src/components/Home.jsx', // Новий файл, який ми створили
    'index.html',
    'main.js',
    'preload.js',
    'webpack.config.js',
    'package.json',
    'README.md',
    '.gitignore'
    // Додайте нові файли тут, наприклад: 'src/components/Statistics.js'
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

  await fs.writeFile('projectData.json', JSON.stringify(projectData, null, 2), 'utf8');
  console.log('JSON saved to projectData.json');
}

readFiles().catch(console.error);