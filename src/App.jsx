import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Home from './components/Home.jsx';
import TradeJournal from './components/TradeJournal.jsx';
import TradeDetail from './components/TradingJournal/TradeDetail.jsx';
import CreateTrade from './components/TradingJournal/CreateTrade.jsx';
import DailyRoutine from './components/DailyRoutine.jsx';
import PreSessionJournal from './components/PreSessionJournal.jsx';
import PostSessionJournal from './components/PostSessionJournal.jsx';
import Placeholder from './components/Placeholder.jsx';
import PerformanceAnalysis from './components/PerformanceAnalysis.jsx';
import WPA from './components/PerformanceAnalysis/WPA.jsx';
import MPA from './components/PerformanceAnalysis/MPA.jsx';
import QPA from './components/PerformanceAnalysis/QPA.jsx';
import YPA from './components/PerformanceAnalysis/YPA.jsx';
import LearningSection from './components/LearningSection.jsx'; // Додаємо імпорт LearningSection
import Strategy from './components/LearningSection/Strategy.jsx';
import TradingPsychology from './components/LearningSection/TradingPsychology.jsx';
import Notes from './components/LearningSection/Notes.jsx';
import Statistics from './components/Statistics.jsx';
import RiskManagement from './components/RiskManagement.jsx';
import ReportingSystem from './components/ReportingSystem.jsx';
import Settings from './components/Settings.jsx';




const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5e2ca5;
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
  width: 100%;
  overflow-x: hidden;
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
    content: "\\2190";
  }
  &.forward::before {
    content: "\\2192";
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
          <Route path="/daily-routine" element={<DailyRoutine />} />
          <Route path="/daily-routine/pre-session" element={<PreSessionJournal />} />
          <Route path="/daily-routine/post-session" element={<PostSessionJournal />} />
          <Route path="/learning-section" element={<LearningSection />} />
          <Route path="/learning-section/strategy" element={<Strategy />} />
          <Route path="/learning-section/trading-psychology" element={<TradingPsychology />} />
          <Route path="/learning-section/notes" element={<Notes />} />
          <Route path="/performance-analysis" element={<PerformanceAnalysis />} />
          <Route path="/performance-analysis" element={<PerformanceAnalysis />} />
          <Route path="/performance-analysis/wpa" element={<WPA />} />
          <Route path="/performance-analysis/mpa" element={<MPA />} />
          <Route path="/performance-analysis/qpa" element={<QPA />} />
          <Route path="/performance-analysis/ypa" element={<YPA />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/reporting-system" element={<ReportingSystem />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppContainer>
    </>
  );
}

function getSectionTitle(path) {
  switch (path) {
    case '/daily-routine/pre-session':
      return 'PRE-SESSION JOURNAL';
    case '/daily-routine/post-session':
      return 'POST-SESSION JOURNAL';
    case '/learning-section/strategy':
        return 'STRATEGY DEVELOPMENT';
    case '/learning-section/trading-psychology':
        return 'TRADING PSYCHOLOGY';
    case '/notes':
        return 'NOTES';
    case '/daily-routine':
      return 'DAILY ROUTINE';
    case '/#daily-routine':
      return 'DAILY ROUTINE';
    case '/performance-analysis':
      return 'PERFORMANCE ANALYSIS';
    case '/statistics':
      return 'STATISTICS';
    case '/risk-management':
      return 'RISK MANAGEMENT';
    case '/learning-section':
      return 'LEARNING SECTION'; // Оновлюємо для LearningSection
    case '/reporting-system':
      return 'REPORTING SYSTEM';
    case '/settings':
      return 'SETTINGS';
    case '/trade/:id':
      return 'TRADE DETAIL';
    case '/create-trade':
      return 'CREATE TRADE';
    default:
      return '';
  }
}

export default App;