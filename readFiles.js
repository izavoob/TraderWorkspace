const fs = require('fs').promises;
const path = require('path');

async function readFiles() {
  const projectDir = ''; // Оновіть шлях, якщо інший
  const filesToRead = [
    'src/App.js',
    'src/components/CreateTrade.js',
    'src/components/GalleryItem.js',
    'src/components/Placeholder.js',
    'src/components/TradeDetail.js',
    'src/components/TradeJournal.js',
    'src/index.js',
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