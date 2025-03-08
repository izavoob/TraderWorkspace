import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Home from './components/Home.jsx';
import TradeJournal from './components/TradeJournal.jsx';
import TradeDetail from './components/TradingJournal/TradeDetail.jsx';
import CreateTrade from './components/TradingJournal/CreateTrade.jsx';
import DailyRoutine from './components/DailyRoutine.jsx';
import PreSessionJournal from './components/PreSessionJournal.jsx';
import PreSessionFull from './components/PreSessionFull.jsx';
import PostSessionJournal from './components/PostSessionJournal.jsx';
import Placeholder from './components/Placeholder.jsx';
import PerformanceAnalysis from './components/PerformanceAnalysis.jsx';
import WPA from './components/PerformanceAnalysis/WPA/WPA.jsx';
import CreateWPA from './components/PerformanceAnalysis/WPA/CreateWPA.jsx';
import MPA from './components/PerformanceAnalysis/MPA.jsx';
import QPA from './components/PerformanceAnalysis/QPA.jsx';
import YPA from './components/PerformanceAnalysis/YPA.jsx';
import LearningSection from './components/LearningSection.jsx';
import Strategy from './components/LearningSection/Strategy.jsx';
import TradingPsychology from './components/LearningSection/TradingPsychology.jsx';
import Notes from './components/LearningSection/Notes.jsx';
import Statistics from './components/Statistics.jsx';
import Execution from './components/Statistics/Execution.jsx';
import Analytics from './components/Statistics/Analytics.jsx';
import RiskManagement from './components/RiskManagement.jsx';
import ReportingSystem from './components/ReportingSystem.jsx';
import Settings from './components/Settings.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow: ${props => props.isHome ? 'hidden' : 'visible'}; // Змінюємо auto на visible
  }

  #root {
    height: 100%;
    position: relative;
    overflow: visible; // Додаємо overflow: visible
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

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  overflow-y: ${props => props.isHome ? 'hidden' : 'visible'}; // Змінюємо auto на visible
  opacity: ${props => props.isLoading ? 0 : 1};
  transform: translateY(${props => props.isLoading ? '-20px' : '0'});
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;
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

const PageTitle = styled.h2`
  color: #5e2ca5;
  margin-bottom: 30px;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  position: relative;
  padding-bottom: 10px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #5e2ca5, #7425C9);
    border-radius: 3px;
  }
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    // Показуємо LoadingScreen на 3 секунди
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const getSectionTitle = (path) => {
    if (path.startsWith('/daily-routine/pre-session/')) {
      return 'FULL PRE-SESSION ANALYSIS';
    }

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
      case '/performance-analysis':
        return 'PERFORMANCE ANALYSIS';
      case '/statistics':
        return 'STATISTICS';
      case '/risk-management':
        return 'RISK MANAGEMENT';
      case '/learning-section':
        return 'LEARNING SECTION';
      case '/reporting-system':
        return 'REPORTING SYSTEM';
      case '/settings':
        return 'SETTINGS';
      case '/trade-journal':
        return 'TRADE JOURNAL';
      case '/create-trade':
        return 'CREATE TRADE';
      case '/statistics/execution':
        return 'EXECUTION DATABASE';
      case '/statistics/analytics':
        return 'ANALYTICS';
      default:
        if (path.startsWith('/trade/')) {
          return 'TRADE DETAIL';
        }
        return '';
    }
  };

  return (
    <>
      <GlobalStyle isHome={isHome} />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AppContainer isLoading={isLoading} isHome={isHome}>
          {!isHome && (
            <PageTitle>{getSectionTitle(location.pathname)}</PageTitle>
          )}

          <NavigationButtons className={isHome ? 'hidden' : ''}>
            <NavButton 
              onClick={handleBack} 
              className="back" 
              aria-label="Back"
            />
            <NavButton 
              onClick={handleForward} 
              className="forward" 
              aria-label="Forward"
            />
          </NavigationButtons>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trade-journal" element={<TradeJournal />} />
            <Route path="/trade/:id" element={<TradeDetail />} />
            <Route path="/create-trade" element={<CreateTrade />} />
            <Route path="/daily-routine" element={<DailyRoutine />} />
            <Route path="/daily-routine/pre-session" element={<PreSessionJournal />} />
            <Route path="/daily-routine/pre-session/full" element={<PreSessionFull />} />
            <Route path="/daily-routine/pre-session/full/:id" element={<PreSessionFull />} />
            <Route path="/daily-routine/post-session" element={<PostSessionJournal />} />
            <Route path="/learning-section" element={<LearningSection />} />
            <Route path="/learning-section/strategy" element={<Strategy />} />
            <Route path="/learning-section/trading-psychology" element={<TradingPsychology />} />
            <Route path="/learning-section/notes" element={<Notes />} />
            <Route path="/performance-analysis" element={<PerformanceAnalysis />} />
            <Route path="/performance-analysis/wpa" element={<WPA />} />
            <Route path="/performance-analysis/wpa/create" element={<CreateWPA />} />
            <Route path="/performance-analysis/mpa" element={<MPA />} />
            <Route path="/performance-analysis/qpa" element={<QPA />} />
            <Route path="/performance-analysis/ypa" element={<YPA />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/statistics/execution" element={<Execution />} />
            <Route path="/statistics/analytics" element={<Analytics />} />
            <Route path="/risk-management" element={<RiskManagement />} />
            <Route path="/reporting-system" element={<ReportingSystem />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppContainer>
      )}
    </>
  );
}

export default App;