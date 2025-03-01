import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
`;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: white;
  overflow-y: auto;
  padding-bottom: 40px;

  /* Стилизация скроллбара */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2e2e2e;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #5e2ca5;
    border-radius: 4px;
    
    &:hover {
      background: #7425C9;
    }
  }
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 128px;
  min-height: 6.67vh;
`;

const Title = styled.h1`
  margin: 0;
  color: #fff;
  text-align: center;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  background: #2e2e2e;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 10px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const Select = styled.select`
  padding: 10px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  cursor: pointer;

  option {
    background: #3e3e3e;
    color: #fff;
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
  position: relative;
  appearance: none;
  background: #3e3e3e;
  border: 2px solid #5e2ca5;
  border-radius: 4px;

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
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
  grid-column: 1 / -1;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background: ${props => props.primary ? 'conic-gradient(from 45deg, #7425C9, #B886EE)' : '#5C9DF5'};
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
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
          
          console.log('Loaded routine:', routine);
          
          if (routine && routine.preSession) {
            const entry = routine.preSession.find(e => String(e.id) === String(id));
            if (entry) {
              console.log('Loaded entry from storage:', entry);
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
    }
  };

  if (isLoading || !sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Pre-Session Analysis Entry</Title>
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
              <Button type="button" onClick={() => navigate('/daily-routine/pre-session')}>
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