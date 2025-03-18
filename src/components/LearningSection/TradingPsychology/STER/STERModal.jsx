import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
`;

const ModalContent = styled.div`
  background: #2a2a2a;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #5e2ca5;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #5e2ca5;
  }
`;

const Title = styled.h2`
  color: #5e2ca5;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 1.1em;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #5e2ca5;
  background: #1a1a1a;
  color: #fff;
  
  &:focus {
    outline: none;
    border-color: #7425c9;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #5e2ca5;
  background: #1a1a1a;
  color: #fff;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #7425c9;
  }
`;

const RatingGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RatingButton = styled.button`
  padding: 8px 16px;
  border-radius: 5px;
  border: 1px solid #5e2ca5;
  background: ${props => props.selected ? '#5e2ca5' : '#1a1a1a'};
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #7425c9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.save {
    background: #5e2ca5;
    color: #fff;
    
    &:hover {
      background: #7425c9;
    }
  }
  
  &.cancel {
    background: #444;
    color: #fff;
    
    &:hover {
      background: #666;
    }
  }
`;

const STERModal = ({ isOpen, onClose, onSave, assessment = null }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    situation: '',
    thoughts: '',
    emotions: '',
    reaction: '',
    situationRating: 0,
    thoughtsRating: 0,
    emotionsRating: 0,
    reactionRating: 0
  });

  useEffect(() => {
    if (assessment) {
      setFormData(assessment);
    }
  }, [assessment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRating = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData); // Добавим для отладки
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Добавьте здесь обработку ошибок для пользователя
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{assessment ? 'Edit STER Assessment' : 'New STER Assessment'}</Title>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Situation (What happened?)</Label>
            <TextArea
              name="situation"
              value={formData.situation}
              onChange={handleChange}
              placeholder="Describe the trading situation..."
            />
            <RatingGroup>
              {[1, 2, 3, 4, 5].map(rating => (
                <RatingButton
                  key={rating}
                  type="button"
                  selected={formData.situationRating === rating}
                  onClick={() => handleRating('situationRating', rating)}
                >
                  {rating}
                </RatingButton>
              ))}
            </RatingGroup>
          </FormGroup>

          <FormGroup>
            <Label>Thoughts (What were you thinking?)</Label>
            <TextArea
              name="thoughts"
              value={formData.thoughts}
              onChange={handleChange}
              placeholder="Describe your thoughts..."
            />
            <RatingGroup>
              {[1, 2, 3, 4, 5].map(rating => (
                <RatingButton
                  key={rating}
                  type="button"
                  selected={formData.thoughtsRating === rating}
                  onClick={() => handleRating('thoughtsRating', rating)}
                >
                  {rating}
                </RatingButton>
              ))}
            </RatingGroup>
          </FormGroup>

          <FormGroup>
            <Label>Emotions (How did you feel?)</Label>
            <TextArea
              name="emotions"
              value={formData.emotions}
              onChange={handleChange}
              placeholder="Describe your emotions..."
            />
            <RatingGroup>
              {[1, 2, 3, 4, 5].map(rating => (
                <RatingButton
                  key={rating}
                  type="button"
                  selected={formData.emotionsRating === rating}
                  onClick={() => handleRating('emotionsRating', rating)}
                >
                  {rating}
                </RatingButton>
              ))}
            </RatingGroup>
          </FormGroup>

          <FormGroup>
            <Label>Reaction (What did you do?)</Label>
            <TextArea
              name="reaction"
              value={formData.reaction}
              onChange={handleChange}
              placeholder="Describe your reaction..."
            />
            <RatingGroup>
              {[1, 2, 3, 4, 5].map(rating => (
                <RatingButton
                  key={rating}
                  type="button"
                  selected={formData.reactionRating === rating}
                  onClick={() => handleRating('reactionRating', rating)}
                >
                  {rating}
                </RatingButton>
              ))}
            </RatingGroup>
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="save">
              Save Assessment
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default STERModal; 