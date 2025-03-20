import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const PresessionLinkContainer = styled.div`
  display: flex;
  position: absolute;
  right: 40px;
  width: 450px;
  z-index: 10;
`;

const AddPresessionButton = styled.button`
  background: rgba(255, 140, 0, 0.1);
  border: 2px dashed rgb(255, 140, 0);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  justify-content: center;
  transition: all 0.3s ease;
  animation: ${buttonHoverAnimation} 1s ease infinite;

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

const DropdownOverlay = styled.div`
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

const DropdownContainer = styled.div`
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

const DropdownHeader = styled.div`
  position: sticky;
  top: 0;
  background: #2e2e2e;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.5);
  margin-bottom: 15px;
  z-index: 2;
  border-radius: 13px 13px 0 0;
`;

const DropdownTitle = styled.h2`
  color: #fff;
  font-size: 1.5em;
  margin: 0 0 15px 0;
  text-align: center;
`;

const DropdownContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
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

const PresessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PresessionItem = styled.div`
  background: rgb(26, 26, 26);
  border: 1px solid rgba(94, 44, 165, 0.5);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(94, 44, 165, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
  }
`;

const PresessionDate = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

const PresessionPair = styled.div`
  font-size: 1em;
  color: rgb(230, 243, 255);
`;

const NoPresessionsMessage = styled.div`
  color: #fff;
  text-align: center;
  padding: 20px;
  border: 1px dashed rgba(94, 44, 165, 0.5);
  border-radius: 8px;
  margin-top: 10px;
`;

const LinkedPresessionContainer = styled.div`
  background: rgba(255, 140, 0, 0.15);
  border: 2px solid rgba(255, 140, 0, 0.5);
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  cursor: default;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 140, 0, 0.25);
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
  }
`;

const LinkedDetails = styled.div`
  font-size: 1.1em;
  color: #ff8c00;
  font-weight: bold;
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
  z-index: 1;

  &:hover {
    background: ${props => props.isRemove ? 'rgba(244, 67, 54, 0.8)' : 'rgba(94, 44, 165, 0.8)'};
    transform: scale(1.1);
  }

  ${LinkedPresessionContainer}:hover & {
    opacity: 1;
  }

  &::before {
    content: ${props => props.isRemove ? "'×'" : "'↺'"};
    color: white;
    font-size: 16px;
  }
`;

const PresessionIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: linear-gradient(135deg, #ff8c00, #ffa500);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '📝';
    font-size: 16px;
  }
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

const NoResultsMessage = styled.div`
  color: #fff;
  text-align: center;
  padding: 15px;
  opacity: 0.7;
`;

const LoadingSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 10px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 10px;
  text-align: center;
  font-size: 14px;
`;

