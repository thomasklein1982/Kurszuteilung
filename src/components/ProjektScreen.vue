<template>
  <Screen>
    <Dialog v-model:visible="dialogSettings.show" header="Projekt-Einstellungen">
      <div class="ui-container">
        <InputText type="number" v-model="projekt.settings.anzWahlen" placeholder="Anzahl Wahlen"/>
        <InputText type="text" v-model="projekt.settings.strafen" placeholder="Strafen (; getrennt)"/>
      </div>
    </Dialog>
    <Button label="Projekt herunterladen" @click="downloadProjekt()"/>
    <Button label="Einstellungen" @click="dialogSettings.show=true"/>
  </Screen>
</template>

<script>
import { download } from "../lib/helper";
import Screen from "./Screen.vue";
  export default {
    props: {
      projekt: Object,
    }, 
    data: ()=>{
      return {
        dialogSettings: {
          show: false
        }
      };
    },
    methods: {
      downloadProjekt(){
        let code=JSON.stringify(this.projekt);
        console.log(code);
        download(code,this.projekt.name+".json");
      }
    },
    components: { Screen }
};
</script>