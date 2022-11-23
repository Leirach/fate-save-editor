<template>
  <main>
  <div class="header d-flex justify-center">
    <v-alert type="error">We moved! Please visit: <a href="https://fate-save-editor.onrender.com">https://fate-save-editor.onrender.com</a> - The heroku url will be inaccessible by 28/11/2022</v-alert>
  </div>
  <div class="header d-flex justify-center">
    <img class="img-container" :src="selectedImg[characterService.gameVersion]">
  </div>
  <v-container fluid>
    <div class="d-flex flex-column align-center">
      <!-- div for a no wrap row -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="custom-card">
          <v-card-title>Save File Editor</v-card-title>
          <v-btn-toggle v-if="!displayForm" class="d-flex justify-center" color="primary"
            v-model="characterService.gameVersion" mandatory>
            <v-btn value="original">
              FATE (original)
            </v-btn>
            <v-btn value="traitorsoul">
              FATE: The Traitor Soul
            </v-btn>
          </v-btn-toggle>
          <v-card-text v-if="!displayForm">
            Upload your FATE save file below to get started. <br>
            If you are playing on Steam you can find them at: <br>
            <code>C:\Program Files (x86)\Steam\userdata\YOUR-STEAM-ID\{{gameVersionId[characterService.gameVersion]}}\remote\SAVE\en-US</code>
            Alternatively, <v-btn size="small" variant="text" class="ps-1" @click="loadEmpty">load an empty file</v-btn>
          </v-card-text>
          <v-card-item>
            <v-file-input label="Fate .FFD save file" prepend-icon="mdi-file" accept=".FFD" class="cursor"
              v-model="saveFile" v-on:change="fileChange" @click:clear="clearFile" hide-details="auto">
            </v-file-input>
          </v-card-item>
          <v-card-actions v-if="displayForm" class="justify-center">
            <v-btn @click="saveChanges" variant="elevated" color="primary">Save & download</v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
      <v-col cols="12" class="text-center">
        <v-progress-circular v-if="characterService.loading" :size="50" :width="7" color="primary" indeterminate>
        </v-progress-circular>
        <CharacterForm v-if="displayForm"></CharacterForm>
      </v-col>
    </div>
  </v-container>
  </main>
</template>

<script lang="ts">
import { CharacterApiService } from '@/services/Character.service';
import { APIVersion } from '@/services/constants';
import { defineComponent } from 'vue';
import CharacterForm from './CharacterForm.vue';
import logo_original from '@/assets/logo.png';
import logo_tts from '@/assets/logo_tts.png';

export default defineComponent({
  methods: {
    loadEmpty: async function () {
      await this.characterService.getCharacterData();
      this.saveFile[0] = { name: 'demo.FFD' } as File;
      this.displayForm = true;
    },
    fileChange: async function () {
      this.displayForm = false;
      if (!this.saveFile[0]) {
        return;
      }
      const buffer = new Uint8Array(await this.saveFile[0].arrayBuffer());
      try {
        await this.characterService.getCharacterData(buffer);
        this.displayForm = true;
      }
      catch (e) {
        console.error(e);
      }
    },
    clearFile: function () {
      this.saveFile = [];
      this.displayForm = false;
    },
    saveChanges: async function () {
      try {
        if (this.characterService.characterData.unusedSkillPoints < 0) {
          this.characterService.characterData.unusedSkillPoints = 0;
        }
        const res = await this.characterService.modifyCharacter();
        console.log(res);
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = 'modified.FFD';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
      catch (e) {
        console.error(e);
      }
    }
  },
  data: function () {
    let saveFile: File[] = [];
    return {
      characterService: CharacterApiService.getInstance(),
      displayForm: false,
      saveFile,
      selectedImg: {
        [APIVersion.ORIG]: logo_original,
        [APIVersion.TRAITOR_SOUL]: logo_tts,
      },
      gameVersionId: {
        [APIVersion.ORIG]: "246840",
        [APIVersion.TRAITOR_SOUL]: "303680",
      }
    };
  },
  components: { CharacterForm }
})
</script>

<style>
.header {
  padding-top: 30px;
  padding-bottom: 15px;
}

.img-container {
  max-width: 100%;
  max-height: 200px;
}

.cursor input {
  cursor: pointer;
}

a{
  color: blue;
}
</style>