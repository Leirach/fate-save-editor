<template>
    <v-form>
        <v-text-field label="Name" hide-details="auto" v-model="character.name"></v-text-field>
        <v-text-field label="Level" v-model="character.level" hide-details="auto" type="number" :disabled="true"></v-text-field>
        <v-select label="Fame Rank" hide-details="auto" v-model="character.fameRank" :items="fameRanks" :disabled="true"></v-select>
        <v-text-field label="Gold" v-model="character.gold" hide-details="auto" type="number"></v-text-field>
        <v-divider class="divider"></v-divider>
        <v-row>
            <v-col cols="12" md="6">
                Character Stats
                <template v-for="stat in statKeys">
                    <custom-text-field hide-details="auto" :label="stat" v-model="character[stat]" type="number" :id="stat"
                        v-on:++="increaseStat(stat)" v-on:--="decreaseStat(stat)">
                    </custom-text-field>
                </template>
            </v-col>
            <v-col cols="12" md="6">
                Skills
                <span v-if="character.unusedSkillPoints > 0">(unused: {{ character.unusedSkillPoints }})</span>
                <template v-for="skill in skillKeys">
                    <custom-text-field class="dense" :label="skill.substring(5)" v-model="character[skill]"
                        density="compact" hide-details="auto" type="number" :id="skill" v-on:++="increaseSkill(skill)"
                        v-on:--="decreaseSkill(skill)" @change="updateUnused(skill)">
                    </custom-text-field>
                </template>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">
import { LvlStatKeys, type LvlStats } from '@/models/LvlStats.model';
import { SkillSetKeys, type SkillSet } from '@/models/SkillSet.model';
import { CharacterApiService } from '@/services/Character.service';
import { defineComponent } from 'vue'
import CustomTextField from './CustomTextField.vue';
import { FAME_RANKS } from '@/services/constants'

export default defineComponent({
    methods: {
        increaseStat: function (key: keyof LvlStats) {
            this.character[key]++;
        },
        decreaseStat: function (key: keyof LvlStats) {
            this.character[key]--;
        },
        increaseSkill: function (key: keyof SkillSet) {
            this.character[key]++;
            this.character.unusedSkillPoints--;
        },
        decreaseSkill: function (key: keyof SkillSet) {
            this.character[key]--;
            this.character.unusedSkillPoints++;
        },
        updateUnused(key: keyof SkillSet) {
            console.log(key, "updating lmao")
            this.character.unusedSkillPoints += this.original[key] - this.character[key]
        }
    },
    data: function () {
        return {
            original: CharacterApiService.getInstance().originalData,
            character: CharacterApiService.getInstance().characterData,
            skillKeys: SkillSetKeys,
            statKeys: LvlStatKeys,
            fameRanks: FAME_RANKS.map((e, i) => ({ title: e, value: i }))
        };
    },
    components: { CustomTextField }
})
</script>

<style>
.dense input {
    margin-bottom: 5px;
}
.divider {
    margin: 20px 0px;
}
</style>