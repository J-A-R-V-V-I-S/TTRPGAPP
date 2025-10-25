interface CharacterAttributes {
    id: string;
    characterId: string;
    forca: number;
    destreza: number;
    constituicao: number;
    inteligencia: number;
    sabedoria: number;
    carisma: number;
    // Temporary modifiers (buffs/debuffs)
    forcaTempMod?: number;
    destrezaTempMod?: number;
    constituicaoTempMod?: number;
    inteligenciaTempMod?: number;
    sabedoriaTempMod?: number;
    carismaTempMod?: number;
}

export type { CharacterAttributes };