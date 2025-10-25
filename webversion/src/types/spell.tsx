interface Spell {
    id: string;
    name: string;
    escola: string;
    execucao: string;
    alcance: string;
    area?: string;
    alvo?: string;
    efeito?: string;
    duracao: string;
    resistencia: string;
    aprimoramentos: Aprimoramento[];
    fonte?: string;
}

interface Aprimoramento {
    id: string;
    custoAdicionalPM: number;
    reaplicavel: boolean;
    descricao: string;
    aplicacoes: number;
}

export type { Spell, Aprimoramento };