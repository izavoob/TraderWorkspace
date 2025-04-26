import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { format } from 'date-fns';
import { generateRecommendations } from '../../../utils/tradingAnalytics';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const CultivationContainer = styled.div`
 
  margin: 0 auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  padding: 20px 0;
  border-radius: 8px;
  color: #fff;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;
  text-decoration: none;
  color: transparent;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.98);
  }
  &:before {
    content: "Back";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0);
    transition: color 0.3s ease;
  }
  &:hover:before {
    color: #fff;
  }
  span {
    color: transparent;
  }
`;

const Title = styled.h1`
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const Subtitle = styled.h2`
  margin: 5px auto 0;
  font-size: 1.2em;
  color: #ff8c00;
  text-align: center;
  z-index: 1;
  font-weight: normal;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border-radius: 15px;
  padding: 20px;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  color: #fff;
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
`;

const SlidesWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${props => props.currentSlide * 100}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  box-sizing: border-box;
`;

const SlideNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
`;

const SlideIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#B886EE' : 'rgba(184, 134, 238, 0.3)')};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const SlideButton = styled.button`
  background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 20px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PatternCard = styled.div`
  background-color: #1a1a1a;
  padding: 25px;
  border-radius: 15px;
  transition: all 0.3s ease;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
`;

const PatternTitle = styled.h3`
  color: #4CAF50; /* Зелений колір для успішних патернів */
  margin: 0;
  font-size: 1.3em;
`;

const PatternDescription = styled.p`
  color: #fff;
  margin: 0;
  font-size: 1.1em;
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  background-color: #252525;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #ddd;
  font-size: 1em;
`;

const WinrateBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 15px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.winrate}%;
    background: linear-gradient(to right, ${props => props.winrate < 30 ? '#f44336' : props.winrate < 50 ? '#ff9800' : props.winrate < 75 ? '#4CAF50' : '#00C853'}, 
                                          ${props => props.winrate < 30 ? '#ff5722' : props.winrate < 50 ? '#ffc107' : props.winrate < 75 ? '#8BC34A' : '#00E676'});
    border-radius: 4px;
  }
`;

const EmptyMessage = styled.p`
  color: #aaa;
  text-align: center;
  font-size: 1.2em;
  margin: 50px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const TradesTableContainer = styled.div`
  margin-top: 15px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #252525;
`;

const TableTitle = styled.h4`
  color: #ddd;
  margin: 0 0 15px 0;
  padding: 10px 15px;
  background-color: #333;
  border-radius: 8px 8px 0 0;
  font-size: 1.1em;
`;

const RelatedTradesTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 0 15px 15px;
`;

const TableSection = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  border: 1px solid ${props => props.type === 'win' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
`;

const TableSectionTitle = styled.div`
  padding: 8px 12px;
  background: ${props => props.type === 'win' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'};
  color: ${props => props.type === 'win' ? '#4CAF50' : '#f44336'};
  font-weight: bold;
  text-align: center;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  background-color: #2d2d2d;
  padding: 8px 12px;
  border-bottom: 1px solid #444;
  font-weight: bold;
  color: #ddd;
`;

const TableBody = styled.div`
  max-height: 250px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 1px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #5e2ca5;
    border-radius: 3px;
  }
`;

const TableRow = styled(Link)`
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  color: #ddd;
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(94, 44, 165, 0.2);
  }
`;

const TableCell = styled.div`
  font-size: 0.9em;
  
  &.no {
    font-weight: bold;
    color: #B886EE;
  }
  
  &.date {
    color: #aaa;
  }
  
  &.win {
    color: #4CAF50;
    font-weight: bold;
  }
  
  &.loss {
    color: #f44336;
    font-weight: bold;
  }
`;

const EmptyTableMessage = styled.div`
  padding: 15px;
  text-align: center;
  color: #777;
  font-style: italic;
`;

const NewBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #4CAF50, #00C853);
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ArchivedBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #808080, #444);
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AcceptButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const RemoveButton = styled.button`
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AlertModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const AlertContent = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #f44336;
  border-radius: 15px;
  padding: 25px;
  max-width: 450px;
  width: 90%;
  text-align: center;
`;

const AlertTitle = styled.h3`
  color: #f44336;
  font-size: 1.5em;
  margin: 0 0 15px 0;
`;

const AlertMessage = styled.p`
  color: #fff;
  font-size: 1.1em;
  margin: 0 0 20px 0;
  line-height: 1.4;
`;

