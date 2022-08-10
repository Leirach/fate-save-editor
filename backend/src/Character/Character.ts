import { SkillSet, SkillSetKeys } from "./SkillSet";
import { SpellList, SpellListKeys } from "./SpellList";
import { LvlStats, LvlStatKeys } from "./LvlStats";
import { BufferOffsets, } from "./BufferHelpers";
import { BasicStats, BasicStatsDataType, DataType, FirstChunkKeys, SecondChunkKeys } from "./BasicStats";

const SPELL_SLOTS = 6 as const;
const PLAYER_STRING_BUFFER = Buffer.from("PLAYER", "utf-8");

export class Character implements BasicStats, LvlStats, SkillSet {
    private buffer: Buffer;
    private offsets: BufferOffsets;
    name: string;

    // BasicStats
    level = 0;
    experience = 0;
    hp = 0;
    maxHp = 0;
    fame = 0;
    fameRank = 0;
    stamina = 0;
    maxStamina = 0;
    mana = 0;
    maxMana = 0;
    toHitBonus = 0;
    originalToHitBonus = 0;
    naturalArmor = 0;
    originalNaturalArmor = 0;
    experienceAward = 0;
    fameAward = 0;
    unusedStatPoints = 0;
    unusedSkillPoints = 0

    // SkillSet
    skillSword = 0;
    skillClub = 0;
    skillHammer = 0;
    skillAxe = 0;
    skillSpear = 0;
    skillStaff = 0;
    skillPolearm = 0;
    skillBow = 0;
    skillCriticalStrike = 0;
    skillSpellcasting = 0;
    skillDualWield = 0;
    skillShield = 0;
    skillAttackMagic = 0;
    skillDefenseMagic = 0;
    skillCharmMagic = 0;

    // spells
    private spells: SpellList = {
        attack: [],
        defense: [],
        charm: []
    }

    private activeSpell?: string;

    // LvlStats
    strength = 0;
    dexterity = 0;
    vitality = 0;
    magic = 0;

    // Extra BasicStats
    walkingSpeed: number;
    runningSpeed: number;
    gold: number;

    constructor(buff: Buffer) {
        let stringSize: number;
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
        this.offsets = new BufferOffsets(nameOffset, levelOffset);

        // read from level to mana
        this.readBufferMap(FirstChunkKeys);

        // skills
        for (let i = 0; i < SkillSetKeys.length; i++) {
            const key = SkillSetKeys[i];
            let val = buff.readInt32LE(this.offsets.skills + i * 4);
            this[key] = val;
        }

        // spells - variable offset
        offset = this.offsets.spellStart; // update offset
        for (let type of SpellListKeys) {
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
        for (let i = 0; i < LvlStatKeys.length; i++) {
            const key = LvlStatKeys[i];
            this[key] = buff.readInt32LE(this.offsets[key]);
        }

        // second chunk basic stats - read walkingspeed to gold
        this.readBufferMap(SecondChunkKeys);
    }

    // reads bytes from buffer based on type map and offset
    readBufferMap(keys: (keyof BasicStats)[]) {
        let offset = 0;
        for (let key of keys) {
            if (BasicStatsDataType[key] == DataType.int32) {
                this[key] = this.buffer.readInt32LE(this.offsets[key]);
            }
            else { // float
                this[key] = this.buffer.readFloatLE(this.offsets[key]);
            }
            offset = this.offsets[key];
        }
        return offset;
    }

    update(data: { name?: string, basic?: Partial<BasicStats>, skills?: Partial<SkillSet>, stats?: Partial<LvlStats> }) {
        if (data.name)
            this.updateName(data.name);

        if (data.basic)
            this.updateBasicStats(data.basic);

        if (data.skills)
            this.updateSkills(data.skills);

        if (data.stats)
            this.updateStats(data.stats);
    }

    updateName(name: string) {
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

    updateBasicStats(newValues: Partial<BasicStats>) {
        let key: keyof BasicStats;
        for (key in newValues) {
            this[key] = newValues[key];
            if (BasicStatsDataType[key] == DataType.int32) {
                this.buffer.writeInt32LE(this[key], this.offsets[key]);
            }
            else { // float
                this.buffer.writeFloatLE(this[key], this.offsets[key]);
            }
        }
    }

    updateSkills(newSkills: Partial<SkillSet>) {
        // need i for calculating skill offset
        for (let i = 0; i < SkillSetKeys.length; i++) {
            const key = SkillSetKeys[i];
            if (newSkills[key] !== undefined) {
                this[key] = newSkills[key];
                this.buffer.writeInt32LE(this[key], this.offsets.skills + 4 * i);
            }
        }
    }

    updateStats(newStats: Partial<LvlStats>) {
        for (let i = 0; i < LvlStatKeys.length; i++) {
            const key = LvlStatKeys[i];
            if (newStats[key] !== undefined) {
                this[key] = newStats[key];
                this.buffer.writeInt32LE(this[key], this.offsets[key]);
            }
        }
    }

    toJson() {
        const serialize = JSON.parse(JSON.stringify(this));
        delete serialize.buffer
        delete serialize.offsets
        serialize.buffer = this.buffer.toString('base64');
        return serialize;
    }

    getNewBuffer() {
        return this.buffer;
    }

}
