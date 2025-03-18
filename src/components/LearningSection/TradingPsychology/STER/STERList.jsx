import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import STERModal from './STERModal.jsx';

const Container = styled.div`
  padding: 20px;
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

const AssessmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const AssessmentCard = styled.div`
  background: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #5e2ca5;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
  }
`;

const Date = styled.div`
  color: #5e2ca5;
  font-size: 0.9em;
  margin-bottom: 10px;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  color: #fff;
  margin: 0 0 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Rating = styled.span`
  background: ${props => {
    const value = props.value;
    if (value >= 4) return '#4caf50';
    if (value >= 3) return '#ff9800';
    return '#f44336';
  }};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
`;

const Text = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.4;
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

  &:hover {
    background: rgba(244, 67, 54, 0.8);
    transform: scale(1.1);
  }

  ${AssessmentCard}:hover & {
    opacity: 1;
  }
`;

const STERList = ({ onAssessmentChange }) => {
  const [assessments, setAssessments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      // Здесь будет загрузка оценок из базы данных
      const data = await window.electronAPI.getSTERAssessments();
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading STER assessments:', error);
    }
  };

  const handleAddAssessment = () => {
    setSelectedAssessment(null);
    setIsModalOpen(true);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleSave = async (assessmentData) => {
    try {
      console.log('Saving assessment:', assessmentData);
      
      if (selectedAssessment) {
        await window.electronAPI.updateSTERAssessment(selectedAssessment.id, assessmentData);
      } else {
        await window.electronAPI.addSTERAssessment(assessmentData);
      }
      
      if (onAssessmentChange) {
        await onAssessmentChange();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving STER assessment:', error);
    }
  };

  const handleDelete = async (id, e) => {
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

  return (
    <Container>
      <AddButton onClick={handleAddAssessment}>
        <AddIcon>+</AddIcon>
        <AddText>Добавить STER оценку</AddText>
      </AddButton>

      <AssessmentList>
        {assessments.map((assessment) => (
          <AssessmentCard 
            key={assessment.id}
            onClick={() => handleEditAssessment(assessment)}
          >
            <DeleteButton
              onClick={(e) => handleDelete(assessment.id, e)}
            >
              ×
            </DeleteButton>
            <Date>{new Date(assessment.date).toLocaleDateString()}</Date>
            
            <Section>
              <SectionTitle>
                Situation
                <Rating value={assessment.situationRating}>
                  {assessment.situationRating}/5
                </Rating>
              </SectionTitle>
              <Text>{assessment.situation}</Text>
            </Section>

            <Section>
              <SectionTitle>
                Thoughts
                <Rating value={assessment.thoughtsRating}>
                  {assessment.thoughtsRating}/5
                </Rating>
              </SectionTitle>
              <Text>{assessment.thoughts}</Text>
            </Section>

            <Section>
              <SectionTitle>
                Emotions
                <Rating value={assessment.emotionsRating}>
                  {assessment.emotionsRating}/5
                </Rating>
              </SectionTitle>
              <Text>{assessment.emotions}</Text>
            </Section>

            <Section>
              <SectionTitle>
                Reaction
                <Rating value={assessment.reactionRating}>
                  {assessment.reactionRating}/5
                </Rating>
              </SectionTitle>
              <Text>{assessment.reaction}</Text>
            </Section>
          </AssessmentCard>
        ))}
      </AssessmentList>

      <STERModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        assessment={selectedAssessment}
      />
    </Container>
  );
};

export default STERList; 