<template>
    <v-form>
        <v-text-field label="Level" v-model="character.level" number></v-text-field>
        <v-row>
            <v-col cols="12" md="6">
                Character Stats
                <v-text-field label="strength" v-model="character.strength"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                Skills
                <p v-if="character.unusedSkillPoints > 0">(unused: {{ character.unusedSkillPoints }})</p>
                <template v-for="skill in skillKeys">
                    <v-text-field class="dense" :label="skill.substring(5)" v-model="character[skill]" density="compact"
                        hide-details="auto" type="number" :id="skill" @input="skillChange"></v-text-field>
                </template>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">
import type { ICharacter } from '@/models/Character.model';
import { SkillSetKeys, type SkillSet } from '@/models/SkillSet.model';
import { CharacterApiService } from '@/services/Character.service';
import { defineComponent } from 'vue'

export default defineComponent({
    methods: {
        skillChange: function (event: any) {
            const key = event.target.id as keyof SkillSet;
            this.character.unusedSkillPoints = 0;
            let a = this.original[key];
            console.log(this.character.unusedSkillPoints)
        }
    },
    data: function () {
        return {
            original: CharacterApiService.getInstance().originalData,
            character: CharacterApiService.getInstance().characterData,
            skillKeys: SkillSetKeys
        };
    },
})
</script>

<style>
.dense input {
    margin-bottom: 5px;
}
</style>