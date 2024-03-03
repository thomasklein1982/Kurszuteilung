<template>
  <div style="border: 1pt solid black">
    <Statistik :projekt="projekt" :zuordnung="zuordnung" @details="$event=>showDetails($event)"/>
    <div v-if="suchen">Suche läuft {{ suchenIndikator?'/':'\\' }}</div>
    <Button :disabled="suchen" label="Weitersuchen" @click="weitersuchen()"/>
    <Button :disabled="!suchen" label="Suche stoppen" @click="stop()"/>
    <Button label="Löschen" @click="deleteZuordnung()"/>
    <Button label="Ergebnisse" :disabled="suchen" @click="$refs.resultsDialog.open()"/>
  </div>
  <Dialog v-model:visible="detailsDialog.show" :header="detailsDialog.infos?.name">
    <table v-if="detailsDialog.infos">
      <tr><th>Teilnehmer</th><th>Stufe</th><th>Wahlen</th></tr>
      <tr v-for="(t,i) in detailsDialog.infos.teilnehmer">
        <td>{{ t.nachname }}, {{ t.vorname }}</td><td>{{ t.stufe }}</td><td>{{ t.getWahlenIDs().join(', ') }}</td>
      </tr>
    </table>
  </Dialog>
  <DialogResults ref="resultsDialog" :projekt="projekt" :zuordnung="zuordnung"/>
</template>

<script>
import { sleep } from "../lib/helper";
import Statistik from "./Statistik.vue";
import DialogResults from "./DialogResults.vue";

  export default {
    props: {
      projekt: Object,
      zuordnung: Object
    },
    computed: {
      strafe(){
        if(this.zuordnung){
          return this.zuordnung.calcStrafe();
        }
      } 
    },
    data(){
      return {
        suchen: false,
        suchenIndikator: true,
        detailsDialog: {
          show: false,
          infos: null
        }
      };
    },
    methods: {
      showDetails(infos){
        this.detailsDialog.infos=infos;
        this.detailsDialog.show=true;
      },
      async weitersuchen(){
        this.suchen=true;
        let step=10;
        let strafe=this.strafe;
        let i=0;
        do{
          let neueStrafe=this.zuordnung.weitersuchen(strafe);
          if(neueStrafe>=0){
            strafe=neueStrafe;
          }
          i++;
          if(i%step===0){
            this.suchenIndikator=!this.suchenIndikator;
            i=0;
            await sleep(10);
          }
        }while(this.suchen && strafe!==0);
        this.suchen=false;
      },
      stop(){
        this.suchen=false;
      },
      deleteZuordnung(){
        let a=confirm("Zuordnung wirklich löschen?");
        if(a){
          this.projekt.removeZuordnung(this.zuordnung);
        }
      }
    },
    components: {Statistik,DialogResults}
  }
</script>