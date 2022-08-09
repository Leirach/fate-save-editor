<template>
  <div class="header d-flex justify-center">
    <img class="img-container" src="@/assets/logo.png">
  </div>
  <v-container fluid>
    <div class="d-flex flex-column align-center">
      <!-- div for a no wrap row -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="custom-card">
          <v-card-title>Save File Editor</v-card-title>
          <v-card-text>
            Upload your FATE save file below to get started. <br>
            If you are playing on Steam you can find them at: <br>
            <code>C:\Program Files (x86)\Steam\userdata\YOUR-STEAM-ID\246840\remote\SAVE\en-US</code>
          </v-card-text>
          <v-card-item>
            <v-file-input label="Fate .FFD save file" prepend-icon="mdi-file" accept=".FFD" class="cursor"
              v-model="saveFile" v-on:change="fileChange">
            </v-file-input>
          </v-card-item>
        </v-card>
        <custom-button v-model="testvalue" v-on:change="testFunc" v-on:++="testvalue++"
          v-on:--="testvalue--"></custom-button>
      </v-col>
      <v-col cols="12">
        <CharacterForm v-if="displayForm"></CharacterForm>
      </v-col>
    </div>
  </v-container>
</template>

<script lang="ts">
import { CharacterApiService } from '@/services/Character.service';
import { defineComponent } from 'vue'
import CharacterForm from './CharacterForm.vue';
import CustomButton from './CustomButton.vue';

export default defineComponent({
  methods: {
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
    testFunc: function () {
      console.log("ay yo")
    }
  },
  data: function () {
    let saveFile: File[] = [];
    return {
      characterService: CharacterApiService.getInstance(),
      displayForm: false,
      saveFile,
      testvalue: 10
    };
  },
  components: { CharacterForm, CustomButton }
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
</style>