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

export const BasicStatKeys: (keyof BasicStats)[] = [
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
    "walkingSpeed",
    "runningSpeed",
    "gold"
];
