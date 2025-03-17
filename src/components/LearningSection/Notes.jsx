import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import NoteModal from '../Notes/NoteModal.jsx';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const buttonHoverAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

const NotesContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
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

const HeaderActionsContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  margin-top: 50px;
  justify-content: flex-end;
  padding: 0 30px;
  background: transparent;
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  max-width: 1200px;
  width: 100%;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const NotesBlock = styled.div`
  flex: 1;
  background: #2e2e2e;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  overflow: hidden;
  max-height: 600px;
  border: 2px solid #7425C9;
`;

const MistakesBlock = styled.div`
  flex: 1;
  background: #2e2e2e;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  overflow: hidden;
  max-height: 600px;
  border: 2px solid #d32f2f;
`;

const BlockTitle = styled.h2`
  color: rgb(230, 243, 255);
  text-align: center;
  margin: 0;
  padding: 15px 0;
  font-size: 1.5em;
  border-bottom: 1px solid ${props => props.type === 'mistakes' ? 'rgba(211, 47, 47, 0.3)' : 'rgba(116, 37, 201, 0.3)'};
  background: ${props => props.type === 'mistakes' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(116, 37, 201, 0.1)'};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const NotesContent = styled.div`
  padding: 15px;
  overflow-y: auto;
  flex: 1;
  height: calc(100% - 50px);
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.type === 'mistakes' ? '#d32f2f' : '#7425C9'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.type === 'mistakes' ? '#b71c1c' : '#5e2ca5'};
  }
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
  width: 100%;
`;

const NoteCard = styled.div`
  background: #3e3e3e;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 10px;
    display: block;
  }
`;

const NoteContent = styled.div`
  background: rgb(26, 26, 26));
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.2s ease;
  flex: 1;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(94, 44, 165, 0.3);
  padding-bottom: 10px;
`;

const NoteTitle = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 1.2em;
`;

const TradeLink = styled.div`
  color: #b886ee;
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(116, 37, 201, 0.2);
  
  &:hover {
    background: rgba(116, 37, 201, 0.3);
  }
`;

const NoNotesMessage = styled.div`
  color: #fff;
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  background: rgba(116, 37, 201, 0.1);
  border-radius: 15px;
  margin-top: 20px;
`;

const TagBadge = styled.span`
  background-color: ${props => {
    if (props.type === 'Note') return '#7425C9';
    if (props.type === 'Mistake') return '#d32f2f';
    if (props.type === 'presession') return '#7425C9';
    if (props.type === 'trade') return '#B886EE';
    return '#5e2ca5';
  }};
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
`;

const FiltersDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  z-index: 1001;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: ${props => props.show ? 'block' : 'none'};
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  color: #fff;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 12px;
  background: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
  
  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #5e2ca5;
  border-radius: 4px;
  background-color: #3e3e3e;
  transition: all 0.2s ease;
  position: relative;
  margin-top: 20px;

  &:checked {
    background: linear-gradient(135deg, #7425C9, #B886EE);
    border-color: transparent;

    &:after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &:hover {
    border-color: #B886EE;
  }
`;

const NoteText = styled.div`
  color: #fff;
  margin-top: 10px;
  white-space: pre-wrap;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: ${props => props.variant === 'delete' 
    ? 'linear-gradient(135deg, #e53935, #d32f2f)' 
    : 'linear-gradient(135deg, #7425C9, #B886EE)'};
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    animation: ${buttonHoverAnimation} 1s ease infinite;
  }

  &:active {
    transform: translateY(0);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
    z-index: -1;
  }

  &:hover:before {
    left: 100%;
  }
`;

function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filters, setFilters] = useState({
    sourceType: '',
  });
  const [tags, setTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
    loadTags();
    
    // Закриття фільтрів при кліку поза ними
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target) && 
          !event.target.closest('button[data-filter-toggle]')) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadNotes = async () => {
    try {
      console.log('Завантаження нотаток...');
      const allNotes = await window.electronAPI.getAllNotes();
      console.log('Отримані нотатки:', allNotes);
      
      // Завантажуємо зображення для кожної нотатки окремо
      const notesWithImages = await Promise.all(allNotes.map(async (note) => {
        try {
          if (note.id) {
            console.log(`Завантаження зображень для нотатки ID=${note.id}`);
            const images = await window.electronAPI.getNoteImages(note.id);
            console.log(`Отримано ${images.length} зображень для нотатки ID=${note.id}`);
            
            return {
              ...note,
              images: images
            };
          }
          return note;
        } catch (error) {
          console.error(`Помилка завантаження зображень для нотатки ID=${note.id}:`, error);
          return note;
        }
      }));
      
      console.log('Нотатки з завантаженими зображеннями:', notesWithImages);
      setNotes(notesWithImages);
    } catch (error) {
      console.error('Помилка завантаження нотаток:', error);
    }
  };

  const loadTags = async () => {
    try {
      console.log('Завантаження тегів...');
      const tagsData = await window.electronAPI.getAllNoteTags();
      console.log('Отримані теги:', tagsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Помилка завантаження тегів:', error);
    }
  };

  const getSourceText = (note) => {
    console.log('Отримання тексту джерела для нотатки:', note);
    
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

  const getSourceLink = async (sourceType, sourceId) => {
    if (!sourceType || !sourceId) return null;
    
    try {
      switch (sourceType) {
        case 'presession':
          const presession = await window.electronAPI.getPresession(sourceId);
          if (!presession) {
            console.error('Presession not found:', sourceId);
            return null;
          }
          return `/daily-routine/pre-session/full/${sourceId}`;
        case 'trade':
          const trade = await window.electronAPI.getTrade(sourceId);
          if (!trade) {
            console.error('Trade not found:', sourceId);
            return null;
          }
          return `/trade/${sourceId}`;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error checking source existence:', error);
      return null;
    }
  };

  const handleSourceClick = async (e, sourceType, sourceId) => {
    e.stopPropagation();
    const link = await getSourceLink(sourceType, sourceId);
    if (link) {
      navigate(link);
    } else {
      alert('Source was deleted or not found');
    }
  };

  const handleNoteClick = async (note) => {
    console.log('Клік на нотатці:', note);
    
    try {
      if (note && note.id) {
        // Отримуємо зображення для нотатки
        const noteImages = await window.electronAPI.getNoteImages(note.id);
        console.log('Отримані зображення для нотатки:', noteImages);
        
        // Оновлюємо нотатку з отриманими зображеннями
        setSelectedNote({
          ...note,
          images: noteImages
        });
      } else {
        setSelectedNote(note);
      }
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('Помилка при отриманні зображень для нотатки:', error);
      setSelectedNote(note);
      setIsModalOpen(true);
    }
  };

  const handleNoteSelect = (noteId) => {
    setSelectedNotes(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      }
      return [...prev, noteId];
    });
  };

  const handleDeleteSelected = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити вибрані нотатки?')) {
      try {
        console.log('Видалення вибраних нотаток:', selectedNotes);
        for (const noteId of selectedNotes) {
          await window.electronAPI.deleteNote(noteId);
        }
        setSelectedNotes([]);
        loadNotes();
      } catch (error) {
        console.error('Помилка видалення нотаток:', error);
      }
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      console.log('Збереження нотатки у Notes.jsx:', noteData);
      
      // Обробка зображень перед збереженням
      if (noteData.images && noteData.images.length > 0) {
        const processedImages = noteData.images.map(image => {
          // Якщо шлях до зображення містить лише ім'я файлу, переконуємося, що воно буде збережено в папці screenshots
          if (image.image_path && !image.image_path.includes('/') && !image.image_path.includes('\\')) {
            return {
              ...image,
              image_path: `screenshots/${image.image_path}`
            };
          }
          return image;
        });
        
        noteData.images = processedImages;
      }
      
      if (noteData.id) {
        // Оновлюємо існуючу нотатку
        console.log('Оновлюємо існуючу нотатку:', noteData);
        await window.electronAPI.updateNote(noteData);
        
        // Зберігаємо нові зображення
        if (noteData.images && noteData.images.length > 0) {
          for (const image of noteData.images) {
            if (!image.id) {
              console.log('Додаємо нове зображення до існуючої нотатки:', image);
              await window.electronAPI.addNoteImage(noteData.id, image.image_path);
            }
          }
        }
      } else {
        // Створюємо нову нотатку
        console.log('Створюємо нову нотатку:', noteData);
        const newNoteId = await window.electronAPI.saveNote(noteData);
        
        // Зберігаємо зображення для нової нотатки
        if (noteData.images && noteData.images.length > 0) {
          for (const image of noteData.images) {
            if (!image.id) {
              console.log('Додаємо зображення до нової нотатки:', image);
              await window.electronAPI.addNoteImage(newNoteId, image.image_path);
            }
          }
        }
      }
      
      // Оновлюємо список нотаток
      await loadNotes();
      
      // Закриваємо модальне вікно
      setIsModalOpen(false);
      setSelectedNote(null);
      
      console.log('Нотатка успішно збережена');
    } catch (error) {
      console.error('Помилка збереження нотатки:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredNotes = notes.filter(note => {
    const sourceType = note.source_type || note.sourceType;
    
    if (filters.sourceType && sourceType !== filters.sourceType) return false;
    return true;
  });

  // Розділяємо нотатки на Notes і Mistakes
  const noteItems = filteredNotes.filter(note => 
    note.tag_name === 'Note' || (!note.tag_name && !note.tag_id)
  );
  
  const mistakeItems = filteredNotes.filter(note => 
    note.tag_name === 'Mistake'
  );

  return (
    <NotesContainer>
      <Header>
        <BackButton to="/learning-section" title="Back" aria-label="Back" />
        <Title>Notes and Mistakes</Title>
        <Subtitle>Let's review your notes!</Subtitle>
      </Header>

      <HeaderActionsContainer>
        <ActionButtonsWrapper>
          <ActionButton style={{right: '150px'}}
            data-filter-toggle="true"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </ActionButton>
          {selectedNotes.length > 0 && (
            <ActionButton style={{right: '150px'}} variant="delete" onClick={handleDeleteSelected}>
              Delete Selected ({selectedNotes.length})
            </ActionButton>
          )}
        </ActionButtonsWrapper>
        
        <FiltersDropdown show={showFilters} ref={filtersRef}>
          <FilterGroup>
            <FilterLabel>Source Type</FilterLabel>
            <Select
              value={filters.sourceType}
              onChange={(e) => handleFilterChange('sourceType', e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="presession">Pre-Session</option>
              <option value="trade">Trade</option>
            </Select>
          </FilterGroup>
        </FiltersDropdown>
      </HeaderActionsContainer>

      <MainContent>
        <Content>
          <NotesBlock>
            <BlockTitle>Notes</BlockTitle>
            <NotesContent>
              <NotesList>
                {noteItems.length > 0 ? (
                  noteItems.map(note => (
                    <NoteCard key={note.id}>
                      <Checkbox
                        type="checkbox"
                        checked={selectedNotes.includes(note.id)}
                        onChange={() => handleNoteSelect(note.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <NoteContent onClick={() => handleNoteClick(note)}>
                        <NoteHeader>
                          <NoteTitle>{note.title}</NoteTitle>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {note.tag_name && (
                              <TagBadge type={note.tag_name}>{note.tag_name}</TagBadge>
                            )}
                            <TradeLink onClick={(e) => handleSourceClick(e, note.source_type || note.sourceType, note.source_id || note.sourceId)}>
                              {getSourceText(note)}
                            </TradeLink>
                          </div>
                        </NoteHeader>
                        <NoteText>{note.content}</NoteText>
                      </NoteContent>
                    </NoteCard>
                  ))
                ) : (
                  <NoNotesMessage>
                    No notes available. Add notes from Pre-Session Analysis or Trade pages.
                  </NoNotesMessage>
                )}
              </NotesList>
            </NotesContent>
          </NotesBlock>
          
          <MistakesBlock>
            <BlockTitle type="mistakes">Mistakes</BlockTitle>
            <NotesContent type="mistakes">
              <NotesList>
                {mistakeItems.length > 0 ? (
                  mistakeItems.map(note => (
                    <NoteCard key={note.id}>
                      <Checkbox
                        type="checkbox"
                        checked={selectedNotes.includes(note.id)}
                        onChange={() => handleNoteSelect(note.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <NoteContent onClick={() => handleNoteClick(note)}>
                        <NoteHeader>
                          <NoteTitle>{note.title}</NoteTitle>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {note.tag_name && (
                              <TagBadge type={note.tag_name}>{note.tag_name}</TagBadge>
                            )}
                            <TradeLink onClick={(e) => handleSourceClick(e, note.source_type || note.sourceType, note.source_id || note.sourceId)}>
                              {getSourceText(note)}
                            </TradeLink>
                          </div>
                        </NoteHeader>
                        <NoteText>{note.content}</NoteText>
                      </NoteContent>
                    </NoteCard>
                  ))
                ) : (
                  <NoNotesMessage>
                    No mistakes recorded. Add mistakes from Pre-Session Analysis or Trade pages.
                  </NoNotesMessage>
                )}
              </NotesList>
            </NotesContent>
          </MistakesBlock>
        </Content>
      </MainContent>

      {isModalOpen && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNote(null);
          }}
          onSave={handleSaveNote}
          note={selectedNote}
        />
      )}
    </NotesContainer>
  );
}

export default Notes;