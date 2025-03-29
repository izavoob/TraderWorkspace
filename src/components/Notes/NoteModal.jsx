import React, { useState, useEffect, useRef } from 'react';
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
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);  display: flex;
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
  width: 100%;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  min-height: 100px;
  text-align: justify;
  font-size: 16px;
  padding: 5px;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.3px;
  line-height: 1.5;
  resize: none;
  overflow: hidden;
  
  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
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
  flex-direction: column;
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

const CommentImageButtonOverlay = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(33, 150, 243, 0.7);
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
    background: rgba(33, 150, 243, 0.9);
    transform: scale(1.1);
  }
`;

const ImageCommentInput = styled.textarea`
  width: 97%;
  padding: 8px 10px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 0 0 8px 8px;
  color: #fff;
  resize: none;
  min-height: 40px;
  margin-top: -5px;
  transition: all 0.3s ease;
  overflow: hidden;

  &:focus {
    outline: none;
    border-color: #b886ee;
  }
`;

const CommentHint = styled.div`
  font-size: 0.9em;
  color: #ff4d4d;
  padding: 4px 10px;
  text-align: right;
  font-weight: bold;
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
  const [imageComments, setImageComments] = useState({});
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showCommentHint, setShowCommentHint] = useState(false);
  const [commentHintId, setCommentHintId] = useState(null);
  const [pendingComments, setPendingComments] = useState({});
  
  const textAreaRef = useRef(null);
  const commentInputRefs = useRef({});

  // Функція для автоматичної зміни висоти текстових полів
  const autoResizeTextarea = (element) => {
    if (!element) return;
    
    // Скидаємо висоту до мінімальної
    element.style.height = 'auto';
    // Встановлюємо нову висоту на основі вмісту
    element.style.height = `${element.scrollHeight}px`;
  };

  // Застосовуємо автоматичну зміну висоти до основного текстового поля
  useEffect(() => {
    if (textAreaRef.current) {
      autoResizeTextarea(textAreaRef.current);
    }
  }, [content]);

  // Застосовуємо автоматичну зміну висоти до полів коментарів
  useEffect(() => {
    Object.keys(commentInputRefs.current).forEach(id => {
      if (commentInputRefs.current[id]) {
        autoResizeTextarea(commentInputRefs.current[id]);
      }
    });
  }, [imageComments]);

  useEffect(() => {
    if (isOpen) {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      // Блокуємо скрол
      document.body.style.overflow = 'hidden';
      console.log('Модальне вікно відкрито з нотаткою:', note);
      
      loadTags();
      
      if (note) {
        console.log('Завантаження даних нотатки:', note);
        setTitle(note.title || '');
        setContent(note.content || note.text || '');
        
        // Встановлюємо тег, якщо він є
        if (note.tag_id || note.tagId) {
          const tagId = note.tag_id || note.tagId;
          console.log('Встановлення тегу з ID:', tagId);
          setSelectedTag({ value: tagId, label: note.tag_name || 'Tag' });
        }
        
        // Завантажуємо зображення для нотатки
          if (note.id) {
          loadImages(note.id);
        } else if (note.images && note.images.length > 0) {
          console.log('Використовуємо зображення з об\'єкта нотатки:', note.images);
          
          // Перевіряємо, чи всі зображення мають унікальні шляхи
          const uniqueImagePaths = new Set();
          const uniqueImages = note.images.filter(img => {
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
          
          console.log('Унікальні зображення для відображення:', uniqueImages.length);
          setImages(uniqueImages);
          
          // Завантажуємо коментарі до зображень
          const commentsObj = {};
          uniqueImages.forEach(img => {
            if (img.comment) {
              commentsObj[img.id] = img.comment;
              
              // Автоматично активуємо коментарі, які вже існують
              if (!isReviewMode) {
                setActiveCommentId(img.id);
              }
            }
          });
          setImageComments(commentsObj);
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
            comment: img.comment,
            fullPath: img.fullImagePath || img.image_path
          });
        });
        
        setImages(validImages);
        
        // Завантажуємо коментарі до зображень
        const commentsObj = {};
        validImages.forEach(img => {
          if (img.comment) {
            commentsObj[img.id] = img.comment;
            
            // Автоматично активуємо коментарі, які вже існують
            if (!isReviewMode) {
              setActiveCommentId(img.id);
            }
          }
        });
        setImageComments(commentsObj);
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
    setImageComments({});
    setActiveCommentId(null);
    setShowCommentHint(false);
    setCommentHintId(null);
    setPendingComments({});
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
    console.log('Paste event triggered in NoteModal');
    
    // Перевіряємо, чи подія відбулася в текстовому полі
    const isTextArea = e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT';
    
    // Якщо це текстове поле, дозволяємо стандартну поведінку вставлення тексту
    if (isTextArea) {
      console.log('Paste event in text field, allowing default behavior');
      // Не викликаємо preventDefault(), щоб дозволити стандартну поведінку
      
      // Викликаємо autoResizeTextarea після вставлення тексту
      setTimeout(() => {
        if (e.target) {
          autoResizeTextarea(e.target);
        }
      }, 0);
      
      return;
    }
    
    // Якщо це не текстове поле, обробляємо вставлення зображень
    e.preventDefault();
    
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
          
          // Генеруємо тимчасовий ID для нового зображення
          const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          
          setImages(prev => {
            const isDuplicate = prev.some(img => img.image_path === filePath);
            if (isDuplicate) {
              console.log('Image already exists, skipping');
              return prev;
            }
            console.log('Adding new image:', filePath);
            return [...prev, { id: tempId, image_path: filePath }];
          });
        } catch (error) {
          console.error('Error processing pasted image:', error);
        }
      }
    }
  };

  const handleSave = async () => {
    try {
      console.log('Збереження нотатки, ID:', note?.id);
      
      // Перевірка наявності обов'язкових полів
      if (!title.trim()) {
        alert('Title is required');
        return;
      }
      
      // Зберігаємо основні дані нотатки
      const noteData = {
        id: note?.id,
        title,
        content,
        tag_id: selectedTag ? selectedTag.value : null,
        tagId: selectedTag ? selectedTag.value : null,
        source_type: sourceType || (note ? note.source_type || note.sourceType : null),
        source_id: sourceId || (note ? note.source_id || note.sourceId : null),
        trade_no: note ? note.trade_no || note.tradeNo : null,
        trade_date: note ? note.trade_date || note.tradeDate : null,
        images: images
      };
      
      console.log('Підготовлені дані для збереження:', noteData);
      
      let savedNoteId;
      let savedNote = { ...noteData };
      
      if (note && note.id) {
        // Оновлюємо існуючу нотатку
        console.log('Оновлення існуючої нотатки з ID:', note.id);
        
        try {
        // Отримуємо поточну нотатку з бази даних, щоб зберегти її значення source
          const existingNote = await window.electronAPI.getNoteById(note.id);
          console.log('Отримано існуючу нотатку з бази даних:', existingNote);
        
        // Переконуємося, що ми зберігаємо оригінальні значення source
        const updatedNote = {
            ...noteData,
            id: note.id,
          // Зберігаємо оригінальні значення, якщо вони існують
            trade_no: existingNote.trade_no || noteData.trade_no,
            trade_date: existingNote.trade_date || noteData.trade_date,
            source_type: existingNote.source_type || noteData.source_type,
            source_id: existingNote.source_id || noteData.source_id
        };
        
        console.log('Оновлена нотатка зі збереженими значеннями source:', updatedNote);
          const updatedNoteResult = await window.electronAPI.updateNote(updatedNote);
          console.log('Результат оновлення нотатки:', updatedNoteResult);
          
          savedNoteId = note.id;
          savedNote = { ...updatedNote };

          // Зберігаємо зображення для існуючої нотатки
          console.log('Зберігаємо зображення для існуючої нотатки:', images);
          for (const image of images) {
            if (!image.id || image.id.toString().startsWith('temp_')) {
              console.log('Додаємо нове зображення:', image);
              const imageId = await window.electronAPI.addNoteImage(savedNoteId, image.image_path);
              console.log('Зображення додано з ID:', imageId);
              
              // Якщо є коментар для цього зображення, зберігаємо його
              if (imageComments[image.id]) {
                console.log('Зберігаємо коментар для нового зображення:', imageComments[image.id]);
                await window.electronAPI.updateNoteImageComment(imageId, imageComments[image.id]);
              }
            } else if (imageComments[image.id]) {
              // Оновлюємо коментар для існуючого зображення
              console.log('Оновлюємо коментар для існуючого зображення:', image.id, imageComments[image.id]);
              await window.electronAPI.updateNoteImageComment(image.id, imageComments[image.id]);
            }
          }
        } catch (error) {
          console.error('Помилка при оновленні нотатки:', error);
          throw error;
        }
      } else {
        // Створюємо нову нотатку
        console.log('Створення нової нотатки');
        try {
          // Використовуємо addNote замість saveNote для нових нотаток
          savedNoteId = await window.electronAPI.addNote(noteData);
        console.log('Нова нотатка створена з ID:', savedNoteId);
          savedNote.id = savedNoteId;
      
          // Зберігаємо зображення для нової нотатки
          console.log('Зберігаємо зображення для нової нотатки:', images);
        for (const image of images) {
            console.log('Додаємо зображення:', image);
            const imageId = await window.electronAPI.addNoteImage(savedNoteId, image.image_path);
            console.log('Зображення додано з ID:', imageId);
            
            // Якщо є коментар для цього зображення, зберігаємо його
            if (imageComments[image.id]) {
              console.log('Зберігаємо коментар для зображення:', imageComments[image.id]);
              await window.electronAPI.updateNoteImageComment(imageId, imageComments[image.id]);
            }
          }
        } catch (error) {
          console.error('Помилка при створенні нової нотатки:', error);
          throw error;
        }
      }
      
      console.log('Нотатка збережена з ID:', savedNoteId);
      
      // Очищаємо список відкладених коментарів
      setPendingComments({});
      
      // Викликаємо колбек для оновлення батьківського компонента
      if (typeof onSave === 'function') {
        console.log('Викликаємо onSave з нотаткою:', savedNote);
        // Передаємо повний об'єкт нотатки, а не тільки ID
        onSave(savedNote);
      }
      
      // Закриваємо модальне вікно
      resetForm();
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

  const handleToggleComment = (imageId) => {
    console.log('Перемикання коментаря для зображення з ID:', imageId);
    
    if (activeCommentId === imageId) {
      // Якщо коментар вже активний, закриваємо його тільки якщо він порожній
      const comment = imageComments[imageId] || '';
      if (comment.trim() === '') {
        setActiveCommentId(null);
        setShowCommentHint(false);
        setCommentHintId(null);
      }
    } else {
      // Інакше активуємо коментар для цього зображення
      setActiveCommentId(imageId);
      
      // Якщо коментар порожній, показуємо підказку
      const comment = imageComments[imageId] || '';
      if (comment.trim() === '') {
        setShowCommentHint(true);
        setCommentHintId(imageId);
      } else {
        setShowCommentHint(false);
      }
    }
  };

  const handleCommentChange = (imageId, comment) => {
    console.log('Зміна коментаря для зображення з ID:', imageId, comment);
    
    // Оновлюємо стан коментарів
    setImageComments(prev => ({
      ...prev,
      [imageId]: comment
    }));
    
    // Додаємо коментар до списку відкладених змін
    setPendingComments(prev => ({
      ...prev,
      [imageId]: comment
    }));
    
    // Показуємо підказку, якщо коментар порожній, і тільки для активного поля
    if (comment.trim() === '') {
      setShowCommentHint(true);
      setCommentHintId(imageId);
    } else {
      setShowCommentHint(false);
    }
  };

  const handleCommentKeyDown = async (e, imageId) => {
    // Якщо натиснуто Backspace і коментар порожній, закриваємо поле введення
    if (e.key === 'Backspace' && !e.target.value.trim()) {
      e.preventDefault();
      
      // Деактивуємо поле введення, але залишаємо коментар видимим, якщо він не порожній
      setActiveCommentId(null);
      setShowCommentHint(false);
      setCommentHintId(null);
      
      // Видаляємо коментар зі стану
      setImageComments(prev => {
        const newComments = { ...prev };
        delete newComments[imageId];
        return newComments;
      });
      
      // Додаємо видалення коментаря до списку відкладених змін
      setPendingComments(prev => ({
        ...prev,
        [imageId]: null
      }));
    }
  };

  // Цей метод тепер використовується тільки при збереженні нотатки
  const saveImageComment = async (imageId, comment) => {
    if (!imageId) return;
    
    try {
      await window.electronAPI.updateNoteImageComment(imageId, comment);
      console.log('Коментар збережено в базі даних');
    } catch (error) {
      console.error('Помилка збереження коментаря:', error);
    }
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
    console.log('Відкриття зображення у повноекранному режимі:', src);
    
    // Зберігаємо поточну позицію прокрутки
    setScrollY(window.scrollY);
    
    // Форматуємо шлях до зображення
    setFullscreenImage(formatImagePath(src));
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  // Функція для форматування шляху до зображення
  const formatImagePath = (imagePath) => {
    if (!imagePath) return '';
    
    console.log('Оригінальний шлях до зображення:', imagePath);
    
    // Якщо це base64 зображення, повертаємо як є
    if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // Якщо шлях вже містить протокол file://
    if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('file://')) {
      console.log('Шлях вже містить протокол file://', imagePath);
      return imagePath;
    }
    
    // Якщо imagePath - це об'єкт з полем fullImagePath або image_path
    if (imagePath && typeof imagePath === 'object') {
      if (imagePath.fullImagePath) {
        return imagePath.fullImagePath;
      }
      if (imagePath.image_path) {
        // Перевіряємо, чи шлях до зображення є абсолютним
        const path = imagePath.image_path;
        if (path.startsWith('/') || path.includes(':\\') || path.includes(':/')) {
          return path;
        }
        // Якщо шлях відносний, додаємо префікс screenshots/
        if (!path.includes('screenshots/')) {
          return `screenshots/${path}`;
        }
        return path;
      }
    }
    
    // Якщо imagePath - це рядок, але не містить повний шлях
    if (imagePath && typeof imagePath === 'string') {
      // Перевіряємо, чи шлях до зображення є абсолютним
      if (imagePath.startsWith('/') || imagePath.includes(':\\') || imagePath.includes(':/')) {
        return imagePath;
      }
      // Якщо шлях відносний, додаємо префікс screenshots/
      if (!imagePath.includes('screenshots/')) {
        return `screenshots/${imagePath}`;
      }
    }
    
    // Для інших випадків повертаємо шлях як є
    return imagePath;
  };

  // Додаємо обробник для кнопки Cancel
  const handleCancel = () => {
    console.log('Скасування змін');
    
    // Якщо це нова нотатка або редагування існуючої, скасовуємо всі зміни
    if (!isReviewMode) {
      // Скасовуємо зміни в коментарях до зображень
      if (note && note.id) {
        // Для існуючої нотатки - відновлюємо оригінальні дані з note
        setTitle(note.title || '');
        setContent(note.content || note.text || '');
        
        // Встановлюємо тег, якщо він є
        if (note.tag_id || note.tagId) {
          const tagId = note.tag_id || note.tagId;
          setSelectedTag({ value: tagId, label: note.tag_name || 'Tag' });
        } else {
          setSelectedTag(null);
        }
        
        // Відновлюємо оригінальні зображення та коментарі
        loadImages(note.id);
      } else {
        // Для нової нотатки - просто очищаємо всі поля
    resetForm();
      }
      
      // Очищаємо список відкладених коментарів
      setPendingComments({});
    }
    
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
              onChange={(e) => {
                setContent(e.target.value);
                autoResizeTextarea(e.target);
              }}
              onPaste={handlePaste}
              onCut={(e) => {
                // Дозволяємо стандартну поведінку вирізання
                setTimeout(() => autoResizeTextarea(e.target), 0);
              }}
              onCopy={() => {
                // Дозволяємо стандартну поведінку копіювання
              }}
              readOnly={isReviewMode}
              ref={textAreaRef}
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
                          const commentButton = e.currentTarget.querySelector('.comment-button');
                          if (deleteButton) {
                            deleteButton.style.opacity = '1';
                          }
                          if (commentButton) {
                            commentButton.style.opacity = '1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const deleteButton = e.currentTarget.querySelector('.delete-button');
                          const commentButton = e.currentTarget.querySelector('.comment-button');
                          if (deleteButton) {
                            deleteButton.style.opacity = '0';
                          }
                          if (commentButton) {
                            commentButton.style.opacity = '0';
                          }
                        }}
                      >
                        <img 
                          src={formatImagePath(images[0])} 
                          alt="Note image" 
                          style={{ 
                            width: '100%', 
                            objectFit: 'cover',
                            borderRadius: activeCommentId === images[0].id ? '4px 4px 0 0' : '4px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openFullscreen(images[0]);
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
                          title="Видалити зображення"
                        >
                          ×
                        </DeleteImageButtonOverlay>
                        <CommentImageButtonOverlay 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComment(images[0].id);
                          }}
                          style={{ 
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                          className="comment-button"
                          title="Додати коментар до зображення"
                        >
                          <span style={{ fontSize: '14px' }}>💬</span>
                        </CommentImageButtonOverlay>
                        
                        {(activeCommentId === images[0].id || imageComments[images[0].id]) && (
                          <>
                            <ImageCommentInput
                              placeholder="Add a comment to the image..."
                              value={imageComments[images[0].id] || ''}
                              onChange={(e) => {
                                handleCommentChange(images[0].id, e.target.value);
                                autoResizeTextarea(e.target);
                              }}
                              onKeyDown={(e) => handleCommentKeyDown(e, images[0].id)}
                              onPaste={(e) => {
                                // Дозволяємо стандартну поведінку вставлення для текстових полів
                                setTimeout(() => autoResizeTextarea(e.target), 0);
                              }}
                              onCut={(e) => {
                                // Дозволяємо стандартну поведінку вирізання
                                setTimeout(() => autoResizeTextarea(e.target), 0);
                              }}
                              onCopy={() => {
                                // Дозволяємо стандартну поведінку копіювання
                              }}
                              onBlur={() => {
                                // Більше не зберігаємо коментар при втраті фокусу
                                // Коментарі будуть збережені тільки при натисканні кнопки "Save"
                              }}
                              autoFocus={activeCommentId === images[0].id}
                              ref={(el) => {
                                commentInputRefs.current[images[0].id] = el;
                              }}
                            />
                            {showCommentHint && commentHintId === images[0].id && (
                              <CommentHint>
                                Press Backspace to cancel
                              </CommentHint>
                            )}
                          </>
                        )}
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
                            const commentButton = e.currentTarget.querySelector('.comment-button');
                            if (deleteButton) {
                              deleteButton.style.opacity = '1';
                            }
                            if (commentButton) {
                              commentButton.style.opacity = '1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            const deleteButton = e.currentTarget.querySelector('.delete-button');
                            const commentButton = e.currentTarget.querySelector('.comment-button');
                            if (deleteButton) {
                              deleteButton.style.opacity = '0';
                            }
                            if (commentButton) {
                              commentButton.style.opacity = '0';
                            }
                          }}
                        >
                          <img 
                            src={formatImagePath(image)} 
                            alt={`Additional image ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              borderRadius: activeCommentId === image.id ? '8px 8px 0 0' : '8px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openFullscreen(image);
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
                            title="Видалити зображення"
                          >
                            ×
                          </DeleteImageButtonOverlay>
                          <CommentImageButtonOverlay 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComment(image.id);
                            }}
                            style={{ 
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                            className="comment-button"
                            title="Додати коментар до зображення"
                          >
                            <span style={{ fontSize: '14px' }}>💬</span>
                          </CommentImageButtonOverlay>
                          
                          {(activeCommentId === image.id || imageComments[image.id]) && (
                            <>
                              <ImageCommentInput
                                placeholder="Add a comment to the image..."
                                value={imageComments[image.id] || ''}
                                onChange={(e) => {
                                  handleCommentChange(image.id, e.target.value);
                                  autoResizeTextarea(e.target);
                                }}
                                onKeyDown={(e) => handleCommentKeyDown(e, image.id)}
                                onPaste={(e) => {
                                  // Дозволяємо стандартну поведінку вставлення для текстових полів
                                  setTimeout(() => autoResizeTextarea(e.target), 0);
                                }}
                                onCut={(e) => {
                                  // Дозволяємо стандартну поведінку вирізання
                                  setTimeout(() => autoResizeTextarea(e.target), 0);
                                }}
                                onCopy={() => {
                                  // Дозволяємо стандартну поведінку копіювання
                                }}
                                onBlur={() => {
                                  // Більше не зберігаємо коментар при втраті фокусу
                                  // Коментарі будуть збережені тільки при натисканні кнопки "Save"
                                }}
                                autoFocus={activeCommentId === image.id}
                                ref={(el) => {
                                  commentInputRefs.current[image.id] = el;
                                }}
                              />
                              {showCommentHint && commentHintId === image.id && (
                                <CommentHint>
                                  Press Backspace to cancel
                                </CommentHint>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <span>Ctrl+V to insert photo</span>
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
                  const imagePath = formatImagePath(image);
                  console.log(`Відображення зображення ${index + 1} в режимі перегляду:`, {
                    шлях: imagePath,
                    зображення: image
                  });
                  
                  return (
                    <div key={`review-image-${index}`} style={{ marginBottom: index < images.length - 1 ? '20px' : '0' }}>
                    <img 
                      src={imagePath} 
                      alt={`Note image ${index + 1}`} 
                        onClick={() => openFullscreen(image)}
                      style={{ 
                        maxWidth: '100%',  
                        cursor: 'pointer',
                          borderRadius: image.comment ? '8px 8px 0 0' : '8px',
                        border: '1px solid #5e2ca5',
                        display: 'block'
                      }}
                    />
                      {image.comment && (
                        <div 
                          style={{ 
                            padding: '10px 15px',
                            background: '#3e3e3e',
                            borderRadius: '0 0 8px 8px',
                            border: '1px solid #5e2ca5',
                            borderTop: 'none',
                            color: '#fff',
                            fontSize: '0.9em',
                            lineHeight: '1.4'
                          }}
                        >
                          {image.comment}
                        </div>
                      )}
                    </div>
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
                Cancel
              </Button>
              {!isReviewMode && (
                <Button 
                  type="button" 
                  className="save" 
                  onClick={handleSave}
                  disabled={!title.trim()}
                >
                  {note && note.id ? 'Save Changes' : 'Add Note'}
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
              src={fullscreenImage}
              alt="Fullscreen preview"
              style={{
                maxWidth: '100%',
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
