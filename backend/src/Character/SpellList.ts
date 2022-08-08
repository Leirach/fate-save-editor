export interface SpellList {
    attack: string[];
    defense: string[];
    charm: string[];
}

export const SpellListKeys: (keyof SpellList)[] = [
    "attack",
    "defense",
    "charm"
];