const AlertButton = styled.button`
  background: linear-gradient(135deg, #7425C9, #B886EE);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 25px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: ${props => props.centered ? 'center' : 'center'};
  gap: 15px;
`;

function Cultivation() {
  const [patterns, setPatterns] = useState([]);
  const [archivedPatterns, setArchivedPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archiveLoading, setArchiveLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentArchiveSlide, setCurrentArchiveSlide] = useState(0);
  const [relatedTrades, setRelatedTrades] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocation = useRef(null);

  // Збереження та відновлення стану слайдера
  useEffect(() => {
    const savedState = sessionStorage.getItem('cultivationState');
    if (savedState) {
      const { slide, archived } = JSON.parse(savedState);
      if (slide !== undefined) setCurrentSlide(slide);
      if (archived !== undefined) setCurrentArchiveSlide(archived);
    }
  }, []);

  // Збереження стану при переході на інші сторінки
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Зберігаємо стан слайдера при виході зі сторінки
      const state = {
        slide: currentSlide,
        archived: currentArchiveSlide
      };
      sessionStorage.setItem('cultivationState', JSON.stringify(state));
    };

    // Додаємо обробник для збереження стану
    window.addEventListener('beforeunload', handleBeforeUnload);

    // При переході на іншу сторінку
    prevLocation.current = location.pathname;
    
    return () => {
      // Зберігаємо стан при розмонтуванні компонента
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSlide, currentArchiveSlide, location]);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        setLoading(true);
        // Спочатку отримуємо архівовані патерни
        setArchiveLoading(true);
        const archivedData = await window.electronAPI.getArchivedRecommendations();
        
        // Фільтруємо тільки high-winrate рекомендації (з ключами, що починаються з "high_")
        const highWinrateArchived = archivedData.filter(item => 
          item.recommendationKey && item.recommendationKey.startsWith('high_')
        );
        
        // Збираємо ключі архівованих патернів
        const archivedKeys = highWinrateArchived.map(item => item.recommendationKey);
        console.log("Архівовані ключі високого вінрейту:", archivedKeys);
        
        // Тепер отримуємо активні трейди для аналізу
        const allTrades = await window.electronAPI.getTrades();
        
        // Генеруємо рекомендації з високим вінрейтом за допомогою утилітного методу
        let generatedPatterns = [];
        if (allTrades && allTrades.length > 0) {
          generatedPatterns = generateRecommendations(allTrades, true); // другий параметр true вказує на високий вінрейт
        }
        
        // Фільтруємо тільки нові рекомендації (не в архіві)
        const newPatterns = generatedPatterns.filter(pattern => 
          !archivedKeys.includes(pattern.recommendationKey)
        );
        
        console.log("Нові патерни високого вінрейту:", newPatterns.length);
        
        // Збираємо всі ідентифікатори трейдів з активних та архівованих патернів
        const allTradeIds = new Set();
        newPatterns.forEach(pattern => {
          if (pattern.relatedTrades && pattern.relatedTrades.length > 0) {
            pattern.relatedTrades.forEach(id => allTradeIds.add(id));
          }
        });
        
        highWinrateArchived.forEach(pattern => {
          if (pattern.relatedTrades && pattern.relatedTrades.length > 0) {
            pattern.relatedTrades.forEach(id => allTradeIds.add(id));
          }
        });
        
        // Об'єкт для відображення деталей трейдів
        const tradeDetailsMap = {};
        
        // Додаємо збережені деталі трейдів з архівованих патернів
        highWinrateArchived.forEach(pattern => {
          if (pattern.relatedTradesDetails) {
            Object.entries(pattern.relatedTradesDetails).forEach(([id, details]) => {
              tradeDetailsMap[id] = details;
            });
          }
        });
        
        // Завантажуємо дані для всіх трейдів, яких немає в архіві
        for (const tradeId of allTradeIds) {
          // Якщо ми вже маємо дані про цей трейд з архіву, пропускаємо
          if (tradeDetailsMap[tradeId]) continue;
          
          try {
            const tradeDetails = await window.electronAPI.getTrade(tradeId);
            if (tradeDetails) {
              tradeDetailsMap[tradeId] = tradeDetails;
            }
          } catch (error) {
            console.error(`Error fetching details for trade ${tradeId}:`, error);
          }
        }
        
        console.log(`Loaded details for ${Object.keys(tradeDetailsMap).length} trades`);
        setRelatedTrades(tradeDetailsMap);
        
        // Встановлюємо патерни та архів
        setPatterns(newPatterns);
        setArchivedPatterns(highWinrateArchived);
      } catch (error) {
        console.error('Error fetching patterns:', error);
      } finally {
        setLoading(false);
        setArchiveLoading(false);
      }
    };
    
    fetchPatterns();
  }, []);

  // Функція для переходу до наступного слайду
  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % patterns.length);
  };

  // Функція для переходу до попереднього слайду
  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + patterns.length) % patterns.length);
  };

  // Функції для роботи з архівом
  const handleNextArchiveSlide = () => {
    setCurrentArchiveSlide(prev => (prev + 1) % archivedPatterns.length);
  };

  const handlePrevArchiveSlide = () => {
    setCurrentArchiveSlide(prev => (prev - 1 + archivedPatterns.length) % archivedPatterns.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToArchiveSlide = (index) => {
    setCurrentArchiveSlide(index);
  };

  const handleAccept = async (pattern) => {
    try {
      // Додавання ключа патерну, якщо його немає
      const patternToArchive = {
        ...pattern,
        recommendationKey: pattern.recommendationKey || 
          `high_${pattern.parameters.map(p => `${p.name}_${p.value}`).join('_')}`
      };
      
      // Додаємо патерн до архіву
      await window.electronAPI.archiveRecommendation(patternToArchive);
      
      // Оновлюємо список патернів
      setPatterns(prev => prev.filter(pat => pat.recommendationKey !== patternToArchive.recommendationKey));
      
      // Додаємо патерн до архіву в UI
      setArchivedPatterns(prev => [
        ...prev, 
        {...patternToArchive, isArchived: true, isNew: false}
      ]);
      
      // Якщо це був останній патерн, переключаємося на попередній
      if (currentSlide >= patterns.length - 1) {
        setCurrentSlide(Math.max(0, patterns.length - 2));
      }
    } catch (error) {
      console.error('Error accepting pattern:', error);
    }
  };

  const handleRemoveFromArchive = async (pattern) => {
    try {
      // Видаляємо патерн з архіву
      await window.electronAPI.deleteArchivedRecommendation(pattern.recommendationKey);
      
      // Оновлюємо список архівованих патернів
      setArchivedPatterns(prev => 
        prev.filter(pat => pat.recommendationKey !== pattern.recommendationKey)
      );
      
      // Якщо це був останній патерн в архіві, переключаємося на попередній
      if (currentArchiveSlide >= archivedPatterns.length - 1) {
        setCurrentArchiveSlide(Math.max(0, archivedPatterns.length - 2));
      }
    } catch (error) {
      console.error('Error removing pattern from archive:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Function to check and open a trade
  const handleTradeClick = (event, tradeId) => {
    event.preventDefault();
    
    // Check if the trade exists
    if (!relatedTrades[tradeId]) {
      setAlertMessage(`Trade #${tradeId} not found in the database.`);
      setShowAlert(true);
      return;
    }
    
    // If the trade exists, navigate to its page
    navigate(`/trade/${tradeId}`);
  };

  const renderRelatedTradesTable = (relatedTradeIds) => {
    if (!relatedTradeIds || relatedTradeIds.length === 0) {
      return (
        <TradesTableContainer>
          <TableTitle>Related Trades</TableTitle>
          <EmptyMessage>No related trades found</EmptyMessage>
        </TradesTableContainer>
      );
    }
    
    // Filter trades by result
    const winTrades = relatedTradeIds
      .map(id => relatedTrades[id])
      .filter(trade => trade && trade.result === 'Win');
      
    const lossTrades = relatedTradeIds
      .map(id => relatedTrades[id])
      .filter(trade => trade && trade.result === 'Loss');
      
    // Add Breakeven trades
    const breakevenTrades = relatedTradeIds
      .map(id => relatedTrades[id])
      .filter(trade => trade && trade.result === 'Breakeven');
      
    // Add Missed trades
    const missedTrades = relatedTradeIds
      .map(id => relatedTrades[id])
      .filter(trade => trade && trade.result === 'Missed');

    if (winTrades.length === 0 && lossTrades.length === 0 && 
        breakevenTrades.length === 0 && missedTrades.length === 0) {
      return (
        <TradesTableContainer>
          <TableTitle>Related Trades</TableTitle>
          <EmptyMessage>No trades found among related trades</EmptyMessage>
        </TradesTableContainer>
      );
    }

    return (
      <TradesTableContainer>
        <TableTitle>Related Trades</TableTitle>
        <RelatedTradesTable>
          {/* Win Trades Section */}
          <TableSection type="win">
            <TableSectionTitle type="win">Win Trades ({winTrades.length})</TableSectionTitle>
            <TableHeader>
              <div>No</div>
              <div>Date</div>
              <div>Result</div>
            </TableHeader>
            <TableBody>
              {winTrades.length > 0 ? (
                winTrades.map(trade => (
                  <TableRow 
                    key={trade.id} 
                    to={`/trade/${trade.id}`}
                    onClick={(e) => handleTradeClick(e, trade.id)}
                  >
                    <TableCell className="no">#{trade.no}</TableCell>
                    <TableCell className="date">{formatDate(trade.date)}</TableCell>
                    <TableCell className="win">{trade.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableMessage>No win trades</EmptyTableMessage>
              )}
            </TableBody>
          </TableSection>

          {/* Loss Trades Section */}
          <TableSection type="loss">
            <TableSectionTitle type="loss">Loss Trades ({lossTrades.length})</TableSectionTitle>
            <TableHeader>
              <div>No</div>
              <div>Date</div>
              <div>Result</div>
            </TableHeader>
            <TableBody>
              {lossTrades.length > 0 ? (
                lossTrades.map(trade => (
                  <TableRow 
                    key={trade.id} 
                    to={`/trade/${trade.id}`}
                    onClick={(e) => handleTradeClick(e, trade.id)}
                  >
                    <TableCell className="no">#{trade.no}</TableCell>
                    <TableCell className="date">{formatDate(trade.date)}</TableCell>
                    <TableCell className="loss">{trade.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableMessage>No loss trades</EmptyTableMessage>
              )}
            </TableBody>
          </TableSection>
        </RelatedTradesTable>
        
        {/* Breakeven and Missed Trades sections */}
        <RelatedTradesTable style={{ marginTop: '15px' }}>
          {/* Breakeven Trades Section */}
          <TableSection type="breakeven">
            <TableSectionTitle type="breakeven" style={{ background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107' }}>
              Breakeven Trades ({breakevenTrades.length})
            </TableSectionTitle>
            <TableHeader>
              <div>No</div>
              <div>Date</div>
              <div>Result</div>
            </TableHeader>
            <TableBody>
              {breakevenTrades.length > 0 ? (
                breakevenTrades.map(trade => (
                  <TableRow 
                    key={trade.id} 
                    to={`/trade/${trade.id}`}
                    onClick={(e) => handleTradeClick(e, trade.id)}
                  >
                    <TableCell className="no">#{trade.no}</TableCell>
                    <TableCell className="date">{formatDate(trade.date)}</TableCell>
                    <TableCell style={{ color: '#ffc107', fontWeight: 'bold' }}>{trade.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableMessage>No breakeven trades</EmptyTableMessage>
              )}
            </TableBody>
          </TableSection>

          {/* Missed Trades Section */}
          <TableSection type="missed">
            <TableSectionTitle type="missed" style={{ background: 'rgba(158, 158, 158, 0.15)', color: '#9e9e9e' }}>
              Missed Trades ({missedTrades.length})
            </TableSectionTitle>
            <TableHeader>
              <div>No</div>
              <div>Date</div>
              <div>Result</div>
            </TableHeader>
            <TableBody>
              {missedTrades.length > 0 ? (
                missedTrades.map(trade => (
                  <TableRow 
                    key={trade.id} 
                    to={`/trade/${trade.id}`}
                    onClick={(e) => handleTradeClick(e, trade.id)}
                  >
                    <TableCell className="no">#{trade.no}</TableCell>
                    <TableCell className="date">{formatDate(trade.date)}</TableCell>
                    <TableCell style={{ color: '#9370db', fontWeight: 'bold' }}>{trade.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableMessage>No missed trades</EmptyTableMessage>
              )}
            </TableBody>
          </TableSection>
        </RelatedTradesTable>
      </TradesTableContainer>
    );
  };

  const renderPatternSlider = (sliderData, currentSliderIndex, handleNext, handlePrev, goToSlideFunc, isArchived = false) => {
    if (sliderData.length === 0) {
      return (
        <EmptyMessage>
          {isArchived
            ? "Your pattern archive is empty. Accept successful patterns to see them here."
            : "Not enough data to identify successful patterns. Add more trades to your journal for analysis."}
        </EmptyMessage>
      );
    }

    return (
      <>
        <SliderContainer>
          <SlidesWrapper currentSlide={currentSliderIndex}>
            {sliderData.map((pattern, index) => (
              <Slide key={index}>
                <PatternCard>
                  {pattern.isNew && !isArchived && <NewBadge>New</NewBadge>}
                  {isArchived && <ArchivedBadge>Archived</ArchivedBadge>}
                  <PatternTitle>{pattern.title}</PatternTitle>
                  <PatternDescription>{pattern.description}</PatternDescription>
                  
                  <StatsContainer>
                    <StatRow>
                      <span>Total Trades:</span>
                      <span>{pattern.totalTrades}</span>
                    </StatRow>
                    <StatRow>
                      <span>Win Trades:</span>
                      <span style={{ color: '#4CAF50' }}>{pattern.winTrades}</span>
                    </StatRow>
                    <StatRow>
                      <span>Loss Trades:</span>
                      <span style={{ color: '#f44336' }}>{pattern.lossTrades}</span>
                    </StatRow>
                    {pattern.breakevenTrades > 0 && (
                      <StatRow>
                        <span>Breakeven Trades:</span>
                        <span style={{ color: '#ffc107' }}>{pattern.breakevenTrades}</span>
                      </StatRow>
                    )}
                    {pattern.missedTrades > 0 && (
                      <StatRow>
                        <span>Missed Trades:</span>
                        <span style={{ color: '#9370db' }}>{pattern.missedTrades}</span>
                      </StatRow>
                    )}
                    <StatRow>
                      <span>Winrate:</span>
                      <span style={{ fontWeight: 'bold' }}>{pattern.winrate}%</span>
                    </StatRow>
                    
                    <WinrateBar winrate={pattern.winrate} />
                  </StatsContainer>

                  {pattern.relatedTrades && pattern.relatedTrades.length > 0 && 
                    renderRelatedTradesTable(pattern.relatedTrades)}
                    
                  <ButtonContainer centered={isArchived}>
                    {!isArchived ? (
                      <AcceptButton onClick={() => handleAccept(pattern)}>
                        Add to Pattern Archive
                      </AcceptButton>
                    ) : (
                      <RemoveButton onClick={() => handleRemoveFromArchive(pattern)}>
                        Remove from Archive
                      </RemoveButton>
                    )}
                  </ButtonContainer>
                </PatternCard>
              </Slide>
            ))}
          </SlidesWrapper>

          {sliderData.length > 1 && (
            <SlideNavigation>
              <SlideButton 
                className="prev" 
                onClick={handlePrev}
                disabled={sliderData.length <= 1}
              >
                &#10094;
              </SlideButton>
              
              {sliderData.map((_, index) => (
                <SlideIndicator
                  key={index}
                  active={currentSliderIndex === index}
                  onClick={() => goToSlideFunc(index)}
                />
              ))}
              
              <SlideButton 
                className="next" 
                onClick={handleNext}
                disabled={sliderData.length <= 1}
              >
                &#10095;
              </SlideButton>
            </SlideNavigation>
          )}
        </SliderContainer>
      </>
    );
  };

  return (
    <CultivationContainer>
      <Header>
        <BackButton to="/learning-section/strategy" />
        <Title>Trading Cultivation</Title>
        <Subtitle>Identify and utilize your most successful trading patterns</Subtitle>
      </Header>

      <Content>
        <SectionContainer>
          <SectionTitle>Successful Patterns</SectionTitle>
          
          {loading ? (
            <LoadingContainer>
              <p>Analyzing trading patterns...</p>
            </LoadingContainer>
          ) : (
            renderPatternSlider(
              patterns,
              currentSlide,
              handleNextSlide,
              handlePrevSlide,
              goToSlide
            )
          )}
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Pattern Archive</SectionTitle>
          
          {archiveLoading ? (
            <LoadingContainer>
              <p>Loading archived patterns...</p>
            </LoadingContainer>
          ) : (
            renderPatternSlider(
              archivedPatterns,
              currentArchiveSlide,
              handleNextArchiveSlide,
              handlePrevArchiveSlide,
              goToArchiveSlide,
              true
            )
          )}
        </SectionContainer>
      </Content>

      {showAlert && (
        <AlertModal>
          <AlertContent>
            <AlertTitle>Error</AlertTitle>
            <AlertMessage>{alertMessage}</AlertMessage>
            <AlertButton onClick={() => setShowAlert(false)}>OK</AlertButton>
          </AlertContent>
        </AlertModal>
      )}
    </CultivationContainer>
  );
}

export default Cultivation; 