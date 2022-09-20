export default class Zuordnung{
  constructor(){
    this.kursZuteilung=[];
  }

  ordneZu(teilnehmer,kurs){
    kursZuteilung[teilnehmer.index]=kurs.index;
  }

  fromJSON(data){
    this.kursZuteilung=data.kursZuteilung;
  }

  getStatistik(projekt){
    let anzWahlen=projekt.getAnzahlWahlen();
    let strafen=projekt.getStrafen();
    let wahlen=[];
    for(let i=0;i<anzWahlen+1;i++){
      wahlen[i]={
        name: i===anzWahlen? "keine Wahl" : (i+1)+". Wahl",
        count: 0,
        strafe: 0
      };
    }
    for(let i=0;i<projekt.teilnehmer.length;i++){
      let z=this.kursZuteilung[i];
      let k=projekt.kurse[z];
      if(k){
        let w=projekt.teilnehmer[i].getWahl(k);
        if(w>=0 && w<anzWahlen){
          wahlen[w].count++;
        }else{
          wahlen[anzWahlen].count++;
        }
      }else{
        wahlen[anzWahlen].count++;
      }
    }
    let strafeGesamt=0;
    for(let i=0;i<Math.min(wahlen.length,strafen.length);i++){
      let s=wahlen[i].count*strafen[i];
      wahlen[i].strafe=s;
      strafeGesamt+=s;
    }
    return {
      total: {
        strafe: strafeGesamt,
        count: projekt.teilnehmer.length
      },
      wahlen: wahlen
    };
  }

  getKurse(kurse,teilnehmer){
    let gruppen={};
    let ohneKurs=[];
    for(let i=0;i<teilnehmer.length;i++){
      ohneKurs.push(true);
    }

    for(let i=0;i<this.kursZuteilung.length;i++){
      let z=this.kursZuteilung[i];
      let k=kurse[z];
      if(k){
        let t=teilnehmer[i];
        if(!gruppen[k.id]){
          gruppen[k.id]=[];
        }
        gruppen[k.id].push(t);
        ohneKurs[i]=false;
      }
    }
    let array=[];
    for(let i=0;i<kurse.length;i++){
      let k=kurse[i];
      let g=gruppen[k.id];
      if(!g) g=[];
      array.push({
        kurs: k,
        teilnehmer: g
      });
    }

    /**Teilnehmer ohne Kurs: */
    let ohne=[];
    for(let i=0;i<teilnehmer.length;i++){
      if(ohneKurs[i]){
        ohne.push(teilnehmer[i]);
      }
    }
    array.push({
      kurs: null,
      teilnehmer: ohne
    });
    return array;
  }
}