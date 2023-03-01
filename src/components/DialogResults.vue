<template>
  <Dialog v-model:visible="show" header="Ergebnisse">
    <StatistikKurse :kurse="kurse" :anzahl-wahlen="projekt.getAnzahlWahlen()"/>
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
      this.kurse=this.zuordnung.getKurse(this.projekt.kurse,this.projekt.teilnehmer);
      console.log(this.kurse);
      this.show=true;
    },
    downloadListe(){
      let text="";
      let kurse=this.kurse;
      for(let i=0;i<kurse.length;i++){
        let k=kurse[i];
        if(k.kurs){
          text+="Kurs "+k.kurs.name+":\n\n";
        }else{
          text+="Ohne Kurs:\n";
        }
        for(let j=0;j<k.alleTeilnehmer.length;j++){
          let t=k.alleTeilnehmer[j];
          text+=(j+1)+";"+t.nachname+";"+t.vorname+";\n";
        }
        text+="\n\n";
      }
      download(text,this.projekt.name+"-Zuordnung.csv");
    }
  },
  components: {StatistikKurse}
};
</script>