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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120;
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
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  margin: 20px;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 999;
`;

const Content = styled.div`
  padding: 0 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 200px);
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
  width: 100%;
  padding-bottom: 100px;
`;

const NoteCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;

const NoteContent = styled.div`
  background: rgba(116, 37, 201, 0.1);
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
    tagId: ''
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
      setNotes(allNotes);
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

  const handleNoteClick = (note) => {
    console.log('Клік на нотатці:', note);
    setSelectedNote(note);
    setIsModalOpen(true);
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
    const tagId = note.tag_id;
    
    if (filters.sourceType && sourceType !== filters.sourceType) return false;
    if (filters.tagId && tagId !== parseInt(filters.tagId)) return false;
    return true;
  });

  return (
    <NotesContainer>
      <Header>
        <BackButton to="/learning-section" title="Back" aria-label="Back" />
        <Title>Trade Notes</Title>
        <Subtitle>Let's review your notes!</Subtitle>
      </Header>

      <MainContent>
        <HeaderActions>
          <ActionButton 
            data-filter-toggle="true"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </ActionButton>
          {selectedNotes.length > 0 && (
            <ActionButton variant="delete" onClick={handleDeleteSelected}>
              Delete Selected ({selectedNotes.length})
            </ActionButton>
          )}
          
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
            
            <FilterGroup>
              <FilterLabel>Tag</FilterLabel>
              <Select
                value={filters.tagId}
                onChange={(e) => handleFilterChange('tagId', e.target.value)}
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersDropdown>
        </HeaderActions>

        <Content>
          <NotesList>
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
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