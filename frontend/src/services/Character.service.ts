import type { ICharacter } from '@/models/Character.model';
import axios from 'axios';

export class CharacterApiService {
    private static instance: CharacterApiService
    static getInstance() {
        if (!this.instance) {
            this.instance = new CharacterApiService();
        }

        return this.instance;
    }

    private API_URL = 'http://localhost:3000';

    originalData!: ICharacter;
    characterData!: ICharacter;

    async getCharacterData(buffer: Uint8Array) {
        const res = await axios.post(this.API_URL + '/savefile/parse', buffer, {
            headers: { "Content-Type": "application/octet-stream" }
        });

        this.characterData = res.data;

        // deep copy
        this.originalData = JSON.parse(JSON.stringify(this.characterData));

        console.log(this.characterData);
    }
}