import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import TradeJournal from './components/TradeJournal.jsx';
import TradeDetail from './components/TradeDetail.jsx';
import Placeholder from './components/Placeholder.jsx';
import CreateTrade from './components/CreateTrade.jsx';
import DailyRoutine from './components/DailyRoutine.jsx'; // Добавляем новый компонент
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow: hidden;
  }
`;

const AppContainer = styled.div`
  text-align: center;
  position: relative;
  background-color: #1a1a1a;
  color: #fff;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
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
  padding: 6px 10px;
  margin: 0;
  border-radius: 4px;
  cursor: pointer;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &.back {
    border-right: 2px solid #4a1a8d;
  }

  &.forward {
    margin-left: '-2px';
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:before {
    font-size: 20px;
  }

  &.back::before {
    content: '\2190';
  }

  &.forward::before {
    content: '\2192';
  }
`;

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {!isHome && <h2 style={{ color: '#5e2ca5' }}>{getSectionTitle(location.pathname)}</h2>}
        <NavigationButtons className={isHome ? 'hidden' : ''}>
          <NavButton onClick={handleBack} className="back" aria-label="Back" />
          <NavButton onClick={handleForward} className="forward" aria-label="Forward" />
        </NavigationButtons>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade-journal" element={<TradeJournal />} />
          <Route path="/trade/:id" element={<TradeDetail />} />
          <Route path="/create-trade" element={<CreateTrade />} />
          <Route path="/daily-routine" element={<DailyRoutine />} /> {/* Заменяем Placeholder */}
          <Route path="/performance-analysis" element={<Placeholder title="Performance Analysis" />} />
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

function getSectionTitle(path) {
  switch (path) {
    case '/#daily-routine':
      return 'DAILY ROUTINE';
    case '/#performance-analysis':
      return 'PERFORMANCE ANALYSIS';
    case '/#statistics':
      return 'STATISTICS';
    case '/#risk-management':
      return 'RISK MANAGEMENT';
    case '/#learning-section':
      return 'LEARNING SECTION';
    case '/#reporting-system':
      return 'REPORTING SYSTEM';
    case '/#settings':
      return 'SETTINGS';
    case '/#trade/:id':
      return 'TRADE DETAIL';
    case '/#create-trade':
      return 'CREATE TRADE';
    default:
      return '';
  }
}

export default App;