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
    this.interessenten=[];
    this.auffuellbar=auffuellbar;
  }

  getTeilnehmerCountsByWahl(anzWahlen){
    let total=this.teilnehmer.length;
    let counts=[];
    for(let i=0;i<anzWahlen+1;i++){
      counts[i]=0;
    }
    for(let i=0;i<total;i++){
      let t=this.teilnehmer[i];
      let wahl=t.getWahl(this);
      if(wahl>=0 && wahl<anzWahlen){
        counts[wahl]++;
      }else{
        counts[anzWahlen]++;
      }
    }
    counts.push(total);
    return counts;
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
    };
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
  }
}