import Teilnehmer from "./teilnehmer";
import Kurs from "./kurs";

export default class Projekt{
  constructor(name){
    this.name=name;
    this.teilnehmer=null;
    this.kurse=null;
    this.settings={
      anzWahlen: 4,
      strafen: "0;10;30;60"
    };
  }

  fromJSON(data){
    this.name=data.name;
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
    
    for(let i=0;i<this.kurse.length;i++){
      let k=this.kurse[i];
      k.restoreTeilnehmer(this.teilnehmer);
    }
  }
}