export default class Teilnehmer{
  constructor(projekt,index,nachname, vorname, stufe, wahlen){
    this.index=index;
    this.projekt=projekt;
    this.nachname=nachname;
    this.vorname=vorname;
    this.stufe=stufe;
    this.wahlen=wahlen;
  }

  getWahlen(){
    return this.wahlen;
  }

  getBesteWahl(nochFrei){
    let anzWahlen=this.projekt.getAnzahlWahlen();
    for(let i=0;i<anzWahlen;i++){
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
      wahlen: []
    };
    for(let i=0;i<this.wahlen.length;i++){
      let k=this.wahlen[i];
      data.wahlen.push(k.index);
    }
    return data;
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