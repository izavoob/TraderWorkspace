import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow-x: hidden;
    overflow-y: auto;
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
`;

const BackButton = styled.button`
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

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.98);
  }

  &:before {
    content: 'Back';
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  background: #2e2e2e;
  border-radius: 10px;
  border: 2px solid #5e2ca5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const Select = styled.select`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  cursor: pointer;
  transition: border-color 0.2s ease;

  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
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

  &:checked {
    background: conic-gradient(from 45deg, #7425C9, #B886EE);
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
  grid-column: 1 / -1;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background: ${props => props.primary ? 'conic-gradient(from 45deg, #7425C9, #B886EE)' : '#5C9DF5'};
  transition: transform 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5em;
  z-index: 1000;
`;

function PreSessionFull() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        if (location.state?.sessionData) {
          console.log('Received session data:', location.state.sessionData);
          setSessionData(location.state.sessionData);
        } else {
          const currentDate = new Date().toISOString().split('T')[0];
          const routine = await window.electronAPI.getDailyRoutine(currentDate);
          
          if (routine && routine.preSession) {
            const entry = routine.preSession.find(e => String(e.id) === String(id));
            if (entry) {
              setSessionData(entry);
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
    setSessionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const routine = await window.electronAPI.getDailyRoutine(currentDate);
      
      let updatedPreSession = [];
      if (routine && routine.preSession) {
        updatedPreSession = routine.preSession.map(entry =>
          String(entry.id) === String(id) ? sessionData : entry
        );
        
        if (!updatedPreSession.some(entry => String(entry.id) === String(id))) {
          updatedPreSession.push(sessionData);
        }
      } else {
        updatedPreSession = [sessionData];
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
    return <LoadingOverlay>Loading...</LoadingOverlay>;
  }

  if (!sessionData) {
    return <LoadingOverlay>No data found</LoadingOverlay>;
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Pre-Session Details</Title>
        </Header>
        <Content>
          <Form onSubmit={handleSubmit}>
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
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="planOutcome"
                  checked={sessionData.planOutcome}
                  onChange={handleInputChange}
                />
                <Label>Plan & Outcome Match</Label>
              </CheckboxGroup>

              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="addPair"
                  checked={sessionData.addPair}
                  onChange={handleInputChange}
                />
                <Label>Additional Pair</Label>
              </CheckboxGroup>
            </FormGroup>

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