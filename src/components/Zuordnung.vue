<template>
  <div style="border: 1pt solid black">
    <Statistik :projekt="projekt" :zuordnung="zuordnung"/>
    <Button label="Weitersuchen" @click="weitersuchen()"/>
    <Button label="Löschen" @click="deleteZuordnung()"/>
    <Button label="Liste herunterladen" @click="downloadListe()"/>
  </div>
</template>

<script>
  import { download } from "../lib/helper";
import Statistik from "./Statistik.vue";
  export default {
    props: {
      projekt: Object,
      zuordnung: Object
    },
    methods: {
      deleteZuordnung(){
        let a=confirm("Zuordnung wirklich löschen?");
        if(a){
          this.projekt.removeZuordnung(this.zuordnung);
        }
      },
      downloadListe(){
        let kurse=this.zuordnung.getKurse(this.projekt.kurse,this.projekt.teilnehmer);
        let text="";
        for(let i=0;i<kurse.length;i++){
          let k=kurse[i];
          if(k.kurs){
            text+="Kurs "+k.kurs.name+":\n\n";
          }else{
            text+="Ohne Kurs:\n";
          }
          for(let j=0;j<k.teilnehmer.length;j++){
            let t=k.teilnehmer[j];
            text+=t.nachname+";"+t.vorname+";\n";
          }
          text+="\n\n";
        }
        download(text,this.projekt.name+"-Zuordnung.csv");
      }
    },
    components: {Statistik}
  }
</script>