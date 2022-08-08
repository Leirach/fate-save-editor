import { BasicStats } from "./BasicStats";
import { LvlStats, LvlStatKeys } from "./LvlStats";
import { SpellListKeys } from "./SpellList";

// all these offsets are relative to level
const levelOffsetRelative: (keyof BufferOffsets)[] = [
    "level", // 0 + level
    "experience", // 4 + level
    "hp", // etc
    "maxHp",
    "fame",
    "fameRank",
    "stamina",
    "maxStamina",
    "mana",
    "maxMana",
    "toHitBonus",
    "originalToHitBonus",
    "naturalArmor",
    "originalNaturalArmor",
    "experienceAward",
    "fameAward",
    "unusedStatPoints",
    "unusedSkillPoints",
    "skills",
    "spellStart"
];

// these implemented interfaces only work because basicstats and lvlstats are all NUMBERS and
// offsets are also all NUMBERS if at any point basicstats or lvlstats store something
// other than a number I might have to make another interface with weirdo double types
// or templating
export class BufferOffsets implements BasicStats, LvlStats {
    name: number = 0;
    // level relative offsets - aka BasicStats
    level = 0; // 0 + level
    experience = 4; // 4 + level
    hp = 8; // etc
    maxHp = 12;
    fame = 16;
    fameRank = 20;
    stamina = 24;
    maxStamina = 28;
    mana = 32;
    maxMana = 36;
    toHitBonus = 40;
    originalToHitBonus = 44;
    naturalArmor = 48;
    originalNaturalArmor = 52;
    experienceAward = 56;
    fameAward = 60;
    unusedStatPoints = 64;
    unusedSkillPoints = 68;

    // not in basicstats
    skills: number = 105; // skips some rubbish
    // resistances should be here (?)
    spellStart: number = 165; // skips resistances

    // bunch of variable offsets
    spells: { [key: string]: number[] } = {
        attack: [],
        defense: [],
        charm: []
    }

    activeSpell?: number;

    // offsets relative to where spells end
    strength = 0;
    dexterity = 8;
    vitality = 16;
    magic = 24;

    // basic stats part 2
    walkingSpeed = 32;
    runningSpeed = 36;
    gold = 40;

    constructor(nameOffset: number, levelOffset: number) {
        this.name = nameOffset;

        for (let key of levelOffsetRelative) {
            (this[key] as number) += levelOffset;
        }
    }

    // update stats start offset and subsequent offsets
    updateStats(statsOffset: number) {
        for (let key of LvlStatKeys) {
            this[key] += statsOffset;
        }

        this.walkingSpeed += statsOffset;
        this.runningSpeed += statsOffset;
        this.gold += statsOffset;
    }

    // update spells to new offset
    updateSpells(offset: number) {
        for (let type of SpellListKeys) {
            this.spells[type] = this.spells[type].map(e => e += offset);
        }
    }

    updateOffsets(difference: number) {
        for (let key of levelOffsetRelative) {
            (this[key] as number) += difference;
        }

        this.updateSpells(difference);

        if (this.activeSpell) this.activeSpell += difference;

        this.updateStats(difference);
    }

}
