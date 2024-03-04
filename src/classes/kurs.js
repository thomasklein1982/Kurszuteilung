export default class Kurs{
  constructor(angebot,zeitslot){
    this.angebot=angebot;
    this.zeitslot=zeitslot;
    this.teilnehmer=[];
    this.teilnehmerNachWahl=[];
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
    let w=t.getWahl(this.angebot);
    while(this.teilnehmerNachWahl.length<=w){
      this.teilnehmerNachWahl.push([]);
    }
    this.teilnehmerNachWahl[w].push(t);
    this.teilnehmer.push(t);
  }

  getTeilnehmer(index){
    return this.teilnehmer[index];
  }

  getAnzahlTeilnehmer(){
    return this.teilnehmer.length;
  }

  getAnzahlTeilnehmerNachWahl(wahl){
    if(this.teilnehmerNachWahl.length<wahl){
      return 0;
    }else{
      return this.teilnehmerNachWahl[wahl-1].length;
    }
  }

  hatNochPlatz(){
    return this.teilnehmer.length<this.angebot.maxTeilnehmer;
  }

  getFreiePlaetze(){
    return this.angebot.maxTeilnehmer-this.teilnehmer.length;
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