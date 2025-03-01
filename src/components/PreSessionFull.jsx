import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
  background-color: #1a1a1a;
  min-height: 100vh;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  color: white;
  text-align: center;
  flex-grow: 1;
`;

const Form = styled.form`
  display: grid;
  gap: 20px;
  background: #2e2e2e;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #5e2ca5;
`;

const FormSection = styled.div`
  display: grid;
  gap: 15px;
`;

const SectionTitle = styled.h2`
  color: #B886EE;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 10px;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  padding: 10px;
  color: white;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const Select = styled.select`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  padding: 10px;
  color: white;
  width: 100%;
  box-sizing: border-box;

  option {
    background: #3e3e3e;
    color: white;
  }

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const TextArea = styled.textarea`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  padding: 10px;
  color: white;
  width: 100%;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? 'conic-gradient(from 45deg, #7425C9, #B886EE)' : '#5C9DF5'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  font-size: 16px;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Checkbox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    width: 20px;
    height: 20px;
    margin: 0;
  }

  label {
    margin: 0;
  }
`;

function PreSessionFull() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState(
    location.state?.sessionData || {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
      pair: '',
      narrative: '',
      execution: '',
      outcome: '',
      planOutcome: false,
      addPair: false,
      marketContext: '',
      keyLevels: '',
      tradingPlan: '',
      riskManagement: '',
      notes: '',
    }
  );

  const handleChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const routine = await window.electronAPI.getDailyRoutine(sessionData.date);
      let updatedPreSession;
      
      if (routine.preSession) {
        updatedPreSession = routine.preSession.map(entry =>
          entry.id === sessionData.id ? sessionData : entry
        );
      } else {
        updatedPreSession = [sessionData];
      }

      await window.electronAPI.saveDailyRoutine({
        ...routine,
        preSession: updatedPreSession,
      });

      navigate('/daily-routine/pre-session');
    } catch (error) {
      console.error('Error saving session data:', error);
      alert('Failed to save session data.');
    }
  };

  return (
    <Container>
      <Header>
        <Button onClick={() => navigate('/daily-routine/pre-session')}>Back</Button>
        <Title>Pre-Session Analysis Details</Title>
        <div style={{ width: '100px' }}></div>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>
          <Label>Trading Pair</Label>
          <Select
            value={sessionData.pair}
            onChange={(e) => handleChange('pair', e.target.value)}
          >
            <option value="">Select Pair</option>
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="USD/JPY">USD/JPY</option>
          </Select>

          <Label>Market Narrative</Label>
          <Select
            value={sessionData.narrative}
            onChange={(e) => handleChange('narrative', e.target.value)}
          >
            <option value="">Select Narrative</option>
            <option value="Bullish">Bullish</option>
            <option value="Bearish">Bearish</option>
            <option value="Neutral">Neutral</option>
            <option value="Day off">Day off</option>
          </Select>

          <Label>Execution</Label>
          <Select
            value={sessionData.execution}
            onChange={(e) => handleChange('execution', e.target.value)}
          >
            <option value="">Select Execution</option>
            <option value="Day off">Day off</option>
            <option value="No Trades">No Trades</option>
            <option value="Skipped">Skipped</option>
            <option value="Missed">Missed</option>
            <option value="BE">BE</option>
            <option value="Loss">Loss</option>
            <option value="Win">Win</option>
          </Select>

          <Checkbox>
            <input
              type="checkbox"
              checked={sessionData.planOutcome}
              onChange={(e) => handleChange('planOutcome', e.target.checked)}
            />
            <Label>Plan & Outcome Match</Label>
          </Checkbox>

          <Checkbox>
            <input
              type="checkbox"
              checked={sessionData.addPair}
              onChange={(e) => handleChange('addPair', e.target.checked)}
            />
            <Label>Additional Pair</Label>
          </Checkbox>
        </FormSection>

        <FormSection>
          <SectionTitle>Market Analysis</SectionTitle>
          <Label>Market Context</Label>
          <TextArea
            value={sessionData.marketContext || ''}
            onChange={(e) => handleChange('marketContext', e.target.value)}
            placeholder="Describe current market conditions..."
          />
          
          <Label>Key Levels</Label>
          <TextArea
            value={sessionData.keyLevels || ''}
            onChange={(e) => handleChange('keyLevels', e.target.value)}
            placeholder="Important price levels..."
          />
        </FormSection>

        <FormSection>
          <SectionTitle>Trading Strategy</SectionTitle>
          <Label>Trading Plan</Label>
          <TextArea
            value={sessionData.tradingPlan || ''}
            onChange={(e) => handleChange('tradingPlan', e.target.value)}
            placeholder="Your trading plan for the session..."
          />
          
          <Label>Risk Management</Label>
          <TextArea
            value={sessionData.riskManagement || ''}
            onChange={(e) => handleChange('riskManagement', e.target.value)}
            placeholder="Risk management rules..."
          />
        </FormSection>

        <FormSection>
          <SectionTitle>Additional Notes</SectionTitle>
          <TextArea
            value={sessionData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any additional notes or observations..."
          />
        </FormSection>

        <ButtonGroup>
          <Button type="button" onClick={() => navigate('/daily-routine/pre-session')}>
            Cancel
          </Button>
          <Button type="submit" primary>
            Save Changes
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default PreSessionFull;