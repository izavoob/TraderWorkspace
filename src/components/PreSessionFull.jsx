import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Inter', sans-serif;
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

const Container = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  background-color: #1a1a1a;
  padding: 20px;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
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
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #7425C9, #B886EE);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h1`
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const Content = styled.div`
  margin-top: 148px;
  padding-top: 20px;
  position: relative;
  min-height: calc(100vh - 168px);
  width: 100%;
  overflow-y: visible;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease;
`;

const ThreeColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Section = styled.section`
  background: #2e2e2e;
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #5e2ca5;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.2);
    transform: translateY(-2px);
  }
`;

const BasicInfoSection = styled(Section)`
  height: fit-content;
`;

const MindsetSection = styled(Section)`
  height: fit-content;
`;

const ZoneSection = styled(Section)`
  grid-column: 1 / -1;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
`;

const QuotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Quote = styled.div`
  background: #3e3e3e;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #5e2ca5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  font-family: 'Georgia', serif;
  font-style: italic;
  letter-spacing: 0.3px;
  line-height: 1.5;
  
  &:hover {
    border-color: #B886EE;
    transform: translateX(5px);
    background: #444444;
  }
`;
const AcceptButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${props => props.accepted ? '#2ecc71' : '#3e3e3e'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.accepted ? '#27ae60' : '#5e2ca5'};
  
  &:hover {
    background: ${props => props.accepted ? '#27ae60' : '#4e4e4e'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Label = styled.label`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px;
  background: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#1a472a';
      case 'Bearish':
        return '#5c1919';
      case 'Win':
        return '#1a472a';
      case 'Loss':
        return '#5c1919';
      case 'BE':
        return '#714a14';
      default:
        return '#3e3e3e';
    }
  }};
  color: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#4ade80';
      case 'Bearish':
        return '#f87171';
      case 'Win':
        return '#4ade80';
      case 'Loss':
        return '#f87171';
      case 'BE':
        return '#fbbf24';
      default:
        return '#fff';
    }
  }};
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const MindsetCheckbox = styled.div`
  background: #3e3e3e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #5e2ca5;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:hover {
    border-color: #B886EE;
    transform: translateX(5px);
    background: #444444;
  }

  label {
    flex: 1;
    line-height: 1.4;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #5e2ca5;
  border-radius: 4px;
  background-color: #3e3e3e;
  transition: all 0.2s ease;
  position: relative;
  margin-top: 2px;

  &:checked {
    background: linear-gradient(135deg, #7425C9, #B886EE);
    border-color: transparent;

    &:after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &:hover {
    border-color: #B886EE;
  }
`;

const SectionTitle = styled.h3`
  color: #fff;
  margin: 0 0 20px 0;
  font-size: 1.5em;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 10px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #B886EE, #7425C9);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #7425C9, #B886EE)' 
    : 'linear-gradient(135deg, #5C9DF5, #7425C9)'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5em;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const LoadingSpinner = styled.div`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  width: 50px;
  height: 50px;
  border: 5px solid #5e2ca5;
  border-top: 5px solid #B886EE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 15px;
`;
function PreSessionFull() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mindsetChecks, setMindsetChecks] = useState({
    anythingCanHappen: false,
    futureKnowledge: false,
    randomDistribution: false,
    edgeDefinition: false,
    uniqueMoments: false
  });

  const [planOutcomeMatch, setPlanOutcomeMatch] = useState({
    checked: false,
    timestamp: null
  });

  const [zoneQuotes, setZoneQuotes] = useState([
    { id: 1, text: "I objectively identify my edges", accepted: false },
    { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
    { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
    { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
    { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
    { id: 6, text: "I predefine the risk of every trade", accepted: false },
    { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
  ]);

  useEffect(() => {
    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        if (location.state?.sessionData) {
          console.log('Received session data:', location.state.sessionData);
          setSessionData(location.state.sessionData);
          if (location.state.sessionData.mindsetChecks) {
            setMindsetChecks(location.state.sessionData.mindsetChecks);
          }
          if (location.state.sessionData.zoneQuotes) {
            setZoneQuotes(location.state.sessionData.zoneQuotes);
          }
          if (location.state.sessionData.planOutcomeMatch) {
            setPlanOutcomeMatch(location.state.sessionData.planOutcomeMatch);
          }
        } else {
          const currentDate = new Date().toISOString().split('T')[0];
          const routine = await window.electronAPI.getDailyRoutine(currentDate);
          
          if (routine && routine.preSession) {
            const entry = routine.preSession.find(e => String(e.id) === String(id));
            if (entry) {
              setSessionData(entry);
              if (entry.mindsetChecks) {
                setMindsetChecks(entry.mindsetChecks);
              }
              if (entry.zoneQuotes) {
                setZoneQuotes(entry.zoneQuotes);
              }
              if (entry.planOutcomeMatch) {
                setPlanOutcomeMatch(entry.planOutcomeMatch);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [location.state, id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSessionData = {
      ...sessionData,
      [name]: type === 'checkbox' ? checked : value
    };
    
    // Если изменились narrative или outcome, проверяем соответствие
    if (name === 'narrative' || name === 'outcome') {
      const shouldCheck = 
        newSessionData.narrative && 
        newSessionData.outcome && 
        newSessionData.narrative !== 'Neutral' && 
        newSessionData.narrative !== 'Day off' && 
        newSessionData.narrative === newSessionData.outcome;

      // Синхронизируем оба состояния
      newSessionData.planOutcome = shouldCheck;
      setPlanOutcomeMatch({
        checked: shouldCheck,
        timestamp: shouldCheck ? new Date().toISOString() : null
      });
    }

    setSessionData(newSessionData);
  };

  const handleAcceptQuote = (id) => {
    setZoneQuotes(prev => prev.map(quote => 
      quote.id === id ? { ...quote, accepted: !quote.accepted } : quote
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const routine = await window.electronAPI.getDailyRoutine(currentDate);
      
      const updatedSessionData = {
        ...sessionData,
        mindsetChecks,
        zoneQuotes,
        planOutcome: planOutcomeMatch.checked, // Добавляем planOutcome в сохраняемые данные
        planOutcomeMatch
      };

      let updatedPreSession = [];
      if (routine && routine.preSession) {
        updatedPreSession = routine.preSession.map(entry =>
          String(entry.id) === String(id) ? updatedSessionData : entry
        );
        
        if (!updatedPreSession.some(entry => String(entry.id) === String(id))) {
          updatedPreSession.push(updatedSessionData);
        }
      } else {
        updatedPreSession = [updatedSessionData];
      }

      await window.electronAPI.saveDailyRoutine({
        date: currentDate,
        preSession: updatedPreSession,
        postSession: routine?.postSession || [],
        emotions: routine?.emotions || [],
        notes: routine?.notes || []
      });

      navigate('/daily-routine/pre-session');
    } catch (error) {
      console.error('Error saving session data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/daily-routine/pre-session');
  };

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
        <span>Loading...</span>
      </LoadingOverlay>
    );
  }

  if (!sessionData) {
    return (
      <LoadingOverlay>
        <span>No data found</span>
      </LoadingOverlay>
    );
  }
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>← Back</BackButton>
          <Title>Pre-Session Details</Title>
        </Header>
        <Content>
          <Form onSubmit={handleSubmit}>
            <ThreeColumnLayout>
              {/* Левая колонка - Basic Information */}
              <BasicInfoSection>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={sessionData.date}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Currency Pair</Label>
                  <Select
                    name="pair"
                    value={sessionData.pair}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Pair</option>
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="GBP/USD">GBP/USD</option>
                    <option value="USD/JPY">USD/JPY</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Narrative</Label>
                  <Select
                    name="narrative"
                    value={sessionData.narrative}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Day off">Day off</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Execution</Label>
                  <Select
                    name="execution"
                    value={sessionData.execution}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Day off">Day off</option>
                    <option value="No Trades">No Trades</option>
                    <option value="Skipped">Skipped</option>
                    <option value="Missed">Missed</option>
                    <option value="BE">BE</option>
                    <option value="Loss">Loss</option>
                    <option value="Win">Win</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Outcome</Label>
                  <Select
                    name="outcome"
                    value={sessionData.outcome}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Day off">Day off</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={sessionData.planOutcome} // Используем planOutcome из sessionData
                      disabled={true} // Всегда disabled
                      onChange={() => {}} // Пустой обработчик, так как disabled
                    />
                    <label>
                      Plan&Outcome {/* Изменено название */}
                      {planOutcomeMatch.timestamp && (
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '12px', 
                          color: '#2ecc71' 
                        }}>
                          ✓ {new Date(planOutcomeMatch.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </label>
                  </MindsetCheckbox>

                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      name="addPair"
                      checked={sessionData.addPair}
                      onChange={handleInputChange}
                    />
                    <label>Additional Pair</label>
                  </MindsetCheckbox>
                </FormGroup>
              </BasicInfoSection>

              {/* Правая колонка - Mindset Preparation */}
              <MindsetSection>
                <SectionTitle>PRE-SESSION Mindset Preparation</SectionTitle>
                
                <MindsetCheckbox>
                  <Checkbox
                    type="checkbox"
                    checked={mindsetChecks.anythingCanHappen}
                    onChange={(e) => setMindsetChecks(prev => ({
                      ...prev,
                      anythingCanHappen: e.target.checked
                    }))}
                  />
                  <label>Все может случиться</label>
                </MindsetCheckbox>

                <MindsetCheckbox>
                  <Checkbox
                    type="checkbox"
                    checked={mindsetChecks.futureKnowledge}
                    onChange={(e) => setMindsetChecks(prev => ({
                      ...prev,
                      futureKnowledge: e.target.checked
                    }))}
                  />
                  <label>Вам не нужно знать, что будет дальше, чтобы заработать деньги</label>
                </MindsetCheckbox>

                <MindsetCheckbox>
                  <Checkbox
                    type="checkbox"
                    checked={mindsetChecks.randomDistribution}
                    onChange={(e) => setMindsetChecks(prev => ({
                      ...prev,
                      randomDistribution: e.target.checked
                    }))}
                  />
                  <label>Существует случайное распределение между выигрышами и проигрышами для любого заданного набора переменных, определяющих преимущество</label>
                </MindsetCheckbox>

                <MindsetCheckbox>
                  <Checkbox
                    type="checkbox"
                    checked={mindsetChecks.edgeDefinition}
                    onChange={(e) => setMindsetChecks(prev => ({
                      ...prev,
                      edgeDefinition: e.target.checked
                    }))}
                  />
                  <label>Преимущество — это не что иное, как указание на более высокую вероятность того, что одно событие произойдет по сравнению с другим</label>
                </MindsetCheckbox>

                <MindsetCheckbox>
                  <Checkbox
                    type="checkbox"
                    checked={mindsetChecks.uniqueMoments}
                    onChange={(e) => setMindsetChecks(prev => ({
                      ...prev,
                      uniqueMoments: e.target.checked
                    }))}
                  />
                  <label>Каждый момент на рынке уникален</label>
                </MindsetCheckbox>
              </MindsetSection>

              {/* Нижняя секция - The Zone */}
              <ZoneSection>
                <SectionTitle>The Zone</SectionTitle>
                <QuotesList>
                  {zoneQuotes.map(quote => (
                    <Quote key={quote.id}>
                      <span>{quote.text}</span>
                      <AcceptButton
                        accepted={quote.accepted}
                        onClick={() => handleAcceptQuote(quote.id)}
                        type="button"
                      >
                        {quote.accepted ? 'Accepted ✓' : 'Accept'}
                      </AcceptButton>
                    </Quote>
                  ))}
                </QuotesList>
              </ZoneSection>
            </ThreeColumnLayout>

            <ButtonGroup>
              <Button type="button" onClick={handleBack}>
                Cancel
              </Button>
              <Button type="submit" primary>
                Save
              </Button>
            </ButtonGroup>
          </Form>
        </Content>
      </Container>
    </>
  );
}

export default PreSessionFull;