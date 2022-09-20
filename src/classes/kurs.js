export default class Kurs{

  constructor(index,name, id, beschreibung, minStufe,maxStufe, minTeilnehmer, maxTeilnehmer, auffuellbar){
    this.index=index;
    this.name=name;
    this.id=id;
    this.beschreibung=beschreibung;
    this.minStufe=minStufe;
    this.maxStufe=maxStufe;
    this.minTeilnehmer=minTeilnehmer;
    this.maxTeilnehmer=maxTeilnehmer;
    this.teilnehmer=[];
    this.interessenten=[];
    this.auffuellbar=auffuellbar;
  }

  toJSON(){
    let data={
      name: this.name,
      id: this.id,
      beschreibung: this.beschreibung,
      minStufe: this.minStufe,
      maxStufe: this.maxStufe,
      minTeilnehmer: this.minTeilnehmer,
      maxTeilnehmer: this.maxTeilnehmer,
      auffuellbar: this.auffuellbar,
      teilnehmer: []
    };
    for(let i=0;i<this.teilnehmer.length;i++){
      let t=this.teilnehmer[i];
      data.teilnehmer.push(t.index);
    }
    return data;
  }

  fromJSON(data,index){
    this.index=index;
    this.id=data.id;
    this.name=data.name;
    this.beschreibung=data.beschreibung;
    this.minStufe=data.minStufe;
    this.maxStufe=data.maxStufe;
    this.minTeilnehmer=data.minTeilnehmer;
    this.maxTeilnehmer=data.maxTeilnehmer;
    this.auffuellbar=data.auffuellbar;
    this.teilnehmer=data.teilnehmer;
  }

  restoreTeilnehmer(teilnehmer){
    for(let i=0;i<this.teilnehmer.length;i++){
      let ti=this.teilnehmer[i];
      let t=teilnehmer[ti];
      this.teilnehmer[i]=t;
    }
  }
}