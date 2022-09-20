import Teilnehmer from "./teilnehmer";
import Kurs from "./kurs";
import Zuordnung from "./zuordnung";

export default class Projekt{
  constructor(name){
    this.name=name;
    this.teilnehmer=null;
    this.kurse=null;
    this.zuordnungen=[];
    this.settings={
      anzWahlen: 4,
      strafen: "0;10;30;60;100"
    };
  }

  addZuordnung(z){
    this.zuordnungen.push(z);
  }

  removeZuordnung(z){
    let i=this.zuordnungen.indexOf(z);
    if(i>=0){
      this.zuordnungen.splice(i,1);
    }
  }

  getAnzahlWahlen(){
    return this.settings.anzWahlen*1;
  }

  getStrafen(){
    let s=this.settings.strafen.split(";");
    let strafen=[];
    for(let i=0;i<s.length;i++){
      let w=s[i]*1;
      strafen.push(w);
    }
    return strafen;
  }

  getZuordnungenNachWahlenCounts(){
    let counts=[];
    let anzWahlen=this.getAnzahlWahlen();
    for(let i=0;i<anzWahlen+2;i++){
      counts[i]=0;
    }
    for(let i=0;i<this.kurse.length;i++){
      let k=this.kurse[i];
      let c=k.getTeilnehmerCountsByWahl(anzWahlen);
      for(let j=0;j<anzWahlen+2;j++){
        counts[j]+=c[j];
      }
    }
    return counts;
  }

  fromJSON(data){
    this.name=data.name;
    this.settings=data.settings;
    this.kurse=[];
    for(let i=0;i<data.kurse.length;i++){
      let k=data.kurse[i];
      let rk=new Kurs();
      rk.fromJSON(k,i);
      this.kurse.push(rk);
    }
    this.teilnehmer=[];
    for(let i=0;i<data.teilnehmer.length;i++){
      let t=data.teilnehmer[i];
      let rt=new Teilnehmer();
      rt.fromJSON(t,i,this.kurse);
      this.teilnehmer.push(rt);
    }
    this.zuordnungen=[]
    for(let i=0;i<data.zuordnungen.length;i++){
      let z=data.zuordnungen[i];
      let rz=new Zuordnung();
      rz.fromJSON(z);
      this.zuordnungen.push(rz);
    }

  }
}