const fs = require('fs').promises;
const path = require('path');

async function readFiles() {
  const projectDir = ''; // Оновіть шлях, якщо потрібно
  const filesToRead = [
    'README.md', //завжди має записуватися
    'webpack.config.js', //завжди має записуватися
    'preload.js', //завжди має записуватися
    'index.html', //завжди має записуватися
    'main.js', //завжди має записуватися
    'src/App.jsx', //завжди має записуватися
    'src/components/Home.jsx', //завжди має записуватися
    'src/index.jsx', //завжди має записуватися
    'package.json', //завжди має записуватися

    // Ті що нижче, треба змінювати, залежно від того чи планується із ними робота. Логіка така, якщо із Trash.jsx ти не плануєш працювати, то його у список не додаєш, так як боту код цього файла не потрібний.
   // Якщо ти хочеш працювати над чимось, наприклад в Daily Routine, хочеш додати функціонал, то її треба додати в список, щоб бот прочитав весь код DailyRoutine.jsx повністю і давав правильний код.
    'src/components/DailyRoutine.jsx',
    'src/components/PreSessionJournal.jsx'
  ]; // Цей список, це все, що бот знає про програму та її код. Але цього має бути достатньо для роботи. Якщо функціонал передбачає взаємозв'язок декількох компонентів, то до списку треба додати пов'язаний компонент.

  const projectData = {};

  for (const file of filesToRead) {
    const filePath = path.join(projectDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      // Зберігаємо вміст як є, без зміни форматування
      projectData[file] = content;
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