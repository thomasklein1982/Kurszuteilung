import Angebot from "./angebot";

export default class Teilnehmer{
  constructor(projekt,index,nachname, vorname, stufe, wahlen){
    if(index===undefined) return;
    this.index=index;
    this.nachname=nachname;
    this.vorname=vorname;
    this.stufe=stufe;
    this.wahlen=wahlen;
    this.ignorieren=false;
    /**Falls es Kurse nicht gibt, muessen die Luecken aufgefuellt werden */
    // let lastWahl=0;
    // for(let i=0;i<wahlen.length;i++){
    //   if(wahlen[i]){
    //     let k=projekt.getKursById(wahlen[i]);
    //     if(k){
    //       this.wahlen.push(k);
    //       lastWahl++;
    //     }
    //   }
    // }
    if(wahlen.length===0){
      alert("Problem: Teilnehmer "+this.index+" ("+this.nachname+", "+this.vorname+" aus Stufe "+this.stufe+") hat keine existierenden Angebote gewählt.\nDer Teilnehmer wird nicht zugeordnet.");
      this.ignorieren=true;
      return;
    }
  }

  getIndex(){
    return this.index;
  }

  getWahlen(){
    return this.wahlen;
  }

  getBesteWahl(alleKurse, strafen, anzahlZeitslots){
    let verfuegbareKurseNachZeitslots=[];
    for(let j=0;j<anzahlZeitslots;j++){
      let slot=j+1;
      let kurseFuerSlot=[];
      for(let i=0;i<this.wahlen.length;i++){
        let a=this.wahlen[i];
        let kurse=alleKurse[a.getId()];

        for(let ki=0;ki<kurse.length;ki++){
          let k=kurse[ki];
          if(k.getZeitslot()===slot && k.hatNochPlatz()){
            kurseFuerSlot.push({
              kurs: k,
              wahl: i
            });
          }
        }
      }
      if(kurseFuerSlot.length===0){
        return null;
      }
      verfuegbareKurseNachZeitslots.push(kurseFuerSlot);
    }
    console.log(verfuegbareKurseNachZeitslots);
    let zuordnung=[];
    for(let i=0;i<anzahlZeitslots;i++){
      zuordnung.push(0);
    }
    let suchen=true;
    let besteZuordnung=null;
    while(suchen){
      let angebotIds={};
      //checken, ob das gleiche angebot mehrfach enthalten ist:
      let ok=true;
      for(let i=0;i<zuordnung.length;i++){
        let k=verfuegbareKurseNachZeitslots[i][zuordnung[i]];
        if(angebotIds[k.kurs.getAngebotId()]){
          ok=false;
          break;
        }
        angebotIds[k.kurs.getAngebotId()]=true;
      }
      if(ok){
        let strafe=0;
        let nebenStrafe=0;
        let kurse=[];
        for(let i=0;i<zuordnung.length;i++){
          let k=verfuegbareKurseNachZeitslots[i][zuordnung[i]];
          kurse[i]=k;
          strafe+=strafen[k.wahl];
          nebenStrafe+=-k.kurs.getFreiePlaetze();
          //k.kurs.addTeilnehmer(this);
        }
        if(!besteZuordnung || strafe<besteZuordnung.strafe || strafe===besteZuordnung.strafe && nebenStrafe<besteZuordnung.nebenStrafe){
          besteZuordnung={
            kurse: kurse,
            strafe,
            nebenStrafe
          }
        }
      }
      let fertig=true;
      for(let i=0;i<zuordnung.length;i++){
        let stelle=zuordnung.length-i-1;
        if(zuordnung[stelle]<verfuegbareKurseNachZeitslots[stelle].length-1){
          zuordnung[stelle]++;
          fertig=false;
          break;
        }else{
          zuordnung[stelle]=0;
        }
      }
      if(fertig){
        suchen=false;
      }
    }
    if(besteZuordnung){
      let slots=besteZuordnung.kurse; 
      for(let i=0;i<slots.length;i++){
        slots[i].kurs.addTeilnehmer(this);
      }
      return besteZuordnung;
    }
    // for(let i=0;i<this.wahlen.length;i++){
    //   let a=this.wahlen[i];
    //   let kurse=alleKurse[a.getId()];
    //   //suche alle kurse zu diesem Angebot, die noch einen freien Platz haben
    //   if(nochFrei[k.index]>0){
    //     return {
    //       angebot: k,
    //       wahlIndex: i
    //     };
    //   }
    // }

    return null;
  }

  /**
   * Liefert den Index der Wahl zurück, die diesem Angebot entspricht (-1, wenn Kurs nicht gewählt wurde)
   * @param {Angebot} angebot 
   * @returns 
   */
  getWahl(angebot){
    for(let i=0;i<this.wahlen.length;i++){
      let w=this.wahlen[i];
      if(w===angebot){
        return i;
      }
    }
    return -1;
  }

  getWahlenIndices(){
    let wahlen=[];
    for(let i=0;i<this.wahlen.length;i++){
      let k=this.wahlen[i];
      wahlen.push(k.index);
    }
    return wahlen;
  }

  getWahlenIDs(){
    let wahlen=[];
    for(let i=0;i<this.wahlen.length;i++){
      let k=this.wahlen[i];
      wahlen.push(k.id);
    }
    return wahlen;
  }

  toJSON(){
    let data={
      nachname: this.nachname,
      vorname: this.vorname,
      stufe: this.stufe,
      wahlen: this.getWahlenIDs()
    };
    return data;
  }

  fromJSON(data,index,projekt){
    this.index=index;
    this.nachname=data.nachname;
    this.vorname=data.vorname;
    this.stufe=data.stufe;
    this.wahlen=[];
    for(let i=0;i<data.wahlen.length;i++){
      let ki=data.wahlen[i];
      let k=projekt.getAngebotById(ki);
      this.wahlen.push(k);
    }
  }
}