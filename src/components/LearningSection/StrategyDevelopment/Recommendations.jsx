import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';

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
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border-radius: 15px;
  padding: 20px;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  color: #fff;
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
`;

const SlidesWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${props => props.currentSlide * 100}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  box-sizing: border-box;
`;

const SlideNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
`;

const SlideIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#B886EE' : 'rgba(184, 134, 238, 0.3)')};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const SlideButton = styled.button`
  background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 20px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const RecommendationCard = styled.div`
  background-color: #1a1a1a;
  padding: 25px;
  border-radius: 15px;
  transition: all 0.3s ease;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
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

const TradesTableContainer = styled.div`
  margin-top: 15px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #252525;
`;

const TableTitle = styled.h4`
  color: #ddd;
  margin: 0 0 15px 0;
  padding: 10px 15px;
  background-color: #333;
  border-radius: 8px 8px 0 0;
  font-size: 1.1em;
`;

const RelatedTradesTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 0 15px 15px;
`;

const TableSection = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  border: 1px solid ${props => props.type === 'win' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
`;

const TableSectionTitle = styled.div`
  padding: 8px 12px;
  background: ${props => props.type === 'win' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'};
  color: ${props => props.type === 'win' ? '#4CAF50' : '#f44336'};
  font-weight: bold;
  text-align: center;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  background-color: #2d2d2d;
  padding: 8px 12px;
  border-bottom: 1px solid #444;
  font-weight: bold;
  color: #ddd;
`;

const TableBody = styled.div`
  max-height: 250px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 1px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #5e2ca5;
    border-radius: 3px;
  }
`;

const TableRow = styled(Link)`
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  color: #ddd;
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(94, 44, 165, 0.2);
  }
`;

const TableCell = styled.div`
  font-size: 0.9em;
  
  &.no {
    font-weight: bold;
    color: #B886EE;
  }
  
  &.date {
    color: #aaa;
  }
  
  &.win {
    color: #4CAF50;
    font-weight: bold;
  }
  
  &.loss {
    color: #f44336;
    font-weight: bold;
  }
`;

const EmptyTableMessage = styled.div`
  padding: 15px;
  text-align: center;
  color: #777;
  font-style: italic;
