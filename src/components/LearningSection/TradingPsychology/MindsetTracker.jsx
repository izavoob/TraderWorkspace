import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import STERModal from './STER/STERModal.jsx';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  color: white;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  overflow-y: auto;
  height: calc(100vh - 148px);
`;

const Description = styled.p`
  color: #ccc;
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 30px;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const TrackerSection = styled.div`
  background: #2a2a2a;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid #5e2ca5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #5e2ca5;
  margin-bottom: 20px;
  font-size: 1.4em;
  text-align: center;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AddButton = styled.button`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 15px;
  padding: 27px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(94, 44, 165, 0.2);
    transform: translateY(-2px);
  }
`;

const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 10px;
`;

const AddText = styled.span`
  color: #fff;
  font-size: 1.2em;
`;

const AssessmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const AssessmentCard = styled.div`
  background: rgba(94, 44, 165, 0.1);
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.2);
  }
`;

const AssessmentDate = styled.div`
  color: #5e2ca5;
  font-size: 0.9em;
  margin-bottom: 10px;
`;

const AssessmentRatings = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  background: rgba(94, 44, 165, 0.05);
  border-radius: 5px;
`;

const RatingLabel = styled.span`
  color: #ccc;
  font-size: 0.9em;
`;

const RatingValue = styled.span`
  color: ${props => {
    const value = parseInt(props.value) || 0;
    if (value >= 4) return '#4caf50';
    if (value >= 3) return '#ff9800';
    return '#f44336';
  }};
  font-weight: bold;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.5);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 5;

  &:hover {
    background: rgba(244, 67, 54, 0.8);
    transform: scale(1.1);
  }

  ${AssessmentCard}:hover & {
    opacity: 1;
  }
`;

const MindsetTracker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const loadAssessments = async () => {
    try {
      console.log('Loading STER assessments...');
      const sterAssessments = await window.electronAPI.getSTERAssessments();
      console.log('Received assessments:', sterAssessments);
      setAssessments(sterAssessments || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading mindset tracker data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleAddAssessment = () => {
    setSelectedAssessment(null);
    setIsModalOpen(true);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleSaveAssessment = async (assessmentData) => {
    try {
      console.log('Saving assessment:', assessmentData);
      
      if (selectedAssessment) {
        await window.electronAPI.updateSTERAssessment(selectedAssessment.id, assessmentData);
      } else {
        await window.electronAPI.addSTERAssessment(assessmentData);
      }
      
      await loadAssessments();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving STER assessment:', error);
    }
  };

  const handleDeleteAssessment = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await window.electronAPI.deleteSTERAssessment(id);
        await loadAssessments();
      } catch (error) {
        console.error('Error deleting STER assessment:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <BackButton to="/learning-section/trading-psychology" title="Back" aria-label="Back" />
        <Title>Mindset Tracker</Title>
        <Subtitle>Track and improve your trading psychology</Subtitle>
      </Header>

      <Content>
        <Description>
          Track your psychological state, record insights and work on improving your trading mindset. 
          Use this tool to document your progress and identify areas for improvement.
        </Description>

        <TrackerSection>
          <SectionTitle>STER Assessment</SectionTitle>
          
          <AddButton onClick={handleAddAssessment}>
            <AddIcon>+</AddIcon>
            <AddText>Add STER Assessment</AddText>
          </AddButton>

          <AssessmentsGrid>
            {assessments.map((assessment) => (
              <AssessmentCard 
                key={assessment.id}
                onClick={() => handleEditAssessment(assessment)}
              >
                <DeleteButton
                  onClick={(e) => handleDeleteAssessment(assessment.id, e)}
                >
                  ×
                </DeleteButton>
                <AssessmentDate>{formatDate(assessment.date)}</AssessmentDate>
                <AssessmentRatings>
                  <RatingItem>
                    <RatingLabel>Situation</RatingLabel>
                    <RatingValue value={assessment.situationRating}>
                      {assessment.situationRating}/5
                    </RatingValue>
                  </RatingItem>
                  <RatingItem>
                    <RatingLabel>Thoughts</RatingLabel>
                    <RatingValue value={assessment.thoughtsRating}>
                      {assessment.thoughtsRating}/5
                    </RatingValue>
                  </RatingItem>
                  <RatingItem>
                    <RatingLabel>Emotions</RatingLabel>
                    <RatingValue value={assessment.emotionsRating}>
                      {assessment.emotionsRating}/5
                    </RatingValue>
                  </RatingItem>
                  <RatingItem>
                    <RatingLabel>Reaction</RatingLabel>
                    <RatingValue value={assessment.reactionRating}>
                      {assessment.reactionRating}/5
                    </RatingValue>
                  </RatingItem>
                </AssessmentRatings>
              </AssessmentCard>
            ))}
          </AssessmentsGrid>
        </TrackerSection>

        {isModalOpen && (
          <STERModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveAssessment}
            assessment={selectedAssessment}
          />
        )}
      </Content>
    </Container>
  );
};

export default MindsetTracker; 