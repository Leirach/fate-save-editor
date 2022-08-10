"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const SkillSet_1 = require("./SkillSet");
const SpellList_1 = require("./SpellList");
const LvlStats_1 = require("./LvlStats");
const BufferHelpers_1 = require("./BufferHelpers");
const BasicStats_1 = require("./BasicStats");
const SPELL_SLOTS = 6;
const PLAYER_STRING_BUFFER = Buffer.from("PLAYER", "utf-8");
class Character {
    constructor(buff) {
        // BasicStats
        this.level = 0;
        this.experience = 0;
        this.hp = 0;
        this.maxHp = 0;
        this.fame = 0;
        this.fameRank = 0;
        this.stamina = 0;
        this.maxStamina = 0;
        this.mana = 0;
        this.maxMana = 0;
        this.toHitBonus = 0;
        this.originalToHitBonus = 0;
        this.naturalArmor = 0;
        this.originalNaturalArmor = 0;
        this.experienceAward = 0;
        this.fameAward = 0;
        this.unusedStatPoints = 0;
        this.unusedSkillPoints = 0;
        // SkillSet
        this.skillSword = 0;
        this.skillClub = 0;
        this.skillHammer = 0;
        this.skillAxe = 0;
        this.skillSpear = 0;
        this.skillStaff = 0;
        this.skillPolearm = 0;
        this.skillBow = 0;
        this.skillCriticalStrike = 0;
        this.skillSpellcasting = 0;
        this.skillDualWield = 0;
        this.skillShield = 0;
        this.skillAttackMagic = 0;
        this.skillDefenseMagic = 0;
        this.skillCharmMagic = 0;
        // spells
        this.spells = {
            attack: [],
            defense: [],
            charm: []
        };
        // LvlStats
        this.strength = 0;
        this.dexterity = 0;
        this.vitality = 0;
        this.magic = 0;
        let stringSize;
        this.buffer = buff.subarray(0, buff.length);
        // initial offset
        let offset = buff.indexOf(PLAYER_STRING_BUFFER) + PLAYER_STRING_BUFFER.length;
        // TODO read this stuff
        offset += 107; // 107 bytes of player stats (time played, times gambled etc)
        // player name
        stringSize = buff.readInt16LE(offset);
        offset += 2;
        const nameOffset = offset;
        this.name = buff.subarray(offset, offset + stringSize).toString();
        offset += stringSize;
        // skip ancestor name
        const ancestorNameSize = buff.readInt16LE(offset);
        offset += 2 + ancestorNameSize;
        offset += 118;
        const levelOffset = offset;
        this.offsets = new BufferHelpers_1.BufferOffsets(nameOffset, levelOffset);
        // read from level to mana
        this.readBufferMap(BasicStats_1.FirstChunkKeys);
        // skills
        for (let i = 0; i < SkillSet_1.SkillSetKeys.length; i++) {
            const key = SkillSet_1.SkillSetKeys[i];
            let val = buff.readInt32LE(this.offsets.skills + i * 4);
            this[key] = val;
        }
        // spells - variable offset
        offset = this.offsets.spellStart; // update offset
        for (let type of SpellList_1.SpellListKeys) {
            for (let j = 0; j < SPELL_SLOTS; j++) {
                stringSize = buff.readInt16LE(offset);
                this.offsets.spells[type].push(offset + 2);
                offset += 2 + stringSize;
                if (stringSize > 0) {
                    this.spells[type].push(buff.subarray(offset - stringSize, offset).toString());
                }
                else {
                    this.spells[type].push("");
                }
            }
        }
        stringSize = buff.readInt16LE(offset);
        offset += 2 + stringSize;
        if (stringSize > 0) {
            this.offsets.activeSpell = offset - stringSize;
            this.activeSpell = buff.subarray(offset - stringSize, offset).toString();
        }
        // stats
        this.offsets.updateStats(offset);
        for (let i = 0; i < LvlStats_1.LvlStatKeys.length; i++) {
            const key = LvlStats_1.LvlStatKeys[i];
            this[key] = buff.readInt32LE(this.offsets[key]);
        }
        // second chunk basic stats - read walkingspeed to gold
        this.readBufferMap(BasicStats_1.SecondChunkKeys);
    }
    // reads bytes from buffer based on type map and offset
    readBufferMap(keys) {
        let offset = 0;
        for (let key of keys) {
            if (BasicStats_1.BasicStatsDataType[key] == BasicStats_1.DataType.int32) {
                this[key] = this.buffer.readInt32LE(this.offsets[key]);
            }
            else { // float
                this[key] = this.buffer.readFloatLE(this.offsets[key]);
            }
            offset = this.offsets[key];
        }
        return offset;
    }
    update(data) {
        if (data.name)
            this.updateName(data.name);
        if (data.basic)
            this.updateBasicStats(data.basic);
        if (data.skills)
            this.updateSkills(data.skills);
        if (data.stats)
            this.updateStats(data.stats);
    }
    updateName(name) {
        //update buffer
        const prevChunk = this.buffer.subarray(0, this.offsets.name - 2);
        const nextChunk = this.buffer.subarray(this.offsets.name + this.name.length, this.buffer.length);
        let newNameBuffer = Buffer.alloc(2 + name.length);
        newNameBuffer.writeUint32LE(name.length); //write length
        newNameBuffer.write(name, 2, "utf-8"); // offset 2 bytes for length
        // concat everything
        this.buffer = Buffer.concat([prevChunk, newNameBuffer, nextChunk]);
        // get diff and update offsets
        const diff = name.length - this.name.length;
        this.offsets.updateOffsets(diff);
        // update name
        this.name = name;
    }
    updateBasicStats(newValues) {
        let key;
        for (key in newValues) {
            this[key] = newValues[key];
            if (BasicStats_1.BasicStatsDataType[key] == BasicStats_1.DataType.int32) {
                this.buffer.writeInt32LE(this[key], this.offsets[key]);
            }
            else { // float
                this.buffer.writeFloatLE(this[key], this.offsets[key]);
            }
        }
    }
    updateSkills(newSkills) {
        // need i for calculating skill offset
        for (let i = 0; i < SkillSet_1.SkillSetKeys.length; i++) {
            const key = SkillSet_1.SkillSetKeys[i];
            if (newSkills[key]) {
                this[key] = newSkills[key];
                this.buffer.writeInt32LE(this[key], this.offsets.skills + 4 * i);
            }
        }
    }
    updateStats(newStats) {
        for (let i = 0; i < LvlStats_1.LvlStatKeys.length; i++) {
            const key = LvlStats_1.LvlStatKeys[i];
            if (newStats[key]) {
                this[key] = newStats[key];
                this.buffer.writeInt32LE(this[key], this.offsets[key]);
            }
        }
    }
    toJson() {
        const serialize = JSON.parse(JSON.stringify(this));
        delete serialize.buffer;
        delete serialize.offsets;
        serialize.buffer = this.buffer.toString('base64');
        return serialize;
    }
    getNewBuffer() {
        return this.buffer;
    }
}
exports.Character = Character;
