<template>
  <Screen>
    <Dialog v-model:visible="dialogNewProjekt.show" header="Neues Projekt">
      <div class="ui-container">
        <Accordion style="max-width: 80vw">
          <AccordionTab header="Angebote-Datei">
            <div>
              Die Angebotedatei muss eine CSV-Datei sein (mit Semikolon getrennt) nach folgendem Schema:
              <table>
                <tr><th>Name</th><th>id</th><th>beschreibung</th><th>Jahrgangsstufe mindestens</th><th>Jahrgangsstufe höchstens</th><th>Teilnehmerzahl mindestens</th><th>Teilnehmerzahl höchstens</th><th>Auffüllbar?</th><th>Zeitslots</th><th>Anzahl Zeitslots</th></tr>
                <tr><td>beliebiger String</td><td>eindeutiger String ohne Leerzeichen</td><td>Beliebiger String</td><td>ganze Zahl</td><td>ganze Zahl</td><td>ganze Zahl</td><td>ganze Zahl</td><td>true/false: Darf der Kurs mit Teilnehmern aufgefüllt werden, die ihn nicht gewählt haben? (Bsp: Ein Orchester-Kurs sollte nicht aufgefüllt werden.)</td><td>Liste von ganzen Zahlen, mit Komma getrennt. Benennt die Zeitslots, zu denen dieser Kurs stattfinden kann (leer lassen für egal). Nummerierung beginnt bei 1.</td><td>ganze Zahl oder leer (gilt dann als 1). Gibt an, wie oft dieser Kurs stattfinden kann.</td></tr>
                <tr><td>Gesundes Kochen</td><td>2</td><td>Hier lernen wir zu kochen.</td><td>6</td><td>11</td><td>6</td><td>12</td><td>true</td><td>1,2</td><td>2</td></tr>
              </table>
            </div>
          </AccordionTab>
          <AccordionTab header="Teilnehmer-Datei">
            <div>
              Die Teilnehmerdatei muss eine CSV-Datei sein (mit Semikolon getrennt) nach folgendem Schema:
              <table>
                <tr><th>Name</th><th>Stufe</th><th>Wahlen</th></tr>
                <tr><td>Nachname, Vorname</td><td>ganze Zahl</td><td>IDs der Angebote mit Komma getrennt, mit Erstwahl beginnend</td></tr>
                <tr><td>Klein, Thomas</td><td>12</td><td>17,2,45,3</td></tr>
              </table>
            </div>
          </AccordionTab>
        </Accordion>
        <InputText placeholder="Name des Projekts" v-model="projekt.name"/>
        <InputNumber placeholder="Anzahl der Zeit-Slots" v-model="projekt.slotCount"/>
        <Button :disabled="projekt.name.trim().length===0" label="Angebote hochladen (csv)" @click="uploadAngebote()" />
        <Button :disabled="projekt.angebote===null" label="Teilnehmer hochladen (csv)" @click="uploadTeilnehmer()" />
      </div>
      <Button :disabled="projekt.teilnehmer===null" label="Projekt anlegen" @click="createProjekt()"/>
    </Dialog>
    <h1>Kurszuteilung</h1>
    <Button label="Projekt hochladen" @click="uploadProjekt()" />
    <Button label="Neues Projekt" @click="dialogNewProjekt.show=true"/>
    
  </Screen>
</template>

<script>
import { upload } from "../lib/helper";
import Screen from "./Screen.vue";
import Angebot from "../classes/angebot";
import Projekt from "../classes/projekt";
import Teilnehmer from "../classes/teilnehmer";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import InputNumber from "primevue/inputnumber";

export default{
  data: ()=>{
    return {
      dialogNewProjekt: {
        show: false,
      },
      projekt: new Projekt()
    };
  },
  methods: {
    async uploadAngebote(){
      let csv=await upload();
      let angebote=[];
      csv=csv.code.replace(/\r/g,"");
      csv=csv.trim().split("\n");
      for(let i=1;i<csv.length;i++){
        let line=csv[i].split(";");
        let k=new Angebot(i-1,line[0],line[1],line[2],line[3],line[4],line[5]*1,line[6]*1,line[7]!=="false",line[8],this.projekt.getAnzahlZeitslots());
        angebote.push(k);
      }
      console.log(angebote);
      this.projekt.angebote=angebote;
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
        let angebote=[];
        let angeboteIds={};
        for(let j=0;j<wahlen.length;j++){
          let w=wahlen[j].trim();
          let k=this.projekt.getAngebotById(w);
          if(!angeboteIds[k.getId()]){
            angebote.push(k);
          }else{
            console.log("doppelte Wahl");
          }
          angeboteIds[k.getId()]=true;
        }
        let t=new Teilnehmer(this.projekt,i-1,name[0].trim(),name[1].trim(),stufe,angebote);
        teilnehmer.push(t);
      }
      console.log(teilnehmer);
      this.projekt.teilnehmer=teilnehmer;
    },
    async uploadProjekt(){
      let json=await upload();
      json=json.code;
      json=JSON.parse(json);
      console.log(json);
      this.projekt.fromJSON(json);
      console.log(this.projekt);
      this.$emit("start-projekt",this.projekt);
    },
    createProjekt(){
      this.$emit("start-projekt",this.projekt);
    }
  },
  components: {
    Screen, Accordion, AccordionTab, InputNumber
  }
}
</script>