import type { AttributeName } from './types';

interface Skill {
    name: string;
    attribute: AttributeName;
    isTrained: boolean;
    onlyTrained: boolean;
    armorPenalty: boolean;
    halfLevel: number;
    trainedBonus: number;
    others: number;
}

export type { Skill };