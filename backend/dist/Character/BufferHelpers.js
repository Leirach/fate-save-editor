"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferOffsets = void 0;
const LvlStats_1 = require("./LvlStats");
const SpellList_1 = require("./SpellList");
// all these offsets are relative to level
const levelOffsetRelative = [
    "level",
    "experience",
    "hp",
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
class BufferOffsets {
    constructor(nameOffset, levelOffset) {
        this.name = 0;
        // level relative offsets - aka BasicStats
        this.level = 0; // 0 + level
        this.experience = 4; // 4 + level
        this.hp = 8; // etc
        this.maxHp = 12;
        this.fame = 16;
        this.fameRank = 20;
        this.stamina = 24;
        this.maxStamina = 28;
        this.mana = 32;
        this.maxMana = 36;
        this.toHitBonus = 40;
        this.originalToHitBonus = 44;
        this.naturalArmor = 48;
        this.originalNaturalArmor = 52;
        this.experienceAward = 56;
        this.fameAward = 60;
        this.unusedStatPoints = 64;
        this.unusedSkillPoints = 68;
        // not in basicstats
        this.skills = 105; // skips some rubbish
        // resistances should be here (?)
        this.spellStart = 165; // skips resistances
        // bunch of variable offsets
        this.spells = {
            attack: [],
            defense: [],
            charm: []
        };
        // offsets relative to where spells end
        this.strength = 0;
        this.dexterity = 8;
        this.vitality = 16;
        this.magic = 24;
        // basic stats part 2
        this.walkingSpeed = 32;
        this.runningSpeed = 36;
        this.gold = 40;
        this.name = nameOffset;
        for (let key of levelOffsetRelative) {
            this[key] += levelOffset;
        }
    }
    // update stats start offset and subsequent offsets
    updateStats(statsOffset) {
        for (let key of LvlStats_1.LvlStatKeys) {
            this[key] += statsOffset;
        }
        this.walkingSpeed += statsOffset;
        this.runningSpeed += statsOffset;
        this.gold += statsOffset;
    }
    // update spells to new offset
    updateSpells(offset) {
        for (let type of SpellList_1.SpellListKeys) {
            this.spells[type] = this.spells[type].map(e => e += offset);
        }
    }
    updateOffsets(difference) {
        for (let key of levelOffsetRelative) {
            this[key] += difference;
        }
        this.updateSpells(difference);
        if (this.activeSpell)
            this.activeSpell += difference;
        this.updateStats(difference);
    }
}
exports.BufferOffsets = BufferOffsets;
