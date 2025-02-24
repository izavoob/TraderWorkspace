import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import GalleryItem from './components/GalleryItem';
import TradeJournal from './components/TradeJournal';
import TradeDetail from './components/TradeDetail';
import Placeholder from './components/Placeholder';
import CreateTrade from './components/CreateTrade';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a; /* Темний фон для всього екрану */
    overflow: hidden; /* Запобігаємо прокрутці, якщо не потрібно */
  }
`;

const AppContainer = styled.div`
  text-align: center;
  position: relative;
  background-color: #1a1a1a;
  color: #fff;
  margin: 0;
  padding: 20px;
  min-height: 100vh; /* Розтягуємо фон на всю висоту вікна */
  box-sizing: border-box; /* Коректне обрахування розмірів */
  height: 100%; /* Гарантуємо, що займає всю висоту */
  width: 100%; /* Гарантуємо, що займає всю ширину */
`;

const SectionTitle = styled.h2`
  color: #5e2ca5;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;

  &.hidden {
    display: none;
  }
`;

const NavButton = styled.button`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 6.325px 10.14px; /* Збільшуємо на 15% (5.5px -> 6.325px, 8.8px -> 10.14px) */
  margin: 0;
  border-radius: 4px;
  cursor: pointer;
  width: 38px; /* Збільшуємо на 15% (33px -> 37.95px, округлено до 38px) */
  height: 38px; /* Збільшуємо на 15% (33px -> 37.95px, округлено до 38px) */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &.back {
    border-right: 2px solid #4a1a8d;
  }

  &.forward {
    margin-left: -2px;
  }

  &:before {
    font-size: 20.24px; /* Збільшуємо на 15% (17.6px -> 20.24px) */
  }

  &.back::before {
    content: '\2190';
  }

  &.forward::before {
    content: '\2192';
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const GreetingContainer = styled.div`
  margin-top: 20px;
`;

const Greeting = styled.h1`
  color: #5e2ca5;
  margin: 0;
`;

const WorkPhrase = styled.p`
  color: #fff;
  margin-top: 10px;
  font-size: 16px;
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

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
    <>
      <GlobalStyle />
      <AppContainer>
        {!isHome && <SectionTitle>{getSectionTitle()}</SectionTitle>}
        <NavigationButtons className={isHome ? 'hidden' : ''}>
          <NavButton onClick={handleBack} className="back" aria-label="Back" />
          <NavButton onClick={handleForward} className="forward" aria-label="Forward" />
        </NavigationButtons>
        {isHome && (
          <GreetingContainer>
            <Greeting>{getGreeting()}</Greeting>
            <WorkPhrase>Let's get to work!</WorkPhrase>
          </GreetingContainer>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Gallery>
                {galleryItems.map((item) => (
                  <GalleryItem key={item.path} title={item.title} path={item.path} />
                ))}
              </Gallery>
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
      </AppContainer>
    </>
  );
}

export default App;