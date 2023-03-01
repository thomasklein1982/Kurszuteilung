<template>
  <Screen>
    <Dialog v-model:visible="dialogNewProjekt.show" header="Neues Projekt">
      <div class="ui-container">
        <Accordion>
          <AccordionTab header="Kurs-Datei">
            <div>
              Die Kursdatei muss eine CSV-Datei sein (mit Semikolon getrennt) nach folgendem Schema:
              <table>
                <tr><th>Name</th><th>id</th><th>beschreibung</th><th>Jahrgangsstufe mindestens</th><th>Jahrgangsstufe höchstens</th><th>Teilnehmerzahl mindestens</th><th>Teilnehmerzahl höchstens</th><th>Auffüllbar?</th></tr>
                <tr><td>beliebiger String</td><td>eindeutiger String ohne Leerzeichen</td><td>Beliebiger String</td><td>ganze Zahl</td><td>ganze Zahl</td><td>ganze Zahl</td><td>ganze Zahl</td><td>true/false: Darf der Kurs mit Teilnehmern aufgefüllt werden, die ihn nicht gewählt haben? (Bsp: Ein Orchester-Kurs sollte nicht aufgefüllt werden.)</td></tr>
                <tr><td>Gesundes Kochen</td><td>2</td><td>Hier lernen wir zu kochen.</td><td>6</td><td>11</td><td>6</td><td>12</td><td>true</td></tr>
              </table>
            </div>
          </AccordionTab>
          <AccordionTab header="Teilnehmer-Datei">
            <div>
              Die Teilnehmerdatei muss eine CSV-Datei sein (mit Semikolon getrennt) nach folgendem Schema:
              <table>
                <tr><th>Name</th><th>Stufe</th><th>Wahlen</th></tr>
                <tr><td>Nachname, Vorname</td><td>ganze Zahl</td><td>Nummern der Projekte mit Komma getrennt</td></tr>
                <tr><td>Klein, Thomas</td><td>12</td><td>17,2,45,3</td></tr>
              </table>
            </div>
          </AccordionTab>
        </Accordion>
        <InputText placeholder="Name des Projekts" v-model="dialogNewProjekt.name"/>
        
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
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

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
        let t=new Teilnehmer(i-1,name[0].trim(),name[1].trim(),stufe,kurse);
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
    Screen, Accordion, AccordionTab
  }
}
</script>