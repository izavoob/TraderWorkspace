const fs = require('fs').promises;
const path = require('path');

async function readFiles() {
  const projectDir = ''; // Оновіть шлях, якщо інший
  const filesToRead = [
    'src/App.jsx',
    'src/components/CreateTrade.jsx',
    'src/components/DailyRoutine.jsx', // Додано, згадувався раніше
    'src/components/GalleryItem.jsx',
    'src/components/Home.jsx',
    'src/components/TradeTableComponent.jsx', // Доданий файл для таблиці трейдів
    'src/components/ActionButtons.jsx', // Доданий файл для кнопок "Edit"/"Delete"
    'src/components/Home.jsx', // Новий файл, доданий для "Home"
    'src/components/Trash.jsx', // Новий файл, доданий для кошика
    'src/index.jsx',
    'index.html',
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
      const content = await fs.readFile(filePath, 'utf8');
      // Перетворюємо вміст у один рядок, замінюючи перенос рядків на пробіли
      projectData[file] = content.replace(/(\r\n|\n|\r)/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`Successfully read ${file}`);
    } catch (error) {
      console.error(`Error reading ${file}: ${error.message}`);
    }
  }

  // Зберігаємо JSON у папку dist/
  const outputPath = path.join(projectDir, 'dist', 'projectData.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(projectData, null, 2), 'utf8');
  console.log('JSON saved to projectData.json in dist/ directory');
}

readFiles().catch(console.error);