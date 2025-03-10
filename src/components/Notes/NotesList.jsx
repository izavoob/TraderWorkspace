import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import NoteModal from './NoteModal.jsx';

// Додаємо анімацію fadeIn
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

const NotificationMessage = styled.div`
  position: fixed;
  top: 140px;
  right: 20px;
  left: auto;
  transform: none;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease;
  background: ${props => props.type === 'success' ? '#4caf50' : props.type === 'warning' ? '#ff9800' : '#f44336'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 300px;
  pointer-events: none;

  &::before {
    content: ${props => props.type === 'success' ? '"✓"' : '"!"'};
    font-size: 18px;
    font-weight: bold;
  }

  ${props => props.type === 'warning' && css`
    @keyframes pulse {
      0% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.02); }
      100% { transform: translateX(-50%) scale(1); }
    }
    animation: pulse 2s infinite;
  `}
`;

const NotesSection = styled.div`
  
  background: #2e2e2e;
  border-radius: 15px;
  
`;

const SectionTitle = styled.h3`
  color: rgb(92, 157, 245);
  margin: 0 0 20px;
  font-size: 1.5em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NoteItem = styled.div`
  position: relative;
  background: rgba(94, 44, 165, 0.1);
  border: 2px solid #5e2ca5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  


  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
    
    .delete-button {
      opacity: 1;
    }
  }
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
  z-index: 1;

  &:hover {
    background: rgba(244, 67, 54, 0.8);
    transform: scale(1.1);
  }

  &::before {
    content: '×';
    color: white;
    font-size: 18px;
  }
`;

const NoteTitle = styled.h4`
  color: #fff;
  margin: 0;
  font-size: 1.1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TagBadge = styled.span`
  background: ${props => props.type === 'Mistake' ? '#f44336' : '#4caf50'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: normal;
`;

const AddNoteButton = styled.button`
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

const NotesListComponent = ({ sourceType, sourceId, onAddNote, isEditing = true }) => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, [sourceType, sourceId]);

  const loadNotes = async () => {
    try {
      const notes = await window.electronAPI.getNotesBySource(sourceType, sourceId);
      setNotes(notes || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleAddNote = () => {
    console.log('Add note button clicked');
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleNoteClick = (note) => {
    console.log('Note clicked:', note);
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSave = async (noteData) => {
    try {
      console.log('Saving note:', noteData);
      
      if (noteData.id) {
        // Оновлюємо існуючу нотатку
        console.log('Updating existing note:', noteData);
        await window.electronAPI.updateNote({
          id: noteData.id,
          title: noteData.title,
          content: noteData.content,
          tagId: noteData.tagId
        });
        
        // Зберігаємо нові зображення
        if (noteData.images) {
          for (const image of noteData.images) {
            if (!image.id) {
              await window.electronAPI.addNoteImage(noteData.id, image.image_path);
            }
          }
        }
      } else {
        // Створюємо нову нотатку
        console.log('Creating new note:', noteData);
        const newNoteId = await window.electronAPI.saveNote({
          title: noteData.title,
          content: noteData.content,
          tagId: noteData.tagId,
          sourceType: sourceType,
          sourceId: sourceId
        });
        
        // Зберігаємо зображення для нової нотатки
        if (noteData.images) {
          for (const image of noteData.images) {
            if (!image.id) {
              await window.electronAPI.addNoteImage(newNoteId, image.image_path);
            }
          }
        }
      }
      
      // Оновлюємо список нотаток
      await loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async (noteId, e) => {
    e.stopPropagation();
    console.log('Delete note button clicked for ID:', noteId);
    
    if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
      try {
        console.log('Deleting note with ID:', noteId);
        await window.electronAPI.deleteNote(noteId);
        console.log('Note deleted successfully');
        // Оновлюємо список нотаток
        await loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
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

  return (
    <NotesSection>
      {isEditing && (
        <AddNoteButton onClick={handleAddNote} type="button">
          <AddIcon>+</AddIcon>
          <AddText>Add Note or Mistake</AddText>
        </AddNoteButton>
      )}

      <NotesList>
        {notes.map((note, index) => (
          <NoteItem 
            key={note.id || index} 
            onClick={() => isEditing ? handleNoteClick(note) : null}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            {isEditing && (
              <DeleteButton 
                className="delete-button"
                onClick={(e) => handleDelete(note.id, e)}
                type="button"
              />
            )}
            <NoteTitle>
              {note.title}
              {note.tag_name && (
                <TagBadge type={note.tag_name}>{note.tag_name}</TagBadge>
              )}
            </NoteTitle>
            <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>
              {note.content}
            </div>
          </NoteItem>
        ))}
      </NotesList>

      {isEditing && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          note={selectedNote}
          sourceType={sourceType}
          sourceId={sourceId}
        />
      )}
    </NotesSection>
  );
};

export default NotesListComponent; 