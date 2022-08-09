import type { BasicStats } from "./BasicStats.model";
import type { SkillSet } from "./SkillSet.model";

export interface ICharacter extends BasicStats, SkillSet {
    spells: {
        attack: string[];
        defense: string[];
        charm: string[];
    };
    strength: number;
    dexterity: number;
    vitality: number;
    magic: number;
    name: string;
    activeSpell: string;
    buffer: string;
}