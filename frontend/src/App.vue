<template>
  <v-app>
    <v-main>
      <Home></Home>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Home from './components/Home.vue'

export default defineComponent({
  name: 'Fate Save Editor',
  components: {
    Home
  },

  data() {
    return {
      //
    }
  },
})
</script>
