import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import Modal from '../../components/modal/modal';
import NoteForm from '../../components/modal/forms/NoteForm';
import type { NoteFormData } from '../../components/modal/forms/NoteForm';
import { useCharacter } from '../../contexts/CharacterContext';
import type { Note } from '../../types/note';
import './notes.css';

const Notes = () => {
  const { character, addNote, updateNote, deleteNote } = useCharacter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [collapsedNotes, setCollapsedNotes] = useState<Set<string>>(new Set());

  // Inicializar todas as anotações como colapsadas
  useEffect(() => {
    if (character?.notes) {
      setCollapsedNotes(new Set(character.notes.map(note => note.id)));
    }
  }, [character?.notes?.length]); // Só atualiza quando o número de notas muda

  const handleOpenModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleSubmitNote = async (data: NoteFormData) => {
    try {
      if (editingNote) {
        // Update existing note
        await updateNote(editingNote.id, data);
      } else {
        // Add new note
        await addNote(data);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar anotação:', err);
      alert('Erro ao salvar anotação. Tente novamente.');
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta anotação?')) {
      try {
        await deleteNote(noteId);
      } catch (err) {
        console.error('Erro ao deletar anotação:', err);
        alert('Erro ao deletar anotação. Tente novamente.');
      }
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      await updateNote(note.id, { isPinned: !note.isPinned });
    } catch (err) {
      console.error('Erro ao fixar/desafixar anotação:', err);
      alert('Erro ao atualizar anotação. Tente novamente.');
    }
  };

  const handleToggleCollapse = (noteId: string) => {
    setCollapsedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const getCategoryLabel = (category?: string) => {
    const labels: { [key: string]: string } = {
      Quest: '🎯 Missão',
      NPC: '👤 Personagem',
      Location: '📍 Localização',
      Lore: '📚 História',
      Combat: '⚔️ Combate',
      General: '📝 Geral',
    };
    return category ? labels[category] || category : '';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Separate pinned and unpinned notes
  const pinnedNotes = character?.notes?.filter(note => note.isPinned) || [];
  const unpinnedNotes = character?.notes?.filter(note => !note.isPinned) || [];

  return (
    <div className="with-navbar">
      <Navbar showBackButton={true} />
      <div className="notes-container">
        <div className="notes-content">
          <div className="notes-header">
            <div>
              <h1 className="notes-title">Anotações</h1>
              <p className="notes-subtitle">Registre informações importantes sobre sua aventura</p>
            </div>
            <button className="btn-add-note" onClick={handleOpenModal}>
              ➕ Nova Anotação
            </button>
          </div>

          {/* Lista de anotações */}
          <div className="notes-list">
            {/* Anotações fixadas */}
            {pinnedNotes.length > 0 && (
              <>
                <h2 className="notes-section-title">📌 Anotações Fixadas</h2>
                {pinnedNotes.map((note) => {
                  const isCollapsed = collapsedNotes.has(note.id);
                  const displayTitle = note.title || (isCollapsed ? note.content.slice(0, 60) + (note.content.length > 60 ? '...' : '') : '');
                  
                  return (
                    <div 
                      key={note.id} 
                      className={`note-card pinned ${isCollapsed ? 'collapsed' : ''}`}
                      onClick={isCollapsed ? () => handleToggleCollapse(note.id) : undefined}
                      style={isCollapsed ? { cursor: 'pointer' } : undefined}
                    >
                      <div className="note-card-header">
                        <div className="note-card-title-container">
                          {displayTitle && (
                            <h3 className={`note-card-title ${!note.title && isCollapsed ? 'note-preview' : ''}`}>
                              {displayTitle}
                            </h3>
                          )}
                          {!isCollapsed && note.category && (
                            <span className={`note-category category-${note.category.toLowerCase()}`}>
                              {getCategoryLabel(note.category)}
                            </span>
                          )}
                        </div>
                        <button
                          className="btn-icon btn-collapse"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCollapse(note.id);
                          }}
                          title={isCollapsed ? "Expandir" : "Recolher"}
                        >
                          {isCollapsed ? "▶️" : "🔽"}
                        </button>
                        {!isCollapsed && (
                          <div className="note-card-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn-icon pin-active"
                              onClick={() => handleTogglePin(note)}
                              title="Desafixar"
                            >
                              📌
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleEditNote(note)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteNote(note.id)}
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>

                      {!isCollapsed && (
                        <>
                          <div className="note-card-content">
                            {note.content}
                          </div>

                          {note.tags && note.tags.length > 0 && (
                            <div className="note-card-tags">
                              {note.tags.map((tag, index) => (
                                <span key={index} className="note-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="note-card-footer">
                            <span className="note-date">
                              Atualizada: {formatDate(note.updatedAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* Anotações não fixadas */}
            {unpinnedNotes.length > 0 && (
              <>
                {pinnedNotes.length > 0 && <h2 className="notes-section-title">📝 Outras Anotações</h2>}
                {unpinnedNotes.map((note) => {
                  const isCollapsed = collapsedNotes.has(note.id);
                  const displayTitle = note.title || (isCollapsed ? note.content.slice(0, 60) + (note.content.length > 60 ? '...' : '') : '');
                  
                  return (
                    <div 
                      key={note.id} 
                      className={`note-card ${isCollapsed ? 'collapsed' : ''}`}
                      onClick={isCollapsed ? () => handleToggleCollapse(note.id) : undefined}
                      style={isCollapsed ? { cursor: 'pointer' } : undefined}
                    >
                      <div className="note-card-header">
                        <div className="note-card-title-container">
                          {displayTitle && (
                            <h3 className={`note-card-title ${!note.title && isCollapsed ? 'note-preview' : ''}`}>
                              {displayTitle}
                            </h3>
                          )}
                          {!isCollapsed && note.category && (
                            <span className={`note-category category-${note.category.toLowerCase()}`}>
                              {getCategoryLabel(note.category)}
                            </span>
                          )}
                        </div>
                        <button
                          className="btn-icon btn-collapse"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCollapse(note.id);
                          }}
                          title={isCollapsed ? "Expandir" : "Recolher"}
                        >
                          {isCollapsed ? "▶️" : "🔽"}
                        </button>
                        {!isCollapsed && (
                          <div className="note-card-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn-icon"
                              onClick={() => handleTogglePin(note)}
                              title="Fixar"
                            >
                              📍
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleEditNote(note)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteNote(note.id)}
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>

                      {!isCollapsed && (
                        <>
                          <div className="note-card-content">
                            {note.content}
                          </div>

                          {note.tags && note.tags.length > 0 && (
                            <div className="note-card-tags">
                              {note.tags.map((tag, index) => (
                                <span key={index} className="note-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="note-card-footer">
                            <span className="note-date">
                              Atualizada: {formatDate(note.updatedAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* Estado vazio */}
            {!character?.notes || character.notes.length === 0 && (
              <div className="notes-empty-state">
                <p className="notes-empty-icon">📝</p>
                <p className="notes-empty-title">Nenhuma anotação ainda</p>
                <p className="notes-empty-text">
                  Comece a registrar informações importantes sobre sua aventura!
                </p>
                <button className="btn-add-note" onClick={handleOpenModal}>
                  ➕ Criar primeira anotação
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para adicionar/editar anotação */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'Editar Anotação' : 'Nova Anotação'}
        size="medium"
      >
        <NoteForm
          onSubmit={handleSubmitNote}
          onCancel={handleCloseModal}
          initialData={editingNote ? {
            title: editingNote.title,
            content: editingNote.content,
            category: editingNote.category,
            tags: editingNote.tags,
            is_pinned: editingNote.isPinned,
          } : undefined}
        />
      </Modal>
    </div>
  );
};

export default Notes;
