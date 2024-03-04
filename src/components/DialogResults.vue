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
      let anzahlSlots=this.kurse.length;
      let anzahlWahlen=this.projekt.getAnzahlWahlen();
      text+="Übersicht\n\n";
      text+="Angebot";
      for(let i=0;i<anzahlSlots;i++){
        text+=";Zeitslot "+(i+1);
      }
      text+=";Interessenten\n";
      for(let i=0;i<this.projekt.angebote.length;i++){
        let a=this.projekt.angebote[i];
        let kurse=[];
        for(let j=0;j<anzahlSlots;j++){
          let kurseFuerSlot=this.kurse[j];
          for(let ki=0;ki<kurseFuerSlot.length;ki++){
            if(kurseFuerSlot[ki].angebot===a){
              kurse.push(kurseFuerSlot[ki]);
            }
          }
        }
        kurse.sort((a,b)=>{
          return a.zeitslot-b.zeitslot;
        });
        text+=a.name;
        for(let j=0;j<kurse.length;j++){
          let k=kurse[j];
          text+=";"+k.getAnzahlTeilnehmer()+"/"+a.maxTeilnehmer+" ( = ";
          for(let wi=0;wi<anzahlWahlen;wi++){
            if(wi>0) text+="+";
            text+=k.getAnzahlTeilnehmerNachWahl(wi+1);
          }
          text+=")";
        }
        text+=";";
        let sum=0;
        for(let j=0;j<a.interessenten.length;j++){
          sum+=a.interessenten[j].length;
        }
        text+=sum+" ( = ";
        for(let j=0;j<a.interessenten.length;j++){
          if(j>0) text+="+";
          text+=a.interessenten[j].length;
        }
        text+=")";
        text+="\n";
      }
      text+="\n\n";

      for(let j=0;j<anzahlSlots;j++){
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