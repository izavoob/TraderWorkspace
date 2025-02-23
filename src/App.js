import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import GalleryItem from './components/GalleryItem';
import TradeJournal from './components/TradeJournal';
import TradeDetail from './components/TradeDetail';
import Placeholder from './components/Placeholder';
import CreateTrade from './components/CreateTrade';
import './App.css';

function App() {
  const location = useLocation(); // Отримуємо поточний маршрут
  const isHome = location.pathname === '/'; // Перевірка, чи це головна сторінка
  const navigate = useNavigate(); // Для навігації

  // Логіка привітання (англійською)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Good Morning!';
    if (hour >= 11 && hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  // Додаємо лог для перевірки шрифту
  const checkFont = () => {
    console.log('Перевірка шрифту Noto Sans:', document.fonts && document.fonts.check('16px Noto Sans'));
    if (document.fonts) {
      document.fonts.ready.then(() => {
        console.log('Шрифти завантажено:', Array.from(document.fonts).map(f => f.family));
      });
    }
  };

  // Викликаємо перевірку при монтуванні компонента
  React.useEffect(() => {
    checkFont();
  }, []);

  // Елементи галереї
  const galleryItems = [
    { title: 'TRADE JOURNAL', path: '/trade-journal' },
    { title: 'DAILY ROUTINE', path: '/daily-routine' },
    { title: 'PERFORMANCE ANALYSIS', path: '/performance-analysis' },
    { title: 'STATISTICS', path: '/statistics' },
    { title: 'RISK MANAGEMENT', path: '/risk-management' },
    { title: 'LEARNING SECTION', path: '/learning-section' },
    { title: 'REPORTING SYSTEM', path: '/reporting-system' },
    { title: 'SETTINGS', path: '/settings' },
  ];

  // Логіка для кнопок "Back" і "Forward" (стрілочки через CSS)
  const handleBack = () => {
    navigate(-1); // Перехід на попередню сторінку
  };

  const handleForward = () => {
    navigate(1); // Перехід на наступну сторінку
  };

  // Отримуємо назву поточного розділу для заголовка
  const getSectionTitle = () => {
    const path = location.pathname;
    if (path === '/trade-journal') return 'TRADE JOURNAL';
    if (path === '/daily-routine') return 'DAILY ROUTINE';
    if (path === '/performance-analysis') return 'PERFORMANCE ANALYSIS';
    if (path === '/statistics') return 'STATISTICS';
    if (path === '/risk-management') return 'RISK MANAGEMENT';
    if (path === '/learning-section') return 'LEARNING SECTION';
    if (path === '/reporting-system') return 'REPORTING SYSTEM';
    if (path === '/settings') return 'SETTINGS';
    if (path === '/trade/:id') return 'TRADE DETAIL'; // Для сторінки трейду
    if (path === '/create-trade') return 'CREATE TRADE';
    return '';
  };

  return (
    <div className="app">
      {!isHome && <h2 className="section-title">{getSectionTitle()}</h2>} {/* Назва розділу зверху */}
      <div className={`navigation-buttons ${isHome ? 'hidden' : ''}`}>
        <button onClick={handleBack} className="nav-button back" aria-label="Back"></button>
        <button onClick={handleForward} className="nav-button forward" aria-label="Forward"></button>
      </div>
      {isHome && (
        <div className="greeting-container">
          <h1 className="greeting">{getGreeting()}</h1>
          <p className="work-phrase">Let's get to work!</p>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <div className="gallery">
              {galleryItems.map((item) => (
                <GalleryItem key={item.path} title={item.title} path={item.path} />
              ))}
            </div>
          }
        />
        <Route path="/trade-journal" element={<TradeJournal />} />
        <Route path="/trade/:id" element={<TradeDetail />} /> {/* Сторінка деталі трейду */}
        <Route path="/create-trade" element={<CreateTrade />} /> {/* Нова сторінка створення трейду */}
        <Route path="/daily-routine" element={<Placeholder title="Daily Routine" />} />
        <Route
          path="/performance-analysis"
          element={<Placeholder title="Performance Analysis" />}
        />
        <Route path="/statistics" element={<Placeholder title="Statistics" />} />
        <Route path="/risk-management" element={<Placeholder title="Risk Management" />} />
        <Route path="/learning-section" element={<Placeholder title="Learning Section" />} />
        <Route path="/reporting-system" element={<Placeholder title="Reporting System" />} />
        <Route path="/settings" element={<Placeholder title="Settings" />} />
      </Routes>
    </div>
  );
}

export default App;