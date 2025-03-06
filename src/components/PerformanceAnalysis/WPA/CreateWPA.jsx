import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DatePickerStyles = createGlobalStyle`
  .react-datepicker {
    background-color: #2e2e2e;
    border: 1px solid #5e2ca5;
    font-family: inherit;
  }

  .react-datepicker__header {
    background: #1a1a1a;
    border-bottom: 1px solid #5e2ca5;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #fff;
  }

  .react-datepicker__day:hover {
    background: linear-gradient(45deg, #7425C9, #B886EE);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background: linear-gradient(45deg, #7425C9, #B886EE);
    color: #fff;
  }

  .react-datepicker__day--keyboard-selected {
    background: linear-gradient(45deg, #7425C9, #B886EE);
    color: #fff;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #B886EE;
  }

  .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
    background-color: rgba(116, 37, 201, 0.5);
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  max-width: 1820px;
  margin: 20px auto;
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
  border-radius: 10px 10px 0 0;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 128px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const Content = styled.div`
  margin-top: 148px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1820px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  color: rgb(92, 157, 245);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const DateSelectionContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const DateRangeButton = styled.button`
  background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 250px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const DateRangePopup = styled.div`
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 20px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  min-width: 600px;
`;

const DatePickerContainer = styled.div`
  margin-bottom: 20px;
  
  .react-datepicker {
    width: 100%;
    border: none;
    background: transparent;
    font-family: inherit;
  }

  .react-datepicker__month-container {
    float: none;
    display: inline-block;
    margin: 0 10px;
    background: #1a1a1a;
    border-radius: 8px;
    border: 1px solid #5e2ca5;
  }

  .react-datepicker__header {
    padding-top: 15px;
    background: #2e2e2e;
  }

  .react-datepicker__day {
    width: 2rem;
    line-height: 2rem;
    margin: 0.2rem;
    border-radius: 4px;
    
    &:hover {
      background: linear-gradient(45deg, #7425C9, #B886EE);
    }
  }

  .react-datepicker__current-month {
    font-size: 1em;
    color: #b886ee;
  }

  .react-datepicker__navigation {
    top: 15px;
  }
`;

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DatePickerLabel = styled.label`
  color: #b886ee;
  font-size: 0.9em;
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 10px;
  border: 2px solid #5e2ca5;
  border-radius: 8px;
  background-color: #2e2e2e;
  color: white;
  font-size: 1em;
  width: 300px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #b886ee;
  }
`;

const WeekInfo = styled.div`
  background-color: #2e2e2e;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #5e2ca5;
  margin-left: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const MetricCard = styled.div`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const MetricTitle = styled.h3`
  margin: 0;
  color: #b886ee;
  font-size: 1.1em;
`;

const MetricValue = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  color: ${props => props.color || '#fff'};
`;

const AnalysisHistoryContainer = styled.div`
  margin-top: 40px;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const HistoryCard = styled(Link)`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const HistoryDate = styled.div`
  font-size: 1.2em;
  color: #b886ee;
  margin-bottom: 15px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const StatLabel = styled.span`
  color: #888;
`;

const StatValue = styled.span`
  color: ${props => props.color || '#fff'};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
  padding-bottom: 40px;
`;

const Button = styled.button`
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &.cancel {
    background-color: #4a4a4a;
    color: white;
    &:hover {
      background-color: #5a5a5a;
    }
  }

  &.save {
    background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
    }
  }
`;

const TradesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const TradeCard = styled(Link)`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const TradeNumber = styled.div`
  font-size: 1.2em;
  color: #b886ee;
  margin-bottom: 15px;
`;

const TradeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const TradeLabel = styled.span`
  color: #888;
`;

const TradeValue = styled.span`
  color: ${props => {
    if (props.result === 'Win') return '#4caf50';
    if (props.result === 'Loss') return '#ff4444';
    if (props.result === 'Breakeven') return '#ffd700';
    if (props.result === 'Missed') return '#9c27b0';
    return '#fff';
  }};
`;

