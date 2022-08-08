import fs from 'fs/promises'
import { Character } from './Character';

async function readData(path: string) {
    const buff = await fs.readFile(path);
    const character = new Character(buff);
    console.log(character)

    // character.updateSkills({skillCriticalStrike: 64});
    // character.updateName("Guille");
    // character.updateStats({strength: 99, dexterity: 99})
    character.update({
        name: "Guille2",
        skills: { skillCriticalStrike: 80 },
        stats: { strength: 80, dexterity: 110 },
        basic: { gold: 100000000 }
    })
    // console.log(character)

    await fs.writeFile('modified.FFD', character.getNewBuffer());

    const newchar = new Character(await fs.readFile('modified.FFD'))
    console.log("new", newchar)
}

readData('./2.FFD');
