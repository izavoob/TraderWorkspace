import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import deleteIcon from '../../../assets/icons/delete-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Container = styled.div`
  max-width: 1820px;
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
`;

const BackButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 8px;
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
const Subtitle = styled.h2`
  margin: 5px auto 0;
  font-size: 1.2em;
  color: #ff8c00;
  text-align: center;
  z-index: 1;
  font-weight: normal;
`;
const Content = styled.div`
  margin-top: 38px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1820px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;

  border-radius: 8px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  color: rgb(230, 243, 255);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const AnalysisCard = styled.div`
  background-color: #2e2e2e;
  padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;

  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(116, 37, 201, 0.1), rgba(184, 134, 238, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
`;

const AddAnalysisCard = styled(Link)`
  background-color: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;

  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  min-height: 200px;

  &:hover {
    background-color: rgba(94, 44, 165, 0.2);
    transform: translateY(-5px);
  }
`;

const AddIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 10px;
`;

const AddText = styled.span`
  font-size: 1.2em;
  color: #b886ee;
`;

const WeekInfo = styled.div`
  font-size: 1.5em;
  color: rgb(230, 243, 255);
  margin-bottom: 8px;
  font-weight: bold;
`;

const DateRange = styled.div`
  color: #b886ee;
  margin-bottom: 20px;
  font-size: 1.2em;
  padding: 8px;
  background: rgba(94, 44, 165, 0.2);
  border-radius: 8px;
  text-align: center;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 5px 0;
`;

const MetricLabel = styled.span`
  color: #888;
`;

const MetricValue = styled.span`
  color: ${props => {
    if (props.type === 'missed') return '#9c27b0';
    if (props.color) return props.color;
    return '#fff';
  }};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
