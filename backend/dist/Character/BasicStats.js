"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondChunkKeys = exports.FirstChunkKeys = exports.BasicStatsDataType = exports.DataType = void 0;
var DataType;
(function (DataType) {
    DataType[DataType["int32"] = 0] = "int32";
    DataType[DataType["float"] = 1] = "float";
})(DataType = exports.DataType || (exports.DataType = {}));
// data types map in order for stats after "level"
exports.BasicStatsDataType = {
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
};
exports.FirstChunkKeys = [
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
exports.SecondChunkKeys = [
    "walkingSpeed",
    "runningSpeed",
    "gold"
];
