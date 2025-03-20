import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const buttonHoverAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TradeLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  position: relative;
  padding-bottom: ${props => props.hasLinkedTrades ? '45px' : '0'};
  
  &:hover .hidden-add-button {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AddTradeButton = styled.button`
  background: rgba(255, 140, 0, 0.1);
  border: 2px dashed rgb(255, 140, 0);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  justify-content: center;
  transition: all 0.3s ease;
  animation: ${buttonHoverAnimation} 1s ease infinite;

  &.hidden-add-button {
    position: absolute;
    bottom: -15px;
    left: 0;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  &:hover {
    background: rgba(255, 140, 0, 0.2);
    transform: scale(1.05);
  }
`;

const AddIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: linear-gradient(135deg, #ff8c00, #ffa500);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background: #2e2e2e;
  border: 2px solid rgb(94, 44, 165);
  border-radius: 15px;
  padding: 20px;
  width: 500px;
  max-height: 70vh;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: #2e2e2e;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.5);
  margin-bottom: 15px;
  z-index: 2;
  border-radius: 13px 13px 0 0;
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.5em;
  margin: 0 0 15px 0;
  text-align: center;
`;

const SearchInput = styled.input`
  min-width: -webkit-fill-available;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid rgba(94, 44, 165, 0.5);
  background: rgba(94, 44, 165, 0.1);
  color: #fff;
  margin-bottom: 0;
  font-size: 1em;
  
  &:focus {
    outline: none;
    border-color: rgba(94, 44, 165, 0.8);
    box-shadow: 0 0 0 2px rgba(94, 44, 165, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TradeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(94, 44, 165, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(94, 44, 165, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(94, 44, 165, 0.7);
  }
`;

const TradeItem = styled.div`
  background: rgb(26, 26, 26);
  border: 1px solid rgba(94, 44, 165, 0.5);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;

  &:hover {
    background: rgba(94, 44, 165, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
  }
`;

const TradeDetails = styled.div`
  font-size: 1.1em;
  color: #fff;
  display: flex;
  justify-content: space-between;
  width: 100%;
  
  span {
    &.win { color: #4ade80; }
    &.loss { color: #f87171; }
    &.be { color: #fbbf24; }
    &.missed { color: #9c27b0; }
  }
`;

const LinkedTradeContainer = styled.div`
  background: rgba(255, 140, 0, 0.15);
  border: 2px solid rgba(255, 140, 0, 0.5);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 140, 0, 0.25);
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
`;

const ActionButton = styled.button`
  background: ${props => props.isRemove ? 'rgba(244, 67, 54, 0.5)' : 'rgba(94, 44, 165, 0.5)'};
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: ${props => props.isRemove ? 'rgba(244, 67, 54, 0.8)' : 'rgba(94, 44, 165, 0.8)'};
    transform: scale(1.1);
  }

  ${LinkedTradeContainer}:hover & {
    opacity: 1;
  }

  &::before {
    content: ${props => props.isRemove ? "'×'" : "'↺'"};
    color: white;
    font-size: 16px;
  }
`;

const AddNewTradeButton = styled(TradeItem)`
  background: rgba(94, 44, 165, 0.2);
  justify-content: center;
  font-weight: bold;
  color: #fff;
  margin-top: 5px;
  
  &:hover {
    background: rgba(94, 44, 165, 0.3);
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: none;
    border: 1px solid #ff4444;
    color: #ff4444;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: rgba(255, 0, 0, 0.1);
    }
  }
`;

const TradeLinkComponent = ({ presessionId, execution }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trades, setTrades] = useState([]);
  const [linkedTrades, setLinkedTrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedPresession, setSelectedPresession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrades();
    loadLinkedTrades();
  }, [presessionId]);

  useEffect(() => {
    if (['Win', 'Loss', 'BE', 'Missed'].includes(execution)) {
      loadLinkedTrades();
    }
  }, [execution]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const loadPresession = async () => {
      if (presessionId) {
        try {
          const presession = await window.electronAPI.getPresession(presessionId);
          if (presession) {
            setSelectedPresession(presession);
          }
        } catch (error) {
          console.error('Error loading presession:', error);
          setError('Failed to load presession');
        }
      }
    };
    loadPresession();
  }, [presessionId]);

  const loadTrades = async () => {
    try {
      const allTrades = await window.electronAPI.getTrades();
      setTrades(allTrades);
    } catch (error) {
      console.error('Error loading trades:', error);
    }
  };

  const loadLinkedTrades = async () => {
    try {
      const linkedTradesFromDb = await window.electronAPI.getLinkedTrades(presessionId);
      
      if (linkedTradesFromDb && linkedTradesFromDb.length > 0) {
        setLinkedTrades(linkedTradesFromDb);
        return;
      }
      
      const presession = await window.electronAPI.getPresession(presessionId);
      if (presession && presession.linked_trades) {
        try {
          const linkedTradesIds = JSON.parse(presession.linked_trades || '[]');
          
          if (linkedTradesIds.length > 0) {
            const linkedTradesData = await Promise.all(
              linkedTradesIds.map(id => window.electronAPI.getTrade(id))
            );
            
            const filteredTrades = linkedTradesData.filter(Boolean);
            console.log('Loaded linked trades from presession:', filteredTrades);
            
            for (const trade of filteredTrades) {
              await window.electronAPI.linkTradeToPresession(trade.id, presessionId);
            }
            
            setLinkedTrades(filteredTrades);
          } else {
            setLinkedTrades([]);
          }
        } catch (e) {
          console.error('Error parsing linked_trades:', e);
          setLinkedTrades([]);
        }
      } else {
        setLinkedTrades([]);
      }
    } catch (error) {
      console.error('Error loading linked trades:', error);
      setLinkedTrades([]);
    }
  };

  const handleLinkTrade = async (trade) => {
    try {
      console.log('Attempting to link trade', trade.id, 'to presession', presessionId);
      
      let presession = await window.electronAPI.getPresession(presessionId);
      
      if (!presession) {
        console.log('Presession not found, creating new one with ID:', presessionId);
        
        const newPresession = {
          id: presessionId,
          date: new Date().toISOString().split('T')[0],
          linked_trades: [],
          execution: execution,
          mindset_preparation: {
            anythingCanHappen: false,
            futureKnowledge: false,
            randomDistribution: false,
            edgeDefinition: false,
            uniqueMoments: false
          },
          the_zone: [
            { id: 1, text: "I objectively identify my edges", accepted: false },
            { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
            { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
            { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
            { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
            { id: 6, text: "I predefine the risk of every trade", accepted: false },
            { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
          ]
        };
        
        await window.electronAPI.savePresession(newPresession);
        
        presession = await window.electronAPI.getPresession(presessionId);
        console.log('Created new presession:', presession);
      }

      let currentLinkedTrades = [];
      try {
        currentLinkedTrades = Array.isArray(presession.linked_trades) 
          ? presession.linked_trades 
          : JSON.parse(presession.linked_trades || '[]');
        console.log('Current linked trades:', currentLinkedTrades);
      } catch (e) {
        console.error('Error parsing linked_trades:', e);
        currentLinkedTrades = [];
      }

      if (!currentLinkedTrades.includes(trade.id)) {
        currentLinkedTrades.push(trade.id);
        console.log('Added trade to linked_trades:', currentLinkedTrades);
      }

      const updatedPresession = {
        ...presession,
        linked_trades: currentLinkedTrades
      };

      console.log('Updating presession with trades:', updatedPresession);
      await window.electronAPI.updatePresession(updatedPresession);
      console.log('Presession updated successfully');
      
      console.log('Linking trade in trades table');
      await window.electronAPI.linkTradeToPresession(trade.id, presessionId);
      
      setIsModalOpen(false);
      console.log('Reloading linked trades');
      await loadLinkedTrades();
    } catch (error) {
      console.error('Error linking trade:', error);
    }
  };

  const handleUnlinkTrade = async (tradeId) => {
    try {
      const presession = await window.electronAPI.getPresession(presessionId);
      
      let currentLinkedTrades = Array.isArray(presession.linked_trades)
        ? presession.linked_trades
        : JSON.parse(presession.linked_trades || '[]');
      
      currentLinkedTrades = currentLinkedTrades.filter(id => id !== tradeId);
      
      const updatedPresession = {
        ...presession,
        linked_trades: currentLinkedTrades
      };
      
      await window.electronAPI.updatePresession(updatedPresession);
      await window.electronAPI.unlinkTradeFromPresession(tradeId);
      
      loadLinkedTrades();
    } catch (error) {
      console.error('Error unlinking trade:', error);
    }
  };

  const handleTradeClick = (tradeId) => {
    navigate(`/trade/${tradeId}`);
  };

  const getResultClass = (result) => {
    switch (result) {
      case 'Win': return 'win';
      case 'Loss': return 'loss';
      case 'BE': return 'be';
      case 'Missed': return 'missed';
      default: return '';
    }
  };

  const filteredTrades = trades.filter(trade => {
    const searchString = searchTerm.toLowerCase();
    return (
      trade.no?.toString().includes(searchString) ||
      trade.pair?.toLowerCase().includes(searchString) ||
      trade.result?.toLowerCase().includes(searchString)
    );
  });

  const handleAddTradeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleAddNewTrade = async () => {
    try {
      if (!presessionId) {
        throw new Error('No presession ID available');
      }

      let fullPresession = selectedPresession;
      if (!fullPresession) {
        fullPresession = await window.electronAPI.getPresession(presessionId);
        if (!fullPresession) {
          throw new Error('Failed to load presession data');
        }
        setSelectedPresession(fullPresession);
      }

      console.log('Starting handleAddNewTrade with presession:', fullPresession);

      const newTradeId = crypto.randomUUID();
      console.log('Generated new trade ID:', newTradeId);
      
      const tradeInfo = {
        tradeId: newTradeId,
        presession: fullPresession,
        presessionId: fullPresession.id,
        pair: fullPresession.pair
      };
      console.log('Preparing to save trade info:', tradeInfo);

      localStorage.setItem('newTradeInfo', JSON.stringify(tradeInfo));
      console.log('Trade info saved to localStorage');

      localStorage.setItem('currentPresessionId', fullPresession.id);
      console.log('Presession ID saved separately:', fullPresession.id);

      setIsModalOpen(false);
      
      console.log('Navigating to create-trade page with data:', tradeInfo);
      navigate('/create-trade', { 
        state: { 
          presessionData: tradeInfo,
          presessionId: fullPresession.id,
          pair: fullPresession.pair
        },
        replace: true
      });
    } catch (error) {
      console.error('Error in handleAddNewTrade:', error);
      setError(error.message || 'Failed to prepare trade creation');
    }
  };

  if (!['Win', 'Loss', 'BE', 'Missed'].includes(execution)) {
    return null;
  }

  if (error) {
    return (
      <ErrorMessage>
        {error}
        <button onClick={() => setError(null)}>Dismiss</button>
      </ErrorMessage>
    );
  }

  return (
    <TradeLinkContainer hasLinkedTrades={linkedTrades.length > 0}>
      {linkedTrades.map((trade) => (
        <LinkedTradeContainer 
          key={trade.id}
          onClick={() => handleTradeClick(trade.id)}
        >
          <ButtonsContainer>
            <ActionButton onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSelectedTrade(trade);
              setIsModalOpen(true);
            }} />
            <ActionButton 
              isRemove 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleUnlinkTrade(trade.id);
              }} 
            />
          </ButtonsContainer>
          <TradeDetails>
            <div>№{trade.no} {trade.date}</div>
            <div>{trade.pair} <span className={getResultClass(trade.result)}>{trade.result}</span></div>
          </TradeDetails>
        </LinkedTradeContainer>
      ))}
      
      {linkedTrades.length > 0 ? (
        <AddTradeButton 
          className="hidden-add-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <AddIcon>+</AddIcon>
          <span>Add Trade</span>
        </AddTradeButton>
      ) : (
        <AddTradeButton onClick={handleAddTradeClick}>
          <AddIcon>+</AddIcon>
          <span>Add Trade</span>
        </AddTradeButton>
      )}

      {isModalOpen && (
        <ModalOverlay show={true} onClick={() => setIsModalOpen(false)}>
          <ModalContainer ref={modalRef} onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {selectedTrade ? 'Replace Trade' : 'Select Trade'}
              </ModalTitle>
              <SearchInput
                type="text"
                placeholder="Search by number, pair or result..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </ModalHeader>
            
            <TradeList>
              <AddNewTradeButton onClick={handleAddNewTrade}>
                + Add New Trade
              </AddNewTradeButton>
              
              {filteredTrades.map(trade => (
                <TradeItem
                  key={trade.id}
                  onClick={() => handleLinkTrade(trade)}
                >
                  <TradeDetails>
                    <div>№{trade.no} {trade.date}</div>
                    <div>{trade.pair} <span className={getResultClass(trade.result)}>{trade.result}</span></div>
                  </TradeDetails>
                </TradeItem>
              ))}
            </TradeList>
          </ModalContainer>
        </ModalOverlay>
      )}
    </TradeLinkContainer>
  );
};

export default TradeLinkComponent; 