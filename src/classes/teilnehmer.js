import Kurs from "./kurs";

export default class Teilnehmer{
  constructor(index,nachname, vorname, stufe, wahlen){
    this.index=index;
    this.nachname=nachname;
    this.vorname=vorname;
    this.stufe=stufe;
    this.wahlen=wahlen;
    /**Falls es Kurse nicht gibt, muessen die Luecken aufgefuellt werden */
    let lastWahl=-1;
    for(let i=0;i<this.wahlen.length;i++){
      if(this.wahlen[i]){
        lastWahl=i;
        break;
      }
    }
    if(lastWahl<0){
      alert("Problem: Teilnehmer "+this.index+" ("+this.nachname+", "+this.vorname+" aus Stufe "+this.stufe+") hat keine existierenden Kurse gewählt.\nDer Teilnehmer wird nicht zugeordnet.");
      this.ignorieren=true;
      return;
    }
    this.ignorieren=false;
    for(let i=0;i<lastWahl;i++){
      this.wahlen[i]=this.wahlen[lastWahl];
    }
    for(let i=lastWahl+1;i<this.wahlen.length;i++){
      if(!this.wahlen[i]){
        this.wahlen[i]=this.wahlen[lastWahl];
      }else{
        lastWahl=i;
      }
    }
  }

  getWahlen(){
    return this.wahlen;
  }

  getBesteWahl(nochFrei, anzahlWahlen){
    for(let i=0;i<anzahlWahlen;i++){
      let k=this.wahlen[i];
      if(nochFrei[k.index]>0){
        return {
          kurs: k,
          wahlIndex: i
        };
      }
    }
    return null;
  }

  /**
   * Liefert den Index der Wahl zurück, die diesem Kurs entspricht (-1, wenn Kurs nicht gewählt wurde)
   * @param {Kurs} kurs 
   * @returns 
   */
  getWahl(kurs){
    for(let i=0;i<this.wahlen.length;i++){
      let w=this.wahlen[i];
      if(w===kurs){
        return i;
      }
    }
    return -1;
  }

  toJSON(){
    let data={
      nachname: this.nachname,
      vorname: this.vorname,
      stufe: this.stufe,
      wahlen: this.getWahlenIndices().join(", ")
    };
    return data;
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

  fromJSON(data,index,kurse){
    this.index=index;
    this.nachname=data.nachname;
    this.vorname=data.vorname;
    this.stufe=data.stufe;
    this.wahlen=[];
    for(let i=0;i<data.wahlen.length;i++){
      let ki=data.wahlen[i];
      let k=kurse[ki];
      this.wahlen.push(k);
    }
  }
}