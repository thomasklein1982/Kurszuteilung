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
    <h1>Zuordnngen</h1>
    <template v-for="(z,i) in projekt.zuordnungen">
      <zuordnung :projekt="projekt" :zuordnung="z"/>
    </template>
    <Button label="Neue Zuordnung" @click="newZuordnung()"/>
  </Screen>
</template>

<script>
import Zuordnung from "../classes/zuordnung";
import { download } from "../lib/helper";
import Screen from "./Screen.vue";
import zuordnung from "./Zuordnung.vue";

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
      newZuordnung(){
        let z=new Zuordnung();
        this.projekt.addZuordnung(z);
      },
      downloadProjekt(){
        let code=JSON.stringify(this.projekt);
        console.log(code);
        download(code,this.projekt.name+".json");
      }
    },
    components: { Screen, zuordnung }
};
</script>