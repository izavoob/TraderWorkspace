import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import AccountModal from './CapitalAndRM/AccountModal.jsx';
import AccountService from './CapitalAndRM/AccountService';
import deleteIcon from '../assets/icons/delete-icon.svg';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const RiskManagementContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: hidden;
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
  height: auto;
  min-height: 6.67vh;
  max-height: 100px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  color: rgb(92, 157, 245);
  margin: 0 0 30px;
  font-size: 2em;
  text-align: center;
`;

const AccountsContainer = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const AccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  margin-top: 30px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(244, 67, 54, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: url(${deleteIcon}) no-repeat center;
    background-size: contain;
    opacity: 0.7;
  }

  &:hover {
    background: rgba(244, 67, 54, 0.75);
    transform: translate(-50%, -50%) scale(1.1);
    
    &::before {
      opacity: 1;
    }
  }
`;

const AccountCard = styled.div`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(94, 44, 165, 0.4);
    
    ${DeleteButton} {
      opacity: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 13px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::after {
      opacity: 1;
    }
  }
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountName = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 1.3em;
`;

const AccountBalance = styled.div`
  color: ${props => props.value >= 0 ? '#4caf50' : '#f44336'};
  font-weight: bold;
  font-size: 1.2em;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BalanceLabel = styled.span`
  color: #ccc;
  font-size: 0.8em;
  font-weight: normal;
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ccc;
  font-size: 0.9em;
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch (props.status) {
      case 'Demo': return '#607d8b';
      case 'First Phase': return '#2196f3';
      case 'Second Phase': return '#9c27b0';
      case 'Funded': return '#4caf50';
      case 'Archived': return '#9e9e9e';
      default: return '#607d8b';
    }
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
`;

const AddAccountCard = styled.div`
  background-color: rgba(94, 44, 165, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px dashed #5e2ca5;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  min-height: 200px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(94, 44, 165, 0.4);
    background-color: rgba(94, 44, 165, 0.2);
  }
`;

const AddIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

const AddText = styled.span`
  color: #fff;
  font-size: 1.2em;
  text-align: center;
`;

function RiskManagement() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const accountsData = await AccountService.getAllAccounts();
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleSaveAccount = async (accountData) => {
    try {
      if (accountData.id) {
        await AccountService.updateAccount(accountData);
      } else {
        await AccountService.addAccount(accountData);
      }
      await loadAccounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDeleteAccount = async (event, accountId) => {
    event.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цей акаунт?')) {
      try {
        await AccountService.deleteAccount(accountId);
        await loadAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <RiskManagementContainer>
      <Header>
        <BackButton onClick={handleBack} />
        <Title>Capital and RM</Title>
        <Subtitle>Save your capital!</Subtitle>
      </Header>
      <Content>
        <AccountsContainer>
          <SectionTitle>Trading Accounts</SectionTitle>
          <AccountsGrid>
            {accounts.map(account => (
              <AccountCard key={account.id} onClick={() => handleEditAccount(account)}>
                <DeleteButton onClick={(e) => handleDeleteAccount(e, account.id)} />
                <AccountHeader>
                  <AccountName>{account.name}</AccountName>
                  <StatusBadge status={account.status}>{account.status}</StatusBadge>
                </AccountHeader>
                <AccountBalance value={parseFloat(account.balance)}>
                  <BalanceLabel>Balance:</BalanceLabel>
                  {formatCurrency(account.balance)}
                </AccountBalance>
                <AccountInfo>
                  <InfoRow>
                    <span>Starting Equity:</span>
                    <span>{formatCurrency(account.startingEquity)}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>Current Equity:</span>
                    <span>{formatCurrency(account.currentEquity)}</span>
                  </InfoRow>
                </AccountInfo>
              </AccountCard>
            ))}
            <AddAccountCard onClick={handleAddAccount}>
              <AddIcon>+</AddIcon>
              <AddText>Add Account</AddText>
            </AddAccountCard>
          </AccountsGrid>
        </AccountsContainer>
      </Content>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        account={selectedAccount}
      />
    </RiskManagementContainer>
  );
}

export default RiskManagement;