<template>
  <StartScreen v-if="!projekt" @start-projekt="startProjekt"/>
  <ProjektScreen v-else :projekt="projekt"/>
</template>

<script>
import StartScreen from "./StartScreen.vue";
import ProjektScreen from "./ProjektScreen.vue";

export default{
  data: ()=>{
    return {
      projekt: null,
      version: "0.1"
    }
  },
  methods: {
    startProjekt(projekt){
      projekt.calc();
      window.app.projekt=projekt;
      this.projekt=projekt;
    }
  },
  components: {
    StartScreen,
    ProjektScreen
}
}
</script>