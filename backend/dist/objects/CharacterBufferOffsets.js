"use strict";
const constantOffsetKeys = [
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
    "unique",
    "skills",
    "spells"
];
class CharacterBufferOffsets {
    constructor(nameOffset, levelOffset) {
        // constant offsets
        this.level = 0;
        this.experience = 4;
        this.hp = 8;
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
        this.unique = 72;
        this.skills = 105;
        this.spells = 165;
        this._name = nameOffset;
        this.level = levelOffset;
        for (let key of constantOffsetKeys) {
            this[key] += this.level;
        }
    }
    set name(val) {
        const difference = Math.abs(this._name - val);
        this._name = val;
        this.updateOffsets(difference);
    }
    get name() { return this._name; }
    updateOffsets(difference) {
        this.level += difference;
        this.experience += difference;
        this.hp += difference;
        this.maxHp += difference;
        this.fame += difference;
        this.fameRank += difference;
        this.stamina += difference;
        this.maxStamina += difference;
        this.mana += difference;
        this.maxMana += difference;
        this.toHitBonus += difference;
        this.originalToHitBonus += difference;
        this.naturalArmor += difference;
        this.originalNaturalArmor += difference;
        this.experienceAward += difference;
        this.fameAward += difference;
        this.unusedStatPoints += difference;
        this.unusedSkillPoints += difference;
        this.unique += difference;
    }
    initOffsets() {
    }
}