`;

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [relatedTrades, setRelatedTrades] = useState({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await window.electronAPI.getTradeRecommendations();
        setRecommendations(data);
        
        // Fetch details for all related trades
        const tradeDetailsMap = {};
        
        // Collect all unique trade IDs
        const allTradeIds = new Set();
        data.forEach(rec => {
          if (rec.relatedTrades && rec.relatedTrades.length > 0) {
            rec.relatedTrades.forEach(id => allTradeIds.add(id));
          }
        });
        
        // Fetch details for each trade
        for (const tradeId of allTradeIds) {
          try {
            const tradeDetails = await window.electronAPI.getTrade(tradeId);
            if (tradeDetails) {
              tradeDetailsMap[tradeId] = tradeDetails;
            }
          } catch (error) {
            console.error(`Error fetching details for trade ${tradeId}:`, error);
          }
        }
        
        setRelatedTrades(tradeDetailsMap);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % recommendations.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const renderRelatedTradesTable = (relatedTradeIds) => {
    // Filter trades by result
    const winTrades = relatedTradeIds
      .map(id => relatedTrades[id])
      .filter(trade => trade && trade.result === 'Win');
      
    const lossTrades = relatedTradeIds
      .map(id => relatedTrades[id])
      .filter(trade => trade && trade.result === 'Loss');

    return (
      <TradesTableContainer>
        <TableTitle>Related Trades</TableTitle>
        <RelatedTradesTable>
          {/* Win Trades Section */}
          <TableSection type="win">
            <TableSectionTitle type="win">Win Trades ({winTrades.length})</TableSectionTitle>
            <TableHeader>
              <div>No</div>
              <div>Date</div>
              <div>Result</div>
            </TableHeader>
            <TableBody>
              {winTrades.length > 0 ? (
                winTrades.map(trade => (
                  <TableRow key={trade.id} to={`/trade/${trade.id}`}>
                    <TableCell className="no">#{trade.no}</TableCell>
                    <TableCell className="date">{formatDate(trade.date)}</TableCell>
                    <TableCell className="win">{trade.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableMessage>No win trades</EmptyTableMessage>
              )}
            </TableBody>
          </TableSection>

          {/* Loss Trades Section */}
          <TableSection type="loss">
            <TableSectionTitle type="loss">Loss Trades ({lossTrades.length})</TableSectionTitle>
            <TableHeader>
              <div>No</div>
              <div>Date</div>
              <div>Result</div>
            </TableHeader>
            <TableBody>
              {lossTrades.length > 0 ? (
                lossTrades.map(trade => (
                  <TableRow key={trade.id} to={`/trade/${trade.id}`}>
                    <TableCell className="no">#{trade.no}</TableCell>
                    <TableCell className="date">{formatDate(trade.date)}</TableCell>
                    <TableCell className="loss">{trade.result}</TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyTableMessage>No loss trades</EmptyTableMessage>
              )}
            </TableBody>
          </TableSection>
        </RelatedTradesTable>
      </TradesTableContainer>
    );
  };

  return (
    <RecommendationsContainer>
      <Header>
        <BackButton to="/learning-section/strategy" />
        <Title>Trading System Recommendations</Title>
        <Subtitle>Analysis and recommendations based on your trades</Subtitle>
      </Header>

      <Content>
        <SectionContainer>
          <SectionTitle>Trade Analysis</SectionTitle>
          
          {loading ? (
            <LoadingContainer>
              <p>Loading recommendations...</p>
            </LoadingContainer>
          ) : recommendations.length > 0 ? (
            <>
              <SliderContainer>
                <SlidesWrapper currentSlide={currentSlide}>
                  {recommendations.map((rec, index) => (
                    <Slide key={index}>
                      <RecommendationCard>
                        <RecommendationTitle>{rec.title}</RecommendationTitle>
                        <RecommendationDescription>{rec.description}</RecommendationDescription>
                        
                        <StatsContainer>
                          <StatRow>
                            <span>Total Trades:</span>
                            <span>{rec.totalTrades}</span>
                          </StatRow>
                          <StatRow>
                            <span>Win Trades:</span>
                            <span style={{ color: '#4CAF50' }}>{rec.winTrades}</span>
                          </StatRow>
                          <StatRow>
                            <span>Loss Trades:</span>
                            <span style={{ color: '#f44336' }}>{rec.lossTrades}</span>
                          </StatRow>
                          {rec.breakevenTrades > 0 && (
                            <StatRow>
                              <span>Breakeven Trades:</span>
                              <span style={{ color: '#ffc107' }}>{rec.breakevenTrades}</span>
                            </StatRow>
                          )}
                          {rec.missedTrades > 0 && (
                            <StatRow>
                              <span>Missed Trades:</span>
                              <span style={{ color: '#9c27b0' }}>{rec.missedTrades}</span>
                            </StatRow>
                          )}
                          <StatRow>
                            <span>Winrate:</span>
                            <span style={{ fontWeight: 'bold' }}>{rec.winrate}%</span>
                          </StatRow>
                          
                          <WinrateBar winrate={rec.winrate} />
                        </StatsContainer>

                        {rec.relatedTrades && rec.relatedTrades.length > 0 && 
                          renderRelatedTradesTable(rec.relatedTrades)}
                      </RecommendationCard>
                    </Slide>
                  ))}
                </SlidesWrapper>

                {recommendations.length > 1 && (
                  <SlideNavigation>
                    <SlideButton 
                      className="prev" 
                      onClick={handlePrevSlide}
                      disabled={recommendations.length <= 1}
                    >
                      &#10094;
                    </SlideButton>
                    
                    {recommendations.map((_, index) => (
                      <SlideIndicator
                        key={index}
                        active={currentSlide === index}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                    
                    <SlideButton 
                      className="next" 
                      onClick={handleNextSlide}
                      disabled={recommendations.length <= 1}
                    >
                      &#10095;
                    </SlideButton>
                  </SlideNavigation>
                )}
              </SliderContainer>
            </>
          ) : (
            <EmptyMessage>
              Not enough data to generate recommendations. Add more trades to your journal for analysis.
            </EmptyMessage>
          )}
        </SectionContainer>
      </Content>
    </RecommendationsContainer>
  );
}

export default Recommendations; 