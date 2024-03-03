export default class Kurs{
  constructor(angebot,zeitslot){
    this.angebot=angebot;
    this.zeitslot=zeitslot;
    this.teilnehmer=[];
  }

  getAngebotName(){
    return this.angebot.name;
  }

  getAngebotId(){
    return this.angebot.getId();
  }

  getZeitslot(){
    return this.zeitslot;
  }

  addTeilnehmer(t){
    this.teilnehmer.push(t);
  }

  getTeilnehmer(index){
    return this.teilnehmer[index];
  }

  getAnzahlTeilnehmer(){
    return this.teilnehmer.length;
  }

  hatNochPlatz(){
    return this.teilnehmer.length<this.angebot.maxTeilnehmer;
  }

  toJSON(){
    let data={
      angebotId: this.angebot.getId(),
      zeitslot: this.zeitslot
    };
    let tn=[];
    for(let i=0;i<this.teilnehmer.length;i++){
      tn.push(this.teilnehmer[i].getIndex())
    }
    data.teilnehmerIndices=tn;
    return data;
  }

  static fromJSON(data,projekt){
    let angebot=projekt.getAngebotById(data.angebotId);
    let z=data.zeitslot;
    let k=new Kurs(angebot,z);
    for(let i=0;i<data.teilnehmerIndices.length;i++){
      let index=data.teilnehmerIndices[i];
      let t=projekt.getTeilnehmer(index);
      k.addTeilnehmer(t);
    }
    return k;
  }
}