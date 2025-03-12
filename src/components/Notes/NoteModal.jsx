import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import CreatableSelect from 'react-select/creatable';

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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
  transform: translateY(${props => props.scrollOffset}px);
`;

const Modal = styled.div`
  background: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 90%;
  max-width: 800px;
  animation: ${fadeIn} 0.3s ease;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: #fff;
  margin: 0 0 20px;
  text-align: center;
  font-size: 1.5em;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #b886ee;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  font-size: 1em;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #b886ee;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;

  &.cancel {
    background-color: #4a4a4a;
    color: white;
  }

  &.save {
    background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
    color: white;
    opacity: ${props => props.disabled ? 0.5 : 1};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const AddImageButton = styled.button`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 15px;
  padding: 20px;
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

  &:focus {
    outline: 2px solid #B886EE;
    outline-offset: 2px;
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

const ImageContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  padding: 10px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.5);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(244, 67, 54, 0.75);
    transform: scale(1.1);
  }
`;

const customSelectStyles = {
  control: (base) => ({
    ...base,
    background: '#3e3e3e',
    borderColor: '#5e2ca5',
    '&:hover': {
      borderColor: '#b886ee'
    }
  }),
  menu: (base) => ({
    ...base,
    background: '#2e2e2e',
    border: '1px solid #5e2ca5'
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? '#5e2ca5' : '#2e2e2e',
    color: '#fff'
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff'
  }),
  input: (base) => ({
    ...base,
    color: '#fff'
  })
};

const NotificationBanner = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(94, 44, 165, 0.9);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2001;
  max-width: 300px;
  animation: ${fadeIn} 0.3s ease;
`;

const SourceLink = styled.span`
  color: #B886EE;
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
`;

const TagBadge = styled.span`
  background: ${props => props.type === 'Mistake' ? '#f44336' : '#4caf50'};
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  display: inline-block;
  margin: 10px 0;
`;

const NotificationMessage = styled.div`
  background: rgba(94, 44, 165, 0.95);
  color: white;
  padding: 15px 40px 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin: 20px 0;
  animation: ${fadeIn} 0.3s ease;
  line-height: 1.5;
  position: relative;
`;

const CloseNotificationButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const NoteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  note = null, 
  sourceType, 
  sourceId,
  isReviewMode = false
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      setScrollOffset(scrollY);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      console.log('Modal opened with note:', note);
      loadTags();
      
      if (note) {
        console.log('Setting form with existing note data:', note);
        setTitle(note.title || '');
        setContent(note.content || note.text || '');
        
        // Встановлюємо тег, якщо він є
        if (note.tag_id && note.tag_name) {
          setSelectedTag({
            value: note.tag_id,
            label: note.tag_name
          });
        } else {
          setSelectedTag(null);
        }
        
        // Встановлюємо зображення
        if (note.images && Array.isArray(note.images)) {
          console.log('Setting images from note:', note.images);
          setImages(note.images);
        } else {
          setImages([]);
        }
      } else {
        console.log('Creating new note, resetting form');
        resetForm();
      }

      if (isReviewMode) {
        setTimeout(() => setShowNotification(true), 100);
      }
    }
    
    return () => {
      if (isOpen) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollOffset);
      }
    };
  }, [isOpen, note]);

  const loadTags = async () => {
    try {
      const tagsData = await window.electronAPI.getAllNoteTags();
      setTags(tagsData.map(tag => ({
        value: tag.id,
        label: tag.name
      })));
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadImages = async (noteId) => {
    try {
      console.log('Loading images for note ID:', noteId);
      const imagesData = await window.electronAPI.getNoteImages(noteId);
      console.log('Loaded images:', imagesData);
      setImages(imagesData || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedTag(null);
    setImages([]);
  };

  const handleCreateTag = async (inputValue) => {
    try {
      const newTagId = await window.electronAPI.addNoteTag(inputValue);
      const newTag = { value: newTagId, label: inputValue };
      setTags(prev => [...prev, newTag]);
      setSelectedTag(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    console.log('Paste event triggered in NoteModal');
    
    const items = e.clipboardData?.items;
    if (!items) {
      console.log('No clipboard items found');
      return;
    }
    
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        try {
          console.log('Processing pasted image');
          const blob = item.getAsFile();
          const buffer = await blob.arrayBuffer();
          const filePath = await window.electronAPI.saveBlobAsFile(buffer);
          
          setImages(prev => {
            const isDuplicate = prev.some(img => img.image_path === filePath);
            if (isDuplicate) {
              console.log('Image already exists, skipping');
              return prev;
            }
            console.log('Adding new image:', filePath);
            return [...prev, { id: null, image_path: filePath }];
          });
          
          break; // Only process one image at a time
        } catch (error) {
          console.error('Error processing pasted image:', error);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Submitting note with data:', {
      title,
      content,
      selectedTag,
      sourceType,
      sourceId,
      images
    });

    try {
      // Підготовка даних для збереження
      const noteData = {
        id: note ? note.id : undefined,
        title,
        content,
        tagId: selectedTag ? selectedTag.value : null,
        tagName: selectedTag ? selectedTag.label : null,
        sourceType: sourceType || (note ? note.source_type : null),
        sourceId: sourceId || (note ? note.source_id : null),
        images: images
      };

      console.log('Prepared note data for saving:', noteData);
      
      if (typeof onSave === 'function') {
        await onSave(noteData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteImage = async (index, imageId) => {
    if (imageId) {
      try {
        await window.electronAPI.deleteNoteImage(imageId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getSourceText = (note) => {
    if (!note) return '';
    
    const sourceType = note.source_type || note.sourceType;
    const tradeNo = note.trade_no;
    const tradeDate = note.trade_date;
    
    switch (sourceType) {
      case 'presession':
        return `Pre-Session Analysis (${tradeDate ? new Date(tradeDate).toLocaleDateString() : 'N/A'})`;
      case 'trade':
        if (tradeNo && tradeDate) {
          return `Trade #${tradeNo} (${new Date(tradeDate).toLocaleDateString()})`;
        }
        return 'Trade';
      default:
        return sourceType;
    }
  };

  const getSourceLink = (note) => {
    if (!note) return '#';
    
    const sourceType = note.source_type || note.sourceType;
    const sourceId = note.source_id;
    
    switch (sourceType) {
      case 'presession':
        return `/daily-routine/pre-session/full/${sourceId}`;
      case 'trade':
        return `/trade/${sourceId}`;
      default:
        return '#';
    }
  };

  const handleSourceClick = (e, note) => {
    e.preventDefault();
    const link = getSourceLink(note);
    if (link !== '#') {
      window.location.hash = link;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={onClose} scrollOffset={scrollOffset}>
        <Modal onClick={e => e.stopPropagation()} onPaste={handlePaste}>
          <Title>{isReviewMode ? 'Note Review' : (note ? 'Edit Note' : 'Add New Note')}</Title>
          <FormContainer>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              readOnly={isReviewMode}
            />
            
            {isReviewMode ? (
              selectedTag && (
                <TagBadge type={selectedTag.label}>{selectedTag.label}</TagBadge>
              )
            ) : (
              <CreatableSelect
                isClearable
                options={tags}
                value={selectedTag}
                onChange={setSelectedTag}
                onCreateOption={handleCreateTag}
                placeholder="Select or create a tag"
                styles={customSelectStyles}
              />
            )}

            <TextArea
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              onPaste={handlePaste}
              readOnly={isReviewMode}
            />

            <ImageContainer>
              {images.map((image, index) => (
                <ImagePreview key={index}>
                  <img src={image.image_path} alt={`Note image ${index + 1}`} />
                  {!isReviewMode && (
                    <DeleteImageButton 
                      onClick={() => handleDeleteImage(index, image.id)}
                      type="button"
                    >
                      ×
                    </DeleteImageButton>
                  )}
                </ImagePreview>
              ))}
            </ImageContainer>

            {!isReviewMode && (
              <AddImageButton 
                type="button"
                onPaste={handlePaste}
                tabIndex="0"
              >
                <AddIcon>+</AddIcon>
                Add Image (натисніть Ctrl+V для вставки з буфера обміну)
              </AddImageButton>
            )}

            {showNotification && isReviewMode && note && (
              <NotificationMessage>
                To edit this note, please go to the{' '}
                <SourceLink onClick={(e) => handleSourceClick(e, note)}>
                  {getSourceText(note)}
                </SourceLink>
                {' '}page
                <CloseNotificationButton onClick={() => setShowNotification(false)}>
                  ×
                </CloseNotificationButton>
              </NotificationMessage>
            )}

            <ButtonGroup>
              <Button type="button" className="cancel" onClick={onClose}>
                Close
              </Button>
              {!isReviewMode && (
                <Button 
                  type="button" 
                  className="save" 
                  onClick={handleSubmit}
                  disabled={!title || !content}
                >
                  {note ? 'Save Changes' : 'Add Note'}
                </Button>
              )}
            </ButtonGroup>
          </FormContainer>
        </Modal>
      </ModalOverlay>
    </>
  );
};

export default NoteModal; 