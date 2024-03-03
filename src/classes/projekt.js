import Teilnehmer from "./teilnehmer";
import Angebot from "./angebot";
import Zuordnung from "./zuordnung";

export default class Projekt{
  constructor(){
    this.name="";
    this.slotCount=1;
    this.teilnehmer=null;
    this.angebote=null;
    this.zuordnungen=[];
    this.settings={
      strafen: "0;10;30;60;100"
    };
  }

  setName(name){
    this.name=name;
  }
  setSlotCount(count){
    this.slotCount=count;
  }
  getAnzahlZeitslots(){
    return this.slotCount;
  }
  getTeilnehmer(index){
    return this.teilnehmer[index];
  }

  getAngebotById(id){
    for(let i=0;i<this.angebote.length;i++){
      let k=this.angebote[i];
      if(k.id===id){
        return k;
      }
    }
    return null;
  }

  calc(){
    this.calcInteressentenFuerAngebote();
  }

  calcInteressentenFuerAngebote(){
    let teilnehmer=this.teilnehmer;
    let anzWahlen=this.getAnzahlWahlen();
    let angebote=this.angebote;
    /**alle interessenten zuruecksetzen: */
    for(let j=0;j<angebote.length;j++){
      let k=angebote[j];
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
        if(k){
          k.interessenten[j].push(t);
        }
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
    for(let i=0;i<this.angebote.length;i++){
      let k=this.angebote[i];
      let c=k.getTeilnehmerCountsByWahl(anzWahlen);
      for(let j=0;j<anzWahlen+2;j++){
        counts[j]+=c[j];
      }
    }
    return counts;
  }

  fromJSON(data){
    this.name=data.name;
    this.slotCount=data.slotCount;
    for(let a in this.settings){
      if(a in data.settings){
        this.settings[a]=data.settings[a];
      }
    }
    this.angebote=[];
    for(let i=0;i<data.angebote.length;i++){
      let k=data.angebote[i];
      let rk=new Angebot();
      rk.fromJSON(k,i);
      this.angebote.push(rk);
    }
    this.teilnehmer=[];
    for(let i=0;i<data.teilnehmer.length;i++){
      let t=data.teilnehmer[i];
      let rt=new Teilnehmer(this);
      rt.fromJSON(t,i,this);
      this.teilnehmer.push(rt);
    }
    this.zuordnungen=[];
    for(let i=0;i<data.zuordnungen.length;i++){
      let z=data.zuordnungen[i];
      let rz=new Zuordnung(this);
      rz.fromJSON(z);
      this.zuordnungen.push(rz);
    }

  }
}