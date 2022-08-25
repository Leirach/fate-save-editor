import fs from 'fs/promises'
import { Character } from './Character';
import { GameVersion } from './GameVersion';

async function readData(path: string) {
    const buff = await fs.readFile(path);
    const character = new Character(buff, GameVersion.FATE_TRAITOR_SOUL);
    console.log(character)

    character.updateSkills({skillCriticalStrike: 64});
    character.updateName("Guille");
    character.updateStats({strength: 99, dexterity: 99})
    character.update({
        name: "Guille2",
        skills: { skillCriticalStrike: 80 },
        stats: { strength: 80, dexterity: 110 },
        basic: { gold: 100000000 }
    })
    console.log(character)

    await fs.writeFile('modified.FFD', character.getNewBuffer());

    const newchar = new Character(await fs.readFile('modified.FFD'), GameVersion.FATE_TRAITOR_SOUL)
    console.log("new", newchar)
}

readData('../../assets/FTT.FFD');
readData('../../assets/0.FFD.old');
