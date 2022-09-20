<template>
  <Screen>
    <Dialog v-model:visible="dialogNewProjekt.show" header="Neues Projekt">
      <div class="ui-container">
        <InputText v-model="dialogNewProjekt.name"/>
        <Button :disabled="dialogNewProjekt.name.trim().length===0" label="Kurse hochladen (csv)" @click="uploadKurse()" />
        <Button :disabled="dialogNewProjekt.kurse===null" label="Teilnehmer hochladen (csv)" @click="uploadTeilnehmer()" />
      </div>
      <Button :disabled="dialogNewProjekt.teilnehmer===null" label="Projekt anlegen" @click="createProjekt()"/>
    </Dialog>
    <h1>Kurszuteilung</h1>
    <Button label="Projekt hochladen" @click="uploadProjekt()" />
    <Button label="Neues Projekt" @click="dialogNewProjekt.show=true"/>
    
    
  </Screen>
</template>

<script>
import { upload } from "../lib/helper";
import Screen from "./Screen.vue";
import Kurs from "../classes/kurs";
import Projekt from "../classes/projekt";
import Teilnehmer from "../classes/teilnehmer";

export default{
  data: ()=>{
    return {
      dialogNewProjekt: {
        show: false,
        name: "",
        kurse: null,
        teilnehmer: null
      }
    };
  },
  methods: {
    async uploadKurse(){
      let csv=await upload();
      let kurse=[];
      csv=csv.code.replace(/\r/g,"");
      csv=csv.trim().split("\n");
      for(let i=1;i<csv.length;i++){
        let line=csv[i].split(";");
        let k=new Kurs(i-1,line[0],line[1],line[2],line[3],line[4],line[5]*1,line[6]*1);
        kurse.push(k);
      }
      console.log(kurse);
      this.dialogNewProjekt.kurse=kurse;
    },
    getKursById(id){
      for(let i=0;i<this.dialogNewProjekt.kurse.length;i++){
        let k=this.dialogNewProjekt.kurse[i];
        if(k.id===id){
          return k;
        }
      }
      return null;
    },
    async uploadTeilnehmer(){
      let csv=await upload();
      let teilnehmer=[];
      csv=csv.code.replace(/\r/g,"");
      csv=csv.trim().split("\n");
      for(let i=1;i<csv.length;i++){
        let line=csv[i].split(";");
        let name=line[0];
        name=name.split(",");
        let stufe=line[1];
        let wahlen=line[2].split(",");
        let kurse=[];
        for(let j=0;j<wahlen.length;j++){
          let w=wahlen[j].trim();
          let k=this.getKursById(w);
          kurse.push(k);
        }
        let t=new Teilnehmer(i,name[0].trim(),name[1].trim(),stufe,kurse);
        teilnehmer.push(t);
      }
      console.log(teilnehmer);
      this.dialogNewProjekt.teilnehmer=teilnehmer;
    },
    async uploadProjekt(){
      let json=await upload();
      json=json.code;
      json=JSON.parse(json);
      console.log(json);
      let projekt=new Projekt();
      projekt.fromJSON(json);
      this.$emit("start-projekt",projekt);
    },
    createProjekt(){
      let projekt=new Projekt(this.dialogNewProjekt.name);
      projekt.kurse=this.dialogNewProjekt.kurse;
      projekt.teilnehmer=this.dialogNewProjekt.teilnehmer;
      this.$emit("start-projekt",projekt);
    }
  },
  components: {
    Screen
  }
}
</script>