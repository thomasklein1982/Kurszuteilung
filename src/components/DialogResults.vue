<template>
  <Dialog v-model:visible="show" header="Ergebnisse">
    <StatistikKurse :kurse-nach-zeitslot="kurse" :anzahl-wahlen="projekt.getAnzahlWahlen()"/>
    <template #footer>
      <Button label="Liste herunterladen" @click="downloadListe()"/>
    </template>
  </Dialog>
</template>

<script>
import StatistikKurse from "./StatistikKurse.vue";
import { download } from "../lib/helper";

export default {
  props: {
    projekt: Object,
    zuordnung: Object
  },
  data(){
    return {
      kurse: [],
      show: false
    }
  },
  methods: {
    open(){
      this.kurse=this.zuordnung.getKurseNachZeitslot();
      console.log(this.kurse);
      this.show=true;
    },
    downloadListe(){
      let text="";
      for(let j=0;j<this.kurse.length;j++){
        text+="Zeitslot "+(j+1)+"\n\n";
        let kurse=this.kurse[j];
        for(let i=0;i<kurse.length;i++){
          let k=kurse[i];
          text+="Kurs "+k.getAngebotName()+":\n\n";
          
          for(let ti=0;ti<k.teilnehmer.length;ti++){
            let t=k.getTeilnehmer(ti);
            text+=(ti+1)+";"+t.nachname+";"+t.vorname+";\n";
          }
          text+="\n\n";
        }
      }
      download(text,this.projekt.name+"-Zuordnung.csv");
    }
  },
  components: {StatistikKurse}
};
</script>