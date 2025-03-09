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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
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

const NoteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  note = null, 
  sourceType, 
  sourceId 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);

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
        setTitle(note.title);
        setContent(note.content);
        setSelectedTag({ value: note.tag_id, label: note.tag_name });
        loadImages();
      } else {
        console.log('Creating new note, resetting form');
        resetForm();
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

  const loadImages = async () => {
    if (note?.id) {
      try {
        console.log('Loading images for note ID:', note.id);
        const imagesData = await window.electronAPI.getNoteImages(note.id);
        console.log('Loaded images:', imagesData);
        setImages(imagesData || []);
      } catch (error) {
        console.error('Error loading images:', error);
      }
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
    e.preventDefault();
    e.stopPropagation();
    
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
        sourceType: sourceType || (note ? note.sourceType : null),
        sourceId: sourceId || (note ? note.sourceId : null),
        images: images
      };

      console.log('Prepared note data for saving:', noteData);
      
      // Збереження нотатки через переданий callback
      if (typeof onSave === 'function') {
        await onSave(noteData);
        console.log('Note saved successfully through callback');
      } else {
        // Пряме збереження, якщо callback не переданий
        if (note && note.id) {
          console.log('Directly updating existing note:', noteData);
          await window.electronAPI.updateNote(noteData);
          
          // Зберігаємо нові зображення
          for (const image of images) {
            if (!image.id) {
              await window.electronAPI.addNoteImage(note.id, image.image_path);
            }
          }
        } else {
          console.log('Directly saving new note:', noteData);
          const newNoteId = await window.electronAPI.saveNote(noteData);
          
          // Зберігаємо зображення для нової нотатки
          for (const image of images) {
            if (!image.id) {
              await window.electronAPI.addNoteImage(newNoteId, image.image_path);
            }
          }
        }
        console.log('Note saved successfully directly');
      }
      
      // Закриття модального вікна
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

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose} scrollOffset={scrollOffset}>
      <Modal onClick={e => e.stopPropagation()} onPaste={handlePaste}>
        <Title>{note ? 'Edit Note' : 'Add New Note'}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          
          <CreatableSelect
            isClearable
            options={tags}
            value={selectedTag}
            onChange={setSelectedTag}
            onCreateOption={handleCreateTag}
            placeholder="Select or create a tag"
            styles={customSelectStyles}
          />

          <TextArea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            onPaste={handlePaste}
            required
          />

          <ImageContainer>
            {images.map((image, index) => (
              <ImagePreview key={index}>
                <img src={image.image_path} alt={`Note image ${index + 1}`} />
                <DeleteImageButton 
                  onClick={() => handleDeleteImage(index, image.id)}
                  type="button"
                >
                  ×
                </DeleteImageButton>
              </ImagePreview>
            ))}
          </ImageContainer>

          <AddImageButton 
            type="button"
            onPaste={handlePaste}
            tabIndex="0"
          >
            <AddIcon>+</AddIcon>
            Add Image (натисніть Ctrl+V для вставки з буфера обміну)
          </AddImageButton>

          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="save">
              {note ? 'Save Changes' : 'Add Note'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </ModalOverlay>
  );
};

export default NoteModal; 