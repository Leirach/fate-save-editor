import { BasicStatKeys, type BasicStats } from '@/models/BasicStats.model';
import type { ICharacter } from '@/models/Character.model';
import { LvlStatKeys, type LvlStats } from '@/models/LvlStats.model';
import { SkillSetKeys, type SkillSet } from '@/models/SkillSet.model';
import axios from 'axios';


export interface ModifyRequest {
    name?: string,
    basic?: Partial<BasicStats>,
    skills?: Partial<SkillSet>,
    stats?: Partial<LvlStats>,
    buffer: string
}

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

    async modifyCharacter() {
        let updateData: ModifyRequest = {
            buffer: this.originalData.buffer
        }

        if (this.originalData.name !== this.characterData.name) {
            updateData.name = this.characterData.name;
        }

        for (let key of SkillSetKeys) {
            if (this.originalData[key] !== this.characterData[key]) {
                if (!updateData.skills) {
                    updateData.skills = {}
                }
                updateData.skills[key] = this.characterData[key];
            }
        }

        for (let key of LvlStatKeys) {
            if (this.originalData[key] !== this.characterData[key]) {
                if (!updateData.stats) {
                    updateData.stats = {}
                }
                updateData.stats[key] = this.characterData[key];
            }
        }

        for (let key of BasicStatKeys) {
            if (this.originalData[key] !== this.characterData[key]) {
                if (!updateData.basic) {
                    updateData.basic = {}
                }
                updateData.basic[key] = this.characterData[key];
            }
        }

        const res = await axios.post(this.API_URL + '/savefile/modify', updateData, {
            headers: { "Content-Type": "application/json" },
            responseType: 'blob'
        });

        console.log(res);
        return res.data;
    }
}