const PreSessionLinkComponent = ({ tradeId, presessionId, selectedPresession: initialSelectedPresession, onPresessionChange }) => {
  const [presessions, setPresessions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [linkedTrades, setLinkedTrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPresession, setSelectedPresession] = useState(initialSelectedPresession);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPresessions();
    checkLinkedPresession();
  }, []);

  // Toggle body scroll when modal is open
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

  // Додаємо ефект для оновлення selectedPresession при зміні пропса
  useEffect(() => {
    if (initialSelectedPresession) {
      setSelectedPresession(initialSelectedPresession);
    }
  }, [initialSelectedPresession]);

  // Додаємо ефект для завантаження пресесії, якщо є presessionId, але немає selectedPresession
  useEffect(() => {
    const loadPresession = async () => {
      if (presessionId && !selectedPresession) {
        try {
          const presession = await window.electronAPI.getPresession(presessionId);
          if (presession) {
            setSelectedPresession(presession);
            onPresessionChange && onPresessionChange(presession);
          }
        } catch (error) {
          console.error('Error loading presession:', error);
          setError('Failed to load presession');
        }
      }
    };
    loadPresession();
  }, [presessionId, selectedPresession, onPresessionChange]);

  const handleSelectPresession = async (presession) => {
    try {
      setLoading(true);
      await window.electronAPI.linkTradeToPresession(tradeId, presession.id);
      setSelectedPresession(presession);
      onPresessionChange && onPresessionChange(presession);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error linking presession:", error);
      setError("Failed to link presession");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLink = async () => {
    try {
      setLoading(true);
      await window.electronAPI.unlinkTradeFromPresession(tradeId);
      setSelectedPresession(null);
      onPresessionChange && onPresessionChange(null);
    } catch (error) {
      console.error("Error unlinking presession:", error);
      setError("Failed to unlink presession");
    } finally {
      setLoading(false);
    }
  };

  const checkLinkedPresession = async () => {
    try {
      const linkedPresession = await window.electronAPI.getLinkedPresession(tradeId);
      if (linkedPresession) {
        setSelectedPresession(linkedPresession);
        onPresessionChange && onPresessionChange(linkedPresession);
      }
    } catch (error) {
      console.error("Error checking linked presession:", error);
      setError("Failed to check linked presession");
    }
  };

  // Load all presessions when dropdown opens
  const loadPresessions = async () => {
    try {
      setLoading(true);
      const allPresessions = await window.electronAPI.getAllPresessions();
      // Sort by date (newest first)
      const sortedPresessions = allPresessions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setPresessions(sortedPresessions);
    } catch (error) {
      console.error('Error loading presessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Open dropdown and load presessions
  const handleOpenDropdown = () => {
    loadPresessions();
    setIsModalOpen(true);
  };

  // Navigate to presession page
  const handlePresessionClick = () => {
    if (selectedPresession && selectedPresession.id) {
      navigate(`/daily-routine/pre-session/full/${selectedPresession.id}`);
    }
  };

  // Filter presessions by search term
  const filteredPresessions = searchTerm 
    ? presessions.filter(p => 
        (p.date && p.date.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (p.pair && p.pair.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : presessions;

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  if (!tradeId) return null;

  return (
    <>
      <PresessionLinkContainer>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage>
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </ErrorMessage>
        ) : selectedPresession ? (
          <LinkedPresessionContainer>
            <ButtonsContainer>
              <ActionButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDropdown();
                }} 
              />
              <ActionButton 
                isRemove 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLink();
                }} 
              />
            </ButtonsContainer>
            <div 
              onClick={handlePresessionClick}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flex: 1
              }}
            >
              <PresessionIcon />
              <LinkedDetails>
                {formatDate(selectedPresession.date)}
                {selectedPresession.pair && ` - ${selectedPresession.pair}`}
              </LinkedDetails>
            </div>
          </LinkedPresessionContainer>
        ) : (
          <AddPresessionButton onClick={handleOpenDropdown}>
            <AddIcon>+</AddIcon>
            <span>Add Pre-Session</span>
          </AddPresessionButton>
        )}
      </PresessionLinkContainer>

      <DropdownOverlay show={isModalOpen}>
        <DropdownContainer ref={dropdownRef}>
          <DropdownHeader>
            <DropdownTitle>Select Pre-Session</DropdownTitle>
            <SearchInput 
              type="text" 
              placeholder="Search by date or pair..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </DropdownHeader>
          
          {loading ? (
            <DropdownContent>
              <NoPresessionsMessage>Loading...</NoPresessionsMessage>
            </DropdownContent>
          ) : (
            <DropdownContent>
              <PresessionList>
                {filteredPresessions.length > 0 ? (
                  filteredPresessions.map((presession) => (
                    <PresessionItem 
                      key={presession.id} 
                      onClick={() => handleSelectPresession(presession)}
                    >
                      <PresessionDate>{formatDate(presession.date)}</PresessionDate>
                      {presession.pair && <PresessionPair>{presession.pair}</PresessionPair>}
                    </PresessionItem>
                  ))
                ) : searchTerm ? (
                  <NoResultsMessage>No results found</NoResultsMessage>
                ) : (
                  <NoPresessionsMessage>
                    No pre-sessions available. Create a pre-session in the Daily Routine section first.
                  </NoPresessionsMessage>
                )}
              </PresessionList>
            </DropdownContent>
          )}
        </DropdownContainer>
      </DropdownOverlay>
    </>
  );
};

export default PreSessionLinkComponent; 