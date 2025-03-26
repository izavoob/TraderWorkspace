import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RecommendationsContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
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
  color: transparent;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.98);
  }
  &:before {
    content: "Назад";
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
  span {
    color: transparent;
  }
`;

const Title = styled.h1`
  margin: 0 auto;
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
  margin-top: 128px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
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

const RecommendationCard = styled.div`
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(94, 44, 165, 0.4);
  }
`;

const RecommendationTitle = styled.h3`
  color: #ff8c00;
  margin: 0;
  font-size: 1.3em;
`;

const RecommendationDescription = styled.p`
  color: #fff;
  margin: 0;
  font-size: 1.1em;
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  background-color: #252525;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #ddd;
  font-size: 1em;
`;

const WinrateBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 15px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.winrate}%;
    background: linear-gradient(to right, ${props => props.winrate < 30 ? '#f44336' : props.winrate < 50 ? '#ff9800' : '#4CAF50'}, ${props => props.winrate < 30 ? '#ff5722' : props.winrate < 50 ? '#ffc107' : '#8BC34A'});
    border-radius: 4px;
  }
`;

const EmptyMessage = styled.p`
  color: #aaa;
  text-align: center;
  font-size: 1.2em;
  margin: 50px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const TradeLink = styled(Link)`
  color: #B886EE;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #7425C9;
    text-decoration: underline;
  }
`;

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await window.electronAPI.getTradeRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Помилка при отриманні рекомендацій:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <RecommendationsContainer>
      <Header>
        <BackButton to="/learning-section/strategy" />
        <Title>Рекомендації трейдингової системи</Title>
        <Subtitle>Аналіз та рекомендації на основі ваших трейдів</Subtitle>
      </Header>

      <Content>
        <SectionContainer>
          <SectionTitle>Аналіз ваших трейдів</SectionTitle>
          
          {loading ? (
            <LoadingContainer>
              <p>Завантаження рекомендацій...</p>
            </LoadingContainer>
          ) : recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <RecommendationCard key={index}>
                <RecommendationTitle>{rec.title}</RecommendationTitle>
                <RecommendationDescription>{rec.description}</RecommendationDescription>
                
                <StatsContainer>
                  <StatRow>
                    <span>Загальна кількість трейдів:</span>
                    <span>{rec.totalTrades}</span>
                  </StatRow>
                  <StatRow>
                    <span>Прибуткові трейди:</span>
                    <span style={{ color: '#4CAF50' }}>{rec.winTrades}</span>
                  </StatRow>
                  <StatRow>
                    <span>Збиткові трейди:</span>
                    <span style={{ color: '#f44336' }}>{rec.lossTrades}</span>
                  </StatRow>
                  <StatRow>
                    <span>Вінрейт:</span>
                    <span style={{ fontWeight: 'bold' }}>{rec.winrate}%</span>
                  </StatRow>
                  
                  <WinrateBar winrate={rec.winrate} />
                </StatsContainer>

                {rec.relatedTrades && rec.relatedTrades.length > 0 && (
                  <div>
                    <h4 style={{ color: '#ddd', marginBottom: '10px' }}>Пов'язані трейди:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {rec.relatedTrades.map(tradeId => (
                        <TradeLink key={tradeId} to={`/trade/${tradeId}`}>
                          #{tradeId}
                        </TradeLink>
                      ))}
                    </div>
                  </div>
                )}
              </RecommendationCard>
            ))
          ) : (
            <EmptyMessage>
              Наразі недостатньо даних для формування рекомендацій. Додайте більше трейдів у свій журнал для аналізу.
            </EmptyMessage>
          )}
        </SectionContainer>
      </Content>
    </RecommendationsContainer>
  );
}

export default Recommendations; 