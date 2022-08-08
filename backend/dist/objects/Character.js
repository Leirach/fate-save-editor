"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const SkillSet_1 = require("./SkillSet");
const SpellList_1 = require("./SpellList");
const CharacterStats_1 = require("./CharacterStats");
const SPELL_SLOTS = 6;
const PLAYER_STRING_BUFFER = Buffer.from("PLAYER", "utf-8");
class Character {
    constructor(buff) {
        this.skills = {
            skillSword: 0,
            skillClub: 0,
            skillHammer: 0,
            skillAxe: 0,
            skillSpear: 0,
            skillStaff: 0,
            skillPolearm: 0,
            skillBow: 0,
            skillCriticalStrike: 0,
            skillSpellcasting: 0,
            skillDualWield: 0,
            skillShield: 0,
            skillAttackMagic: 0,
            skillDefenseMagic: 0,
            skillCharmMagic: 0
        };
        this.spells = {
            attack: [],
            defense: [],
            charm: []
        };
        this.stats = {
            strength: { offset: 0, value: 0 },
            originalStrength: { offset: 0, value: 0 },
            dexterity: { offset: 0, value: 0 },
            originalDexterity: { offset: 0, value: 0 },
            vitality: { offset: 0, value: 0 },
            originalVitality: { offset: 0, value: 0 },
            magic: { offset: 0, value: 0 },
            originalMagic: { offset: 0, value: 0 }
        };
        let stringSize;
        this.originalBuffer = buff.subarray(0, buff.length);
        this.modifiedBuffer = buff.subarray(0, buff.length);
        // initial offset
        let offset = buff.indexOf(PLAYER_STRING_BUFFER) + PLAYER_STRING_BUFFER.length;
        // TODO read this stuff
        offset += 107; // 107 bytes of player stats (time played, times gambled etc)
        // namestart = offset
        // skip player name
        stringSize = buff.readInt16LE(offset);
        offset += 2 + stringSize;
        const nameOffset = offset;
        this.name = buff.subarray(offset - stringSize, offset).toString();
        // skip ancestor name
        const ancestorNameSize = buff.readInt16LE(offset);
        offset += 2 + ancestorNameSize;
        offset += 118;
        const levelOffset = offset;
        this.offsets = new CharacterBufferOffsets(nameOffset, levelOffset);
        // juicy stuff starts
        this.level = buff.readInt32LE(offset);
        this.experience = buff.readInt32LE(offset);
        this.hp = buff.readFloatLE(offset);
        this.maxHp = buff.readInt32LE(offset);
        this.fame = buff.readInt32LE(offset);
        this.fameRank = buff.readInt32LE(offset);
        this.stamina = buff.readFloatLE(offset);
        this.maxStamina = buff.readInt32LE(offset);
        this.mana = buff.readFloatLE(offset);
        this.maxMana = buff.readInt32LE(offset);
        this.toHitBonus = buff.readInt32LE(offset);
        this.originalToHitBonus = buff.readInt32LE(offset);
        this.naturalArmor = buff.readInt32LE(offset);
        this.originalNaturalArmor = buff.readInt32LE(offset);
        this.experienceAward = buff.readInt32LE(offset);
        this.fameAward = buff.readInt32LE(offset);
        this.unusedStatPoints = buff.readInt32LE(offset);
        this.unusedSkillPoints = buff.readInt32LE(offset);
        this.unique = buff.at(offset) > 0;
        offset += 32; // skip all damage resistances
        // skills
        for (let key of SkillSet_1.SkillSetKeys) {
            let val = buff.readInt32LE(offset);
            this.skills[key] = val;
            offset += 4;
        }
        // spells
        for (let type of SpellList_1.SpellListKeys) {
            for (let j = 0; j < SPELL_SLOTS; j++) {
                stringSize = buff.readInt16LE(offset);
                offset += 2 + stringSize;
                if (stringSize > 0) {
                    let spellName = buff.subarray(offset - stringSize, offset).toString();
                    this.spells[type].push({ offset: offset - stringSize, value: spellName });
                }
            }
        }
        stringSize = buff.readInt16LE(offset);
        offset += 2 + stringSize;
        if (stringSize > 0) {
            this.activeSpell = {
                offset: offset - stringSize,
                value: buff.subarray(offset - stringSize, offset).toString()
            };
        }
        // stats
        for (let key of CharacterStats_1.CharacterStatsKeys) {
            this.stats[key] = { offset: offset - stringSize, value: buff.readInt32LE(offset) };
            offset += 4;
        }
    }
    updateSkills(newSkills) {
        // need i for calculating skill offset
        for (let i = 0; i < SkillSet_1.SkillSetKeys.length; i++) {
            const key = SkillSet_1.SkillSetKeys[i];
            if (newSkills[key]) {
                this.skills[key] = newSkills[key];
                this.modifiedBuffer.writeUint32LE(this.skills[key], this.offsets.skills + 4 * i);
            }
        }
    }
    // RUN LAST WILL FUCK UP EVERY OTHER OFFSET WHEN NAME LENGHT CHANGES
    updateName(name) {
        this.name;
    }
    getNewBuffer() {
        return this.modifiedBuffer;
    }
}
exports.Character = Character;
