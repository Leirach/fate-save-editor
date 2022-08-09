export interface LvlStats {
    strength: number,
    dexterity: number;
    vitality: number;
    magic: number;
}

export const LvlStatKeys: (keyof LvlStats)[] = [
    "strength",
    "dexterity",
    "vitality",
    "magic",
];
