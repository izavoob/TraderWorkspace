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
  box-sizing: border-box;
  transform: translateY(${props => props.scrollY}px);
  overflow: hidden;
`;

const Modal = styled.div`
  background: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 100%;
  max-width: 800px;
  animation: ${fadeIn} 0.3s ease;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
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

const AddImageButton = styled.div`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  min-height: 100px;
  

  &:hover {
    background: rgba(94, 44, 165, 0.2);
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid #B886EE;
    outline-offset: 2px;
  }

  img {
    
    border-radius: 4px;
    object-fit: contain;
  }
`;

const DeleteImageButtonOverlay = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.7);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0;
  color: white;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(244, 67, 54, 0.9);
    transform: scale(1.1);
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

const FullscreenModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  max-width: 90vw;
  max-height: 90vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 2001;
  
  &:hover {
    color: #ddd;
  }
`;

const NoteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  note = null, 
  sourceType, 
  sourceId,
  isReviewMode = false,
  onImageDelete,
  onImageUpload
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      // Блокуємо скрол
      document.body.style.overflow = 'hidden';
      console.log('Модальне вікно відкрито з нотаткою:', note);
      
      loadTags();
      
      if (note) {
        console.log('Встановлення форми з існуючими даними нотатки:', note);
        console.log('Встановлення заголовка:', note.title);
        setTitle(note.title || '');
        console.log('Встановлення контенту:', note.content || note.text);
        setContent(note.content || note.text || '');
        
        if (note.tag_id && note.tag_name) {
          setSelectedTag({
            value: note.tag_id,
            label: note.tag_name
          });
        } else {
          setSelectedTag(null);
        }
        
        if (!note.images || note.images.length === 0) {
          console.log('Зображення не знайдені в нотатці, завантажую з бази даних...');
          if (note.id) {
            loadImages(note.id).catch(err => {
              console.error('Помилка завантаження зображень:', err);
              setImages([]);
            });
          }
        } else {
          console.log('Встановлення зображень з нотатки:', note.images);
          const uniqueImagePaths = new Set();
          const uniqueImages = note.images.filter(img => {
            if (!img || !img.image_path) {
              console.warn('Знайдено зображення без шляху:', img);
              return false;
            }
            if (uniqueImagePaths.has(img.image_path)) {
              console.warn('Дублікат зображення в нотатці:', img.image_path);
              return false;
            }
            uniqueImagePaths.add(img.image_path);
            return true;
          });
          
          console.log('Унікальні зображення для відображення:', uniqueImages.length);
          setImages(uniqueImages);
        }
      } else {
        console.log('Створення нової нотатки, скидання форми');
        resetForm();
      }

      if (isReviewMode) {
        setTimeout(() => setShowNotification(true), 100);
      }
    }

    return () => {
      // Розблоковуємо скрол при закритті
      document.body.style.overflow = '';
    };
  }, [isOpen, note]);

  const loadTags = async () => {
    try {
      const tagsData = await window.electronAPI.getAllNoteTags();
      console.log('Завантажені теги:', tagsData);
      const formattedTags = tagsData.map(tag => ({
        value: tag.id,
        label: tag.name
      }));
      setTags(formattedTags);
    } catch (error) {
      console.error('Помилка завантаження тегів:', error);
    }
  };

  const loadImages = async (noteId) => {
    try {
      console.log('Завантаження зображень для нотатки ID:', noteId);
      const imagesData = await window.electronAPI.getNoteImages(noteId);
      console.log('Завантажені зображення:', imagesData);
      
      if (imagesData && imagesData.length > 0) {
        // Створюємо мапу шляхів для запобігання дублям
        const uniqueImagePaths = new Set();
        
        // Перевіряємо, чи коректні шляхи до зображень та усуваємо дублі
        const validImages = imagesData.filter(img => {
          if (!img.image_path) {
            console.warn('Зображення без шляху:', img);
            return false;
          }
          
          // Перевіряємо, чи вже є таке зображення (запобігаємо дублюванню)
          if (uniqueImagePaths.has(img.image_path)) {
            console.warn('Дублікат зображення:', img.image_path);
            return false;
          }
          
          // Додаємо шлях до множини унікальних шляхів
          uniqueImagePaths.add(img.image_path);
          return true;
        });
        
        console.log('Валідні зображення без дублів для відображення:', validImages);
        
        // Детальна інформація про зображення
        validImages.forEach((img, index) => {
          console.log(`Зображення ${index+1}:`, {
            id: img.id,
            path: img.image_path,
            fullPath: img.fullImagePath || img.image_path
          });
        });
        
        setImages(validImages);
      } else {
        console.log('Не знайдено зображень для нотатки');
        setImages([]);
      }
    } catch (error) {
      console.error('Помилка завантаження зображень:', error);
      setImages([]);
      throw error; // Пробросування помилки для обробки вище
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
          
          let filePath;
          if (onImageUpload) {
            // Використовуємо callback для завантаження зображення
            console.log('Використовую onImageUpload для завантаження зображення');
            filePath = await onImageUpload(blob);
          } else {
            // Використовуємо прямий виклик API
            console.log('onImageUpload не передано, використовую прямий виклик API');
          const buffer = await blob.arrayBuffer();
            filePath = await window.electronAPI.saveBlobAsFile(buffer);
          }
          
          if (!filePath) {
            console.error('Не вдалося отримати шлях до зображення після завантаження');
            return;
          }
          
          console.log('Отримано шлях до зображення:', filePath);
          
          setImages(prev => {
            const isDuplicate = prev.some(img => img.image_path === filePath);
            if (isDuplicate) {
              console.log('Image already exists, skipping');
              return prev;
            }
            console.log('Adding new image:', filePath);
            return [...prev, { id: null, image_path: filePath }];
          });
          
          // Видаляємо break, щоб обробити всі зображення з буфера обміну
          // break; // Only process one image at a time
        } catch (error) {
          console.error('Error processing pasted image:', error);
        }
      }
    }
  };

  const handleSave = async (noteData) => {
    try {
      console.log('Збереження нотатки:', noteData);
      
      // Перевірка наявності обов'язкових полів
      if (!noteData.title || !noteData.content) {
        console.error('Відсутні обов\'язкові поля: title і content');
        throw new Error('Title and content are required');
      }
      
      // Підготовка даних для збереження
      const noteToSave = {
        ...noteData,
        source_type: sourceType || noteData.source_type || 'trade',
        source_id: sourceId || noteData.source_id || '',
        // Передаємо як tagId, так і tag_id для сумісності
        tagId: noteData.tagId || (selectedTag ? selectedTag.value : null),
        tag_id: noteData.tag_id || (selectedTag ? selectedTag.value : null),
      };

      console.log('Підготовлена нотатка для збереження:', noteToSave);
      console.log('ID нотатки для збереження:', noteToSave.id); // Перевірка ID
      
      let savedNoteId;
      let savedNote;

      if (noteToSave.id) {
        // ВАЖЛИВО: Оновлюємо існуючу нотатку, зберігаючи її ID
        console.log('Оновлення існуючої нотатки ID:', noteToSave.id);
        
        // Отримуємо поточну нотатку з бази даних, щоб зберегти її значення source
        const existingNote = await window.electronAPI.getNoteById(noteToSave.id);
        
        // Отримуємо всі зображення, які зараз є в базі даних для цієї нотатки
        const existingImages = await window.electronAPI.getNoteImages(noteToSave.id);
        console.log('Існуючі зображення в базі даних:', existingImages);
        
        // Знаходимо зображення, які були видалені (є в базі даних, але немає в поточному стані)
        const imagesToDelete = existingImages.filter(existingImg => 
          !images.some(currentImg => currentImg.id === existingImg.id)
        );
        
        console.log('Зображення для видалення з бази даних:', imagesToDelete);
        
        // Видаляємо зображення з бази даних
        for (const imageToDelete of imagesToDelete) {
          try {
            console.log('Видалення зображення з бази даних, ID:', imageToDelete.id);
            await window.electronAPI.deleteNoteImage(imageToDelete.id);
          } catch (error) {
            console.error('Помилка видалення зображення з бази даних:', error);
          }
        }
        
        // Переконуємося, що ми зберігаємо оригінальні значення source
        const updatedNote = {
          ...noteToSave,
          // Зберігаємо оригінальні значення, якщо вони існують
          trade_no: existingNote.trade_no || noteToSave.trade_no,
          trade_date: existingNote.trade_date || noteToSave.trade_date,
          source_type: existingNote.source_type || noteToSave.source_type,
          source_id: existingNote.source_id || noteToSave.source_id
        };
        
        console.log('Оновлена нотатка зі збереженими значеннями source:', updatedNote);
        await window.electronAPI.updateNote(updatedNote);
        savedNoteId = updatedNote.id;
        console.log('Нотатка успішно оновлена, ID залишився:', savedNoteId);
      } else {
        // Створюємо нову нотатку
        console.log('Створення нової нотатки');
        savedNoteId = await window.electronAPI.addNote(noteToSave);
        console.log('Нова нотатка створена з ID:', savedNoteId);
      }
      
      // Зберігаємо нові зображення для нотатки
      if (images && images.length > 0) {
        console.log(`Збереження ${images.length} зображень для нотатки ID:${savedNoteId}`);
        for (const image of images) {
          // Зберігаємо тільки нові зображення без ID
          if (!image.id) {
            console.log('Обробка нового зображення:', image.image_path);
            let imagePath = image.image_path;
            
            try {
              // Якщо це base64 зображення, зберігаємо його як файл
              if (image.image_path.startsWith('data:')) {
                const buffer = Buffer.from(image.image_path.split(',')[1], 'base64');
                imagePath = await window.electronAPI.saveBlobAsFile(buffer);
              }
              
              console.log(`Додавання зображення до нотатки ID:${savedNoteId}`, imagePath);
              await window.electronAPI.addNoteImage(savedNoteId, imagePath);
            } catch (imgError) {
              console.error('Помилка при збереженні зображення:', imgError);
            }
          } else {
            console.log('Пропуск існуючого зображення з ID:', image.id);
          }
        }
      }
      
      // Отримуємо оновлену нотатку з усіма зображеннями
      console.log('Отримання оновленої нотатки з ID:', savedNoteId);
      savedNote = await window.electronAPI.getNoteById(savedNoteId);
      console.log('Отримана нотатка з бази даних:', savedNote);
      
      // Додатково завантажуємо зображення для нотатки
      const noteImages = await window.electronAPI.getNoteImages(savedNoteId);
      console.log('Завантажені зображення для нотатки:', noteImages);
      
      // Об'єднуємо нотатку та її зображення
      savedNote = {
        ...savedNote,
        images: noteImages || []
      };
      
      console.log('Фінальна нотатка для повернення:', savedNote);
      
      if (typeof onSave === 'function') {
        await onSave(savedNote);
      }
      
      onClose();
    } catch (error) {
      console.error('Помилка збереження нотатки:', error);
      alert(`Помилка збереження нотатки: ${error.message}`);
    }
  };

  const handleDeleteImage = async (imageId) => {
    console.log('Видалення зображення з ID:', imageId);
    
    // Видаляємо зображення тільки з локального стану
    setImages(prevImages => prevImages.filter(img => img.id !== imageId));
  };

  const getSourceText = (note) => {
    if (!note) return '';
    
    const sourceType = note.source_type || note.sourceType;
    const tradeNo = note.trade_no;
    const tradeDate = note.trade_date;
    
    if (!sourceType) {
      return 'Unknown Source';
    }
    
    switch (sourceType) {
      case 'presession':
        return `Pre-Session Analysis (${tradeDate ? new Date(tradeDate).toLocaleDateString() : 'N/A'})`;
      case 'trade':
        if (!tradeNo && !tradeDate) {
          return 'Trade not saved yet';
        }
        if (tradeNo && tradeDate) {
          return `Trade #${tradeNo} (${new Date(tradeDate).toLocaleDateString()})`;
        }
        return 'Trade was deleted';
      default:
        return `Source: ${sourceType}`;
    }
  };

  const getSourceLink = (note) => {
    if (!note) return '#';
    
    const sourceType = note.source_type || note.sourceType;
    const sourceId = note.source_id || note.sourceId;
    
    if (!sourceType || !sourceId) {
      console.warn('Missing sourceType or sourceId:', { sourceType, sourceId });
      return '#';
    }
    
    switch (sourceType) {
      case 'presession':
        return `/daily-routine/pre-session/full/${sourceId}`;
      case 'trade':
        return `/trade/${sourceId}`;
      default:
        console.warn('Unknown sourceType:', sourceType);
        return '#';
    }
  };

  const handleSourceClick = (e, note) => {
    e.preventDefault();
    try {
      const link = getSourceLink(note);
      if (link !== '#') {
        window.location.hash = link;
      } else {
        console.warn('No valid link could be generated for note:', note);
      }
    } catch (error) {
      console.error('Error navigating to source:', error);
    }
  };

  const openFullscreen = (src) => {
    const imagePath = formatImagePath(src);
    setFullscreenImage({ src: imagePath });
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  // Функція для форматування шляху до зображення
  const formatImagePath = (imagePath) => {
    if (!imagePath) return '';
    
    console.log('Оригінальний шлях до зображення:', imagePath);
    
    // Перевіряємо, чи шлях вже містить протокол file://
    if (imagePath.startsWith('file://')) {
      console.log('Шлях вже містить протокол file://', imagePath);
      return imagePath;
    }
    
    // Якщо шлях містить лише ім'я файлу (без шляху)
    if (!imagePath.includes('/') && !imagePath.includes('\\')) {
      // Шукаємо зображення в папці screenshots
      const screenshotsPath = `screenshots`;
      const formattedPath = `${screenshotsPath}/${imagePath}`;
      console.log('Сформований шлях до зображення:', formattedPath);
      // Додаємо протокол file:// до шляху
      return `file:///${formattedPath.replace(/\\/g, '/')}`;
    }
    
    // Якщо шлях вже містить папку screenshots
    if (imagePath.startsWith('screenshots/')) {
      console.log('Шлях вже містить папку screenshots:', imagePath);
      // Додаємо протокол file:// до шляху
      return `file:///${imagePath.replace(/\\/g, '/')}`;
    }
    
    // Для інших випадків просто додаємо протокол file://
    return `file:///${imagePath.replace(/\\/g, '/')}`;
  };

  // Додаємо обробник для кнопки Cancel
  const handleCancel = () => {
    console.log('Скасування змін');
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={handleCancel} scrollY={scrollY}>
        <Modal onClick={e => e.stopPropagation()}>
          <Title>{isReviewMode ? 'Review' : (note ? 'Edit Note' : 'Add New Note')}</Title>
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

            {/* Відображення зображення для режиму редагування */}
            {!isReviewMode && (
              <>
                <AddImageButton 
                  onPaste={handlePaste}
                  tabIndex={0}
                  style={{ padding: images.length > 0 ? '10px' : '20px' }}
                >
                  {images.length > 0 ? (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '15px', 
                      width: '100%',
                      padding: '5px'
                    }}>
                      {/* Перше зображення */}
                      <div 
                        style={{ 
                          position: 'relative', 
                          width: '100%' 
                        }}
                        onMouseEnter={(e) => {
                          const deleteButton = e.currentTarget.querySelector('.delete-button');
                          if (deleteButton) {
                            deleteButton.style.opacity = '1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const deleteButton = e.currentTarget.querySelector('.delete-button');
                          if (deleteButton) {
                            deleteButton.style.opacity = '0';
                          }
                        }}
                      >
                        <img 
                          src={formatImagePath(images[0].image_path)} 
                          alt="Note image" 
                          style={{ 
                            width: '100%', 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openFullscreen(images[0].image_path);
                          }}
                        />
                        <DeleteImageButtonOverlay 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(images[0].id);
                          }}
                          style={{ 
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                          className="delete-button"
                        >
                          ×
                        </DeleteImageButtonOverlay>
                      </div>
                      
                      {/* Додаткові зображення */}
                      {images.length > 1 && images.slice(1).map((image, index) => (
                        <div 
                          key={`additional-image-${index}`} 
                          style={{ 
                            position: 'relative', 
                            width: '100%' 
                          }}
                          onMouseEnter={(e) => {
                            const deleteButton = e.currentTarget.querySelector('.delete-button');
                            if (deleteButton) {
                              deleteButton.style.opacity = '1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            const deleteButton = e.currentTarget.querySelector('.delete-button');
                            if (deleteButton) {
                              deleteButton.style.opacity = '0';
                            }
                          }}
                        >
                          <img 
                            src={formatImagePath(image.image_path)} 
                            alt={`Additional image ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              borderRadius: '8px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openFullscreen(image.image_path);
                            }}
                          />
                          <DeleteImageButtonOverlay 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(image.id);
                            }}
                            style={{ 
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                            className="delete-button"
                          >
                            ×
                          </DeleteImageButtonOverlay>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <span>Натисніть Ctrl+V для вставки зображення з буфера обміну</span>
                      <span style={{ 
                        fontSize: '0.8em', 
                        marginTop: '5px', 
                        opacity: 0.7,
                        textAlign: 'center'
                      }}>
                        Ви можете вставити декілька зображень одне за одним
                      </span>
                    </>
                  )}
                </AddImageButton>
              </>
            )}

            {/* Відображення зображення для режиму перегляду */}
            {isReviewMode && images.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                {images.map((image, index) => {
                  // Перевірка та конвертація шляху до зображення
                  const imagePath = formatImagePath(image.image_path);
                  console.log(`Відображення зображення ${index + 1} в режимі перегляду:`, {
                    шлях: imagePath,
                    зображення: image
                  });
                  
                  return (
                    <img 
                      key={`review-image-${index}`}
                      src={imagePath} 
                      alt={`Note image ${index + 1}`} 
                      onClick={() => openFullscreen(image.image_path)}
                      style={{ 
                        maxWidth: '100%',  
                        cursor: 'pointer',
                        borderRadius: '8px',
                        border: '1px solid #5e2ca5',
                        marginBottom: index < images.length - 1 ? '10px' : '0',
                        display: 'block'
                      }}
                    />
                  );
                })}
              </div>
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
              <Button type="button" className="cancel" onClick={handleCancel}>
                Close
              </Button>
              {!isReviewMode && (
                <Button 
                  type="button" 
                  className="save" 
                  onClick={() => handleSave({
                    id: note ? note.id : undefined,
                    title,
                    content,
                    tagId: selectedTag ? selectedTag.value : null,
                    sourceType,
                    sourceId,
                    images
                  })}
                  disabled={!title || !content}
                >
                  {note ? 'Save Changes' : 'Add Note'}
                </Button>
              )}
            </ButtonGroup>
          </FormContainer>
        </Modal>
      </ModalOverlay>
      
      {fullscreenImage && (
        <ModalOverlay 
          onClick={closeFullscreen} 
          scrollY={scrollY}
          style={{ zIndex: 3000 }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              borderRadius: '15px',
              padding: '20px',
              position: 'relative',
              width: '90%',
              height: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={closeFullscreen}>×</CloseButton>
            <img
              src={fullscreenImage.src}
              alt="Fullscreen preview"
              style={{
                
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '2px solid rgb(94, 44, 165)',
                cursor: 'pointer'
              }}
              onClick={closeFullscreen}
            />
          </div>
        </ModalOverlay>
      )}
    </>
  );
};

export default NoteModal;