`;

const VideoButton = styled.button`
  padding: 8px 15px;
  background: linear-gradient(45deg, #7425C9, #B886EE);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(116, 37, 201, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.5);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;

  ${AnalysisCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(244, 67, 54, 0.75);
    transform: scale(1.1);
  }

  &::before {
    content: '';
    width: 15px;
    height: 15px;
    background: url(${deleteIcon}) no-repeat center;
    background-size: contain;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 400px;
  max-width: 90%;
`;

const ModalTitle = styled.h2`
  color: rgb(230, 243, 255);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 20px;
`;

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

const StyledDatePicker = styled(DatePicker)`
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  color: #fff;
  padding: 11px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-size: 11px;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const DatePickerContainer = styled.div`
  margin: 20px 0;
  background-color: #1a1a1a;
  border: 2px solid #5e2ca5;
  border-radius: 8px;
  padding: 15px;
`;

const WeekNumberDisplay = styled.div`
  color: #b886ee;
  margin: 10px 0;
  font-size: 1.2em;
  text-align: center;
  padding: 10px;
  background: rgba(94, 44, 165, 0.2);
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: #5e2ca5;
  transition: all 0.3s ease;
  position: relative;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200% 100%;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
      animation: ${shineEffect} 1.5s linear infinite;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &.cancel {
    background-color: #4a4a4a;
    &:hover {
      background-color: #5a5a5a;
    }
  }

  &.create {
    background-color: #5e2ca5;
    &:hover {
      background-color: #4a1a8d;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

function WPA() {
  const [analyses, setAnalyses] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await window.electronAPI.getPerformanceAnalyses('weekly');
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const handleViewVideo = (url, e) => {
    e.stopPropagation(); // Зупиняємо поширення події, щоб не спрацював клік по картці
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCardClick = (analysisId) => {
    navigate(`/performance-analysis/wpa/create/${analysisId}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Щоб не спрацював клік по картці
    setSelectedAnalysis(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.deletePerformanceAnalysis(selectedAnalysis);
      setAnalyses(analyses.filter(analysis => analysis.id !== selectedAnalysis));
      setShowDeleteConfirmation(false);
      setSelectedAnalysis(null);
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const getWeekNumber = (date) => {
    if (!date) return null;
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const handleCreateAnalysis = async () => {
    if (!startDate || !endDate) return;

    try {
      // Встановлюємо кінець дня для кінцевої дати
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);

      // Замість збереження в БД, зберігаємо дати в localStorage
      localStorage.setItem('wpaStartDate', startDate.toISOString());
      localStorage.setItem('wpaEndDate', endDateTime.toISOString());
      
      // Переходимо на сторінку створення без збереження в БД
      setShowCreateModal(false);
      navigate('/performance-analysis/wpa/create');
    } catch (error) {
      console.error('Error creating analysis:', error);
    }
  };

  const getSourceText = (note) => {
    console.log('Getting source text for note:', note);
    
    const sourceType = note.source_type || note.sourceType;
    const tradeNo = note.trade_no;
    const tradeDate = note.trade_date;
    
    if (!sourceType) {
      return 'Unknown Source';
    }
    
    switch (sourceType) {
      case 'presession':
        return `Pre-Session Analysis (${tradeDate ? new Date(tradeDate).toLocaleDateString() : 'N/A'})`;
      case 'trade':
        if (!tradeNo && !tradeDate) {
          return 'Trade not saved yet';
        }
        if (tradeNo && tradeDate) {
          return `Trade #${tradeNo} (${new Date(tradeDate).toLocaleDateString()})`;
        }
        return 'Trade was deleted';
      default:
        return `Source: ${sourceType}`;
    }
  };

  return (
    <>
      <DatePickerStyles />
      <Container>
        <Header>
          <BackButton to="/performance-analysis" />
          <Title>Weekly Performance Analysis</Title>
          <Subtitle>Let's analyze your weekly performance!</Subtitle>
        </Header>

        <Content>
          <SectionContainer>
            <SectionTitle>Weekly Analysis</SectionTitle>
            <AnalysisGrid>
              <AddAnalysisCard onClick={() => setShowCreateModal(true)}>
                <AddIcon>+</AddIcon>
                <AddText>Add Analysis</AddText>
              </AddAnalysisCard>

              {analyses.map(analysis => (
                <AnalysisCard 
                  key={analysis.id} 
                  onClick={() => handleCardClick(analysis.id)}
                >
                  <DeleteButton onClick={(e) => handleDelete(analysis.id, e)} />
                  <WeekInfo>Week {analysis.weekNumber}</WeekInfo>
                  <DateRange>
                    {new Date(analysis.startDate).toLocaleDateString()} - {new Date(analysis.endDate).toLocaleDateString()}
                  </DateRange>
                  <MetricsContainer>
                    <MetricRow>
                      <MetricLabel>Total Trades</MetricLabel>
                      <MetricValue>{analysis.totalTrades || 0}</MetricValue>
                    </MetricRow>
                    <MetricRow>
                      <MetricLabel>Winrate</MetricLabel>
                      <MetricValue color="#4caf50">
                        {(analysis.winRate !== null && analysis.winRate !== undefined) ? analysis.winRate.toFixed(2) : '0.00'}%
                      </MetricValue>
                    </MetricRow>
                    <MetricRow>
                      <MetricLabel>Gained RR</MetricLabel>
                      <MetricValue bold>
                        {(analysis.gainedRR !== null && analysis.gainedRR !== undefined) ? analysis.gainedRR.toFixed(2) : '0.00'}
                      </MetricValue>
                    </MetricRow>
                    <MetricRow>
                      <MetricLabel>Profit</MetricLabel>
                      <MetricValue 
                        color={(analysis.profit || 0) >= 0 ? "#4caf50" : "#ff4444"}
                        bold
                      >
                        {(analysis.profit !== null && analysis.profit !== undefined) ? `${analysis.profit.toFixed(2)}%` : '0.00%'}
                      </MetricValue>
                    </MetricRow>
                  </MetricsContainer>
                  {analysis.videoUrl && (
                    <VideoButton onClick={(e) => handleViewVideo(analysis.videoUrl, e)}>
                      View Video Analysis
                    </VideoButton>
                  )}
                </AnalysisCard>
              ))}
            </AnalysisGrid>
          </SectionContainer>
        </Content>

        {showDeleteConfirmation && (
          <Modal onClick={() => setShowDeleteConfirmation(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalTitle>Delete Analysis</ModalTitle>
              <p style={{ color: '#fff', marginBottom: '20px' }}>Are you sure you want to delete this analysis?</p>
              <ButtonGroup>
                <Button className="cancel" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                <Button onClick={confirmDelete}>Delete</Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}

        {showCreateModal && (
          <Modal onClick={() => setShowCreateModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalTitle>Create Weekly Analysis</ModalTitle>
              <WeekNumberDisplay>
                Week {getWeekNumber(startDate) || '...'}
              </WeekNumberDisplay>
              <DatePickerContainer>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    const [start, end] = update;
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  dateFormat="dd/MM/yyyy"
                  monthsShown={1}
                  inline
                  calendarStartDay={1}
                />
              </DatePickerContainer>
              <ButtonGroup>
                <Button className="cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  className="create"
                  onClick={handleCreateAnalysis}
                  disabled={!startDate || !endDate}
                >
                  Create Analysis
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </>
  );
}

export default WPA;