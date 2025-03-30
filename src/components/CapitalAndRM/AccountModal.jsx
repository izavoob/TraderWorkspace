import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 90%;
  max-width: 500px;
  color: white;
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 1em;
`;

const Input = styled.input`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  padding: 8px;
  color: #fff;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #7425c9;
  }
`;

const Select = styled.select`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  padding: 8px;
  color: #fff;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #7425c9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background: ${props => props.variant === 'cancel' ? '#3e3e3e' : 'conic-gradient(from 45deg, #7425c9, #b886ee)'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const BalanceInfo = styled.div`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BalanceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BalanceLabel = styled.span`
  color: #fff;
  font-size: 1em;
`;

const BalanceValue = styled.span`
  color: ${props => props.value >= 0 ? '#4caf50' : '#f44336'};
  font-weight: bold;
  font-size: 1.1em;
`;

const RelatedTradesSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid #5e2ca5;
  padding-top: 20px;
`;

const TradesListTitle = styled.h3`
  color: #fff;
  margin: 20px 0 10px;
  font-size: 1.2em;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
`;

const TradesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2e2e2e;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #5e2ca5;
    border-radius: 4px;
  }
`;

const TradeItem = styled.div`
  background-color: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #5e2ca5;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(5px);
    background-color: #2a2a2a;
    border-color: #7425c9;
  }
`;

const TradeInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const TradeNumber = styled.span`
  font-weight: bold;
  color: #b886ee;
`;

const TradeDate = styled.span`
  color: #888;
`;

const TradeResult = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${props => {
    switch(props.result) {
      case 'Win': return 'rgba(76, 175, 80, 0.2)';
      case 'Loss': return 'rgba(244, 67, 54, 0.2)';
      case 'Breakeven': return 'rgba(255, 215, 0, 0.2)';
      case 'Missed': return 'rgba(156, 39, 176, 0.2)';
      default: return 'rgba(128, 128, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.result) {
      case 'Win': return '#4caf50';
      case 'Loss': return '#f44336';
      case 'Breakeven': return '#ffd700';
      case 'Missed': return '#9c27b0';
      default: return '#808080';
    }
  }};
`;

const NoTradesMessage = styled.div`
  color: #888;
  text-align: center;
  margin: 20px 0;
`;

const AccountModal = ({ isOpen, onClose, onSave, account }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startingEquity: '',
    currentEquity: '',
    status: 'Demo'
  });
  const [balance, setBalance] = useState(0);
  const [profit, setProfit] = useState(0);
  const [relatedTrades, setRelatedTrades] = useState([]);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        startingEquity: account.startingEquity || '',
        currentEquity: account.currentEquity || '',
        status: account.status || 'Demo'
      });
      const calculatedBalance = parseFloat(account.currentEquity) - parseFloat(account.startingEquity);
      setBalance(calculatedBalance);
      const calculatedProfit = account.startingEquity ? ((account.currentEquity - account.startingEquity) / account.startingEquity) * 100 : 0;
      setProfit(calculatedProfit);
      loadRelatedTrades(account.id);
    } else {
      setFormData({
        name: '',
        startingEquity: '',
        currentEquity: '',
        status: 'Demo'
      });
      setBalance(0);
      setProfit(0);
      setRelatedTrades([]);
    }
  }, [account]);

  const loadRelatedTrades = async (accountId) => {
    try {
      const trades = await window.electronAPI.getTrades();
      const filteredTrades = trades.filter(trade => trade.account === accountId.toString());
      setRelatedTrades(filteredTrades);
    } catch (error) {
      console.error('Error loading related trades:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'startingEquity' || name === 'currentEquity') {
        const startingEquity = name === 'startingEquity' ? parseFloat(value) || 0 : parseFloat(prev.startingEquity) || 0;
        const currentEquity = name === 'currentEquity' ? parseFloat(value) || 0 : parseFloat(prev.currentEquity) || 0;
        
        const newBalance = currentEquity - startingEquity;
        setBalance(newBalance);
        
        const newProfit = startingEquity ? ((currentEquity - startingEquity) / startingEquity) * 100 : 0;
        setProfit(newProfit);
      }
      
      return newData;
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleTradeClick = (tradeId) => {
    navigate(`/trade/${tradeId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startingEquityValue = parseFloat(formData.startingEquity);
    const currentEquityValue = parseFloat(formData.currentEquity);
    
    const balanceValue = currentEquityValue - startingEquityValue;

    onSave({
      ...account,
      ...formData,
      startingEquity: startingEquityValue,
      currentEquity: currentEquityValue,
      balance: balanceValue
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>{account ? 'Edit Account' : 'Add New Account'}</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Account Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Starting Equity ($)</Label>
            <Input
              type="number"
              name="startingEquity"
              value={formData.startingEquity}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </FormGroup>
          <FormGroup>
            <Label>Current Equity ($)</Label>
            <Input
              type="number"
              name="currentEquity"
              value={formData.currentEquity}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Demo">Demo</option>
              <option value="First Phase">First Phase</option>
              <option value="Second Phase">Second Phase</option>
              <option value="Funded">Funded</option>
              <option value="Archived">Archived</option>
            </Select>
          </FormGroup>
          <BalanceInfo>
            <BalanceRow>
              <BalanceLabel>Balance:</BalanceLabel>
              <BalanceValue value={balance}>{formatCurrency(balance)}</BalanceValue>
            </BalanceRow>
            <BalanceRow>
              <BalanceLabel>Profit:</BalanceLabel>
              <BalanceValue value={profit}>{profit.toFixed(2)}%</BalanceValue>
            </BalanceRow>
          </BalanceInfo>

          {account && (
            <RelatedTradesSection>
              <TradesListTitle>Пов'язані трейди:</TradesListTitle>
              <TradesList>
                {relatedTrades.length > 0 ? (
                  relatedTrades.map(trade => (
                    <TradeItem key={trade.id} onClick={() => handleTradeClick(trade.id)}>
                      <TradeInfo>
                        <TradeNumber>#{trade.no || 'N/A'}</TradeNumber>
                        <TradeDate>{new Date(trade.date).toLocaleDateString()}</TradeDate>
                      </TradeInfo>
                      <TradeResult result={trade.result}>{trade.result}</TradeResult>
                    </TradeItem>
                  ))
                ) : (
                  <NoTradesMessage>Немає пов'язаних трейдів</NoTradesMessage>
                )}
              </TradesList>
            </RelatedTradesSection>
          )}

          <ButtonGroup>
            <Button type="button" variant="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {account ? 'Save Changes' : 'Add Account'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AccountModal; 