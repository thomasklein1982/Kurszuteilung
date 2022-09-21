<template>
  <div style="border: 1pt solid black">
    <Statistik :projekt="projekt" :zuordnung="zuordnung"/>
    <Button label="Weitersuchen" @click="weitersuchen()"/>
    {{percent}}
    <Button label="Löschen" @click="deleteZuordnung()"/>
    <Button label="Liste herunterladen" @click="downloadListe()"/>
  </div>
</template>

<script>
import { download,sleep } from "../lib/helper";
import Statistik from "./Statistik.vue";
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
    data: ()=>{
      return {
        precent: 0
      };
    },
    methods: {
      async weitersuchen(){
        this.percent=0;
        let count=100000;
        let step=Math.ceil(count/1000);
        let strafe=this.strafe;
        for(let i=0;i<count;i++){
          strafe=this.zuordnung.weitersuchen(strafe);
          if(i%step===0){
            this.percent+=10;
            await sleep(10);
          }
        }
      },
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