export interface BasicStats {
    level: number;
    experience: number;
    hp: number;
    maxHp: number;
    fame: number;
    fameRank: number;
    stamina: number;
    maxStamina: number;
    mana: number;
    maxMana: number;
    toHitBonus: number;
    originalToHitBonus: number;
    naturalArmor: number;
    originalNaturalArmor: number;
    experienceAward: number;
    fameAward: number;
    unusedStatPoints: number;
    unusedSkillPoints: number;
    walkingSpeed: number;
    runningSpeed: number;
    gold: number;
}

export enum DataType {
    int32 = 0,
    float
}

export type OffsetTypeMap = {[key in keyof Partial<BasicStats>]: DataType};

// data types map in order for stats after "level"
export const BasicStatsDataType: OffsetTypeMap = {
    "level": DataType.int32,
    "experience": DataType.int32,
    "maxHp": DataType.int32,
    "fame": DataType.int32,
    "fameRank": DataType.int32,
    "maxStamina": DataType.int32,
    "maxMana": DataType.int32,
    "toHitBonus": DataType.int32,
    "originalToHitBonus": DataType.int32,
    "naturalArmor": DataType.int32,
    "originalNaturalArmor": DataType.int32,
    "experienceAward": DataType.int32,
    "fameAward": DataType.int32,
    "unusedStatPoints": DataType.int32,
    "unusedSkillPoints": DataType.int32,
    "hp": DataType.float,
    "stamina": DataType.float,
    "mana": DataType.float,
    "walkingSpeed": DataType.float,
    "runningSpeed": DataType.float,
    "gold": DataType.int32
}

export const FirstChunkKeys: (keyof BasicStats)[] = [
    "level",
    "experience",
    "maxHp",
    "fame",
    "fameRank",
    "maxStamina",
    "maxMana",
    "toHitBonus",
    "originalToHitBonus",
    "naturalArmor",
    "originalNaturalArmor",
    "experienceAward",
    "fameAward",
    "unusedStatPoints",
    "unusedSkillPoints",
    "hp",
    "stamina",
    "mana"
];

export const SecondChunkKeys: (keyof BasicStats)[] = [
    "walkingSpeed",
    "runningSpeed",
    "gold"
];