function CreateWPA() {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [weekNumber, setWeekNumber] = useState(null);
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    missedTrades: 0,
    executionCoefficient: 0,
    winrate: 0,
    followingPlan: 0,
    narrativeAccuracy: 0,
    gainedRR: 0,
    potentialRR: 0,
    averageRR: 0,
    profit: 0,
    realisedPL: 0,
    averagePL: 0,
    averageLoss: 0
  });
  const [preSessions, setPreSessions] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Завантажуємо збережені дати при монтуванні
    const savedStartDate = localStorage.getItem('wpaStartDate');
    const savedEndDate = localStorage.getItem('wpaEndDate');
    
    if (savedStartDate && savedEndDate) {
      setDateRange([new Date(savedStartDate), new Date(savedEndDate)]);
      loadData(new Date(savedStartDate), new Date(savedEndDate));
    }
  }, []);

  const loadData = async (start, end) => {
    try {
      const weekNum = getWeekNumber(start);
      setWeekNumber(weekNum);
      await loadMetrics(start, end);
      await loadPreSessions(start, end);
      await loadTrades(start, end);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      // Зберігаємо дати в localStorage
      localStorage.setItem('wpaStartDate', startDate.toISOString());
      localStorage.setItem('wpaEndDate', endDate.toISOString());
      
      loadData(startDate, endDate);
      setIsDatePickerOpen(false);
    }
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const loadTrades = async (start, end) => {
    try {
      const allTrades = await window.electronAPI.getTrades();
      const periodTrades = allTrades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate >= start && tradeDate <= end;
      });
      setTrades(periodTrades);
    } catch (error) {
      console.error('Error loading trades:', error);
    }
  };

  const loadPreSessions = async (start, end) => {
    try {
      const sessions = [];
      let currentDate = new Date(start);
      
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const routine = await window.electronAPI.getDailyRoutine(dateStr);
        
        if (routine && routine.preSession) {
          // Парсимо JSON дані з preSession
          const preSessionData = JSON.parse(routine.preSession);
          if (Array.isArray(preSessionData) && preSessionData.length > 0) {
            sessions.push({
              date: dateStr,
              preSession: preSessionData[0] // Беремо перший елемент масиву
            });
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setPreSessions(sessions);
    } catch (error) {
      console.error('Error loading pre-sessions:', error);
    }
  };

  const loadMetrics = async (start, end) => {
    try {
      const trades = await window.electronAPI.getTrades();
      const periodTrades = trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate >= start && tradeDate <= end;
      });

      // Розрахунок метрик
      const totalTrades = periodTrades.length;
      const missedTrades = periodTrades.filter(t => t.result === 'Missed').length;
      const winTrades = periodTrades.filter(t => t.result === 'Win').length;
      const followingPlanTrades = periodTrades.filter(t => t.followingPlan).length;
      
      const winrate = totalTrades ? (winTrades / totalTrades) * 100 : 0;
      const followingPlanRate = totalTrades ? (followingPlanTrades / totalTrades) * 100 : 0;
      
      const gainedRR = periodTrades.reduce((sum, t) => sum + (parseFloat(t.rr) || 0), 0);
      const averageRR = totalTrades ? gainedRR / totalTrades : 0;
      
      const pl = periodTrades.reduce((sum, t) => sum + (parseFloat(t.profitLoss) || 0), 0);
      const averagePL = totalTrades ? pl / totalTrades : 0;
      
      const losses = periodTrades.filter(t => parseFloat(t.profitLoss) < 0);
      const averageLoss = losses.length ? 
        losses.reduce((sum, t) => sum + parseFloat(t.profitLoss), 0) / losses.length : 0;

      setMetrics({
        totalTrades,
        missedTrades,
        executionCoefficient: 85, // Приклад
        winrate,
        followingPlan: followingPlanRate,
        narrativeAccuracy: 75, // Приклад
        gainedRR,
        potentialRR: gainedRR * 1.2, // Приклад
        averageRR,
        profit: pl > 0 ? pl : 0,
        realisedPL: pl,
        averagePL,
        averageLoss
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!startDate || !endDate) return;

      const analysisData = {
        id: uuidv4(),
        type: 'weekly',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        weekNumber,
        ...metrics
      };

      await window.electronAPI.savePerformanceAnalysis(analysisData);
      navigate('/performance-analysis/wpa');
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  // Оновлюємо рендер компонента DateSelection
  const renderDateSelection = () => (
    <DateSelectionContainer>
      <DateRangeButton onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
        {startDate && endDate
          ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
          : 'Select Date Range'}
      </DateRangeButton>

      <DateRangePopup isOpen={isDatePickerOpen}>
        <DatePickerContainer>
          <StyledDatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            dateFormat="dd/MM/yyyy"
            monthsShown={2}
            inline
            calendarStartDay={1}
          />
        </DatePickerContainer>
        <ApplyButton onClick={handleApplyDateRange}>Apply</ApplyButton>
      </DateRangePopup>
    </DateSelectionContainer>
  );

  return (
    <>
      <DatePickerStyles />
      <Container>
        <Header>
          <BackButton to="/performance-analysis/wpa" />
          <Title>Create Weekly Performance Analysis</Title>
        </Header>

        <Content>
          <SectionContainer>
            {renderDateSelection()}
            {weekNumber && (
              <WeekInfo>Week {weekNumber}</WeekInfo>
            )}
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Performance Metrics</SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricTitle>Total Trades</MetricTitle>
                <MetricValue>{metrics.totalTrades}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Missed Trades</MetricTitle>
                <MetricValue type="missed">{metrics.missedTrades}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Execution Coefficient</MetricTitle>
                <MetricValue color="#4caf50">{metrics.executionCoefficient}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Winrate</MetricTitle>
                <MetricValue color="#4caf50">{metrics.winrate.toFixed(2)}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Following the Plan</MetricTitle>
                <MetricValue color="#4caf50">{metrics.followingPlan.toFixed(2)}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Narrative Accuracy</MetricTitle>
                <MetricValue color="#4caf50">{metrics.narrativeAccuracy}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Gained RR</MetricTitle>
                <MetricValue>{metrics.gainedRR.toFixed(2)}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Potential RR</MetricTitle>
                <MetricValue>{metrics.potentialRR.toFixed(2)}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Average RR</MetricTitle>
                <MetricValue>{metrics.averageRR.toFixed(2)}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Profit</MetricTitle>
                <MetricValue color="#4caf50">${metrics.profit.toFixed(2)}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Realised P&L</MetricTitle>
                <MetricValue color={metrics.realisedPL >= 0 ? "#4caf50" : "#ff4444"}>
                  ${metrics.realisedPL.toFixed(2)}
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Average P&L</MetricTitle>
                <MetricValue color={metrics.averagePL >= 0 ? "#4caf50" : "#ff4444"}>
                  ${metrics.averagePL.toFixed(2)}
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Average Loss</MetricTitle>
                <MetricValue color="#ff4444">${Math.abs(metrics.averageLoss).toFixed(2)}</MetricValue>
              </MetricCard>
            </MetricsGrid>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Analysis History</SectionTitle>
            <HistoryGrid>
              {preSessions.map((session, index) => (
                <HistoryCard key={index} to={`/daily-routine/pre-session/${session.date}`}>
                  <HistoryDate>{new Date(session.date).toLocaleDateString()}</HistoryDate>
                  <StatRow>
                    <StatLabel>Narrative</StatLabel>
                    <StatValue>{session.preSession.narrative || 'N/A'}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Execution</StatLabel>
                    <StatValue>{session.preSession.execution || 'N/A'}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Outcome</StatLabel>
                    <StatValue color="#4caf50">{session.preSession.outcome || 'N/A'}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Plan & Outcome</StatLabel>
                    <StatValue>{session.preSession.planOutcome ? '✓' : '✗'}</StatValue>
                  </StatRow>
                </HistoryCard>
              ))}
            </HistoryGrid>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Trades History</SectionTitle>
            <TradesGrid>
              {trades.map(trade => (
                <TradeCard key={trade.id} to={`/trade/${trade.id}`}>
                  <TradeNumber>#{trade.no}</TradeNumber>
                  <TradeInfo>
                    <TradeLabel>Date</TradeLabel>
                    <TradeValue>{new Date(trade.date).toLocaleDateString()}</TradeValue>
                  </TradeInfo>
                  <TradeInfo>
                    <TradeLabel>Pair</TradeLabel>
                    <TradeValue>{trade.pair}</TradeValue>
                  </TradeInfo>
                  <TradeInfo>
                    <TradeLabel>Session</TradeLabel>
                    <TradeValue>{trade.session}</TradeValue>
                  </TradeInfo>
                  <TradeInfo>
                    <TradeLabel>Direction</TradeLabel>
                    <TradeValue>{trade.direction}</TradeValue>
                  </TradeInfo>
                  <TradeInfo>
                    <TradeLabel>Result</TradeLabel>
                    <TradeValue result={trade.result}>{trade.result}</TradeValue>
                  </TradeInfo>
                </TradeCard>
              ))}
            </TradesGrid>
          </SectionContainer>

          <ButtonContainer>
            <Button className="cancel" onClick={() => navigate('/performance-analysis/wpa')}>
              Cancel
            </Button>
            <Button className="save" onClick={handleSave}>
              Save Analysis
            </Button>
          </ButtonContainer>
        </Content>
      </Container>
    </>
  );
}

export default CreateWPA; 