import type { BasicStats } from "./BasicStats.model";
import type { LvlStats } from "./LvlStats.model";
import type { SkillSet } from "./SkillSet.model";

export interface ICharacter extends BasicStats, SkillSet, LvlStats {
    spells: {
        attack: string[];
        defense: string[];
        charm: string[];
    };
    name: string;
    activeSpell: string;
    buffer: string;
}