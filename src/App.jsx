import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
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
import WPA from './components/PerformanceAnalysis/WPA.jsx';
import MPA from './components/PerformanceAnalysis/MPA.jsx';
import QPA from './components/PerformanceAnalysis/QPA.jsx';
import YPA from './components/PerformanceAnalysis/YPA.jsx';
import LearningSection from './components/LearningSection.jsx';
import Strategy from './components/LearningSection/Strategy.jsx';
import TradingPsychology from './components/LearningSection/TradingPsychology.jsx';
import Notes from './components/LearningSection/Notes.jsx';
import Statistics from './components/Statistics.jsx';
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
    color: white;
    font-family: 'Arial', sans-serif;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
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

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
    font-size: 16px;
    background-color: #2e2e2e;
    color: white;
    border: 1px solid #5e2ca5;
    border-radius: 4px;
    padding: 8px;

    &:focus {
      outline: none;
      border-color: #7425C9;
      box-shadow: 0 0 0 2px rgba(116, 37, 201, 0.2);
    }
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
  opacity: ${props => props.isLoading ? 0 : 1};
  transition: opacity 0.3s ease-in-out;
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 100;

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
  transition: all 0.2s ease;

  &:hover {
    background-color: #7425C9;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &.back::before {
    content: "\\2190";
    font-size: 20px;
  }

  &.forward::before {
    content: "\\2192";
    font-size: 20px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      background-color: #5e2ca5;
    }
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

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
      default:
        if (path.startsWith('/trade/')) {
          return 'TRADE DETAIL';
        }
        return '';
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
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
          <Route path="/daily-routine/pre-session/:id" element={<PreSessionFull />} />
          <Route path="/daily-routine/post-session" element={<PostSessionJournal />} />
          <Route path="/learning-section" element={<LearningSection />} />
          <Route path="/learning-section/strategy" element={<Strategy />} />
          <Route path="/learning-section/trading-psychology" element={<TradingPsychology />} />
          <Route path="/learning-section/notes" element={<Notes />} />
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
      return 'LEARNING SECTION';
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