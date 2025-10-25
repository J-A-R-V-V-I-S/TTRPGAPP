// Notes and documentation types

interface Note {
    id: string;
    characterId: string;
    title?: string;
    content: string;
    category?: NoteCategory;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    isPinned?: boolean;
}

type NoteCategory =
    | 'Quest'
    | 'NPC'
    | 'Location'
    | 'Lore'
    | 'Combat'
    | 'General';

interface NoteFilter {
    category?: NoteCategory;
    tags?: string[];
    searchQuery?: string;
    isPinned?: boolean;
}

export type {
    Note,
    NoteCategory,
    NoteFilter,
};

