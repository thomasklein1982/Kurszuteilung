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
      strafen: "0;10;30;60;100"
    };
  }

  calc(){
    this.calcInteressentenFuerKurse();
  }

  calcInteressentenFuerKurse(){
    let teilnehmer=this.teilnehmer;
    let anzWahlen=this.getAnzahlWahlen();
    let kurse=this.kurse;
    /**alle interessenten zuruecksetzen: */
    for(let j=0;j<kurse.length;j++){
      let k=kurse[j];
      k.interessenten=[];
      for(let i=0;i<anzWahlen;i++){
        k.interessenten.push([]);
      }
    }
    
    for(let i=0;i<teilnehmer.length;i++){
      let t=teilnehmer[i];
      let wahlen=t.getWahlen();
      for(let j=0;j<anzWahlen;j++){
        let k=wahlen[j];
        k.interessenten[j].push(t);
      }
    }
  };

  getTeilnehmerCopy(){
    let array=[];
    for(let i=0;i<this.teilnehmer.length;i++){
      let t=this.teilnehmer[i];
      array.push(t);
    }
    return array;
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
    return this.settings.strafen.split(";").length-1;
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
    for(let a in this.settings){
      if(a in data.settings){
        this.settings[a]=data.settings[a];
      }
    }
    this.kurse=[];
    for(let i=0;i<data.kurse.length;i++){
      let k=data.kurse[i];
      let rk=new Kurs(this);
      rk.fromJSON(k,i);
      this.kurse.push(rk);
    }
    this.teilnehmer=[];
    for(let i=0;i<data.teilnehmer.length;i++){
      let t=data.teilnehmer[i];
      let rt=new Teilnehmer(this);
      rt.fromJSON(t,i,this.kurse);
      this.teilnehmer.push(rt);
    }
    this.zuordnungen=[]
    for(let i=0;i<data.zuordnungen.length;i++){
      let z=data.zuordnungen[i];
      let rz=new Zuordnung(this);
      rz.fromJSON(z);
      this.zuordnungen.push(rz);
    }

  }
}