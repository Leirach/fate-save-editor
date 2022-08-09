<template>
    <v-form>
        <v-text-field label="Name" v-model="character.name"></v-text-field>
        <v-text-field label="Level" v-model="character.level" hide-details="auto" type="number"></v-text-field>
        <v-text-field label="Fame" v-model="character.fame" hide-details="auto" type="number"></v-text-field>
        <v-text-field label="Gold" v-model="character.gold" hide-details="auto" type="number"></v-text-field>
        <v-row>
            <v-col cols="12" md="6">
                Character Stats
                <template v-for="stat in statKeys">
                    <v-text-field :label="stat" v-model="character[stat]" type="number" :id="stat">
                    </v-text-field>
                </template>
            </v-col>
            <v-col cols="12" md="6">
                Skills
                <!-- v-if="character.unusedSkillPoints > 0" -->
                <span>(unused: {{ character.unusedSkillPoints }})</span>
                <template v-for="skill in skillKeys">
                    <v-text-field class="dense" :label="skill.substring(5)" v-model="character[skill]" density="compact"
                        hide-details="auto" type="number" :id="skill" @input="skillChange"></v-text-field>
                </template>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">
import { LvlStatKeys } from '@/models/LvlStats.model';
import { SkillSetKeys, type SkillSet } from '@/models/SkillSet.model';
import { CharacterApiService } from '@/services/Character.service';
import { defineComponent } from 'vue'

export default defineComponent({
    methods: {
        skillChange: function (event: any) {
            const key = event.target.id as keyof SkillSet;
            this.character.unusedSkillPoints = this.original[key] - this.character[key];
        }
    },
    data: function () {
        return {
            original: CharacterApiService.getInstance().originalData,
            character: CharacterApiService.getInstance().characterData,
            skillKeys: SkillSetKeys,
            statKeys: LvlStatKeys
        };
    }
})
</script>

<style>
.dense input {
    margin-bottom: 5px;
}
</style>