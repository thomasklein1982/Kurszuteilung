import { createRangeArray, randomize } from "../lib/helper";

export default class Zuordnung{
  constructor(projekt){
    this.projekt=projekt;
    this.kursZuteilung=[];
  }

  getCopy(){
    let z=new Zuordnung(this.projekt);
    let data=JSON.stringify(this);
    z.fromJSON(data);
    return z;
  }

  paste(zuordnung){
    let data=JSON.stringify(zuordnung);
    data=JSON.parse(data);
    this.fromJSON(data);
  }

  ordneZu(teilnehmer,kurs){
    this.kursZuteilung[teilnehmer.index]=kurs.index;
  }

  toJSON(){
    return {
      kursZuteilung: this.kursZuteilung
    };
  }

  fromJSON(data){
    this.kursZuteilung=data.kursZuteilung;
  }

  calcStrafe(){
    let s=this.getStatistik();
    return s.total.strafe;
  }

  getStatistik(){
    let anzWahlen=this.projekt.getAnzahlWahlen();
    let strafen=this.projekt.getStrafen();
    let wahlen=[];
    for(let i=0;i<anzWahlen+1;i++){
      wahlen[i]={
        name: i===anzWahlen? "keine Wahl" : (i+1)+". Wahl",
        count: 0,
        strafe: 0
      };
    }
    for(let i=0;i<this.projekt.teilnehmer.length;i++){
      let z=this.kursZuteilung[i];
      let k=this.projekt.kurse[z];
      if(k){
        let w=this.projekt.teilnehmer[i].getWahl(k);
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
        count: this.projekt.teilnehmer.length
      },
      wahlen: wahlen
    };
  }

  weitersuchen(besteStrafe){
    let strafe=0;
    let z=new Zuordnung(this.projekt);
    let nochFrei=[];
    for(let i=0;i<this.projekt.kurse.length;i++){
      let k=this.projekt.kurse[i];
      nochFrei[i]=k.maxTeilnehmer;
    }
    let anzWahlen=this.projekt.getAnzahlWahlen();
    let strafen=this.projekt.getStrafen();
    /**Algorithmus:
     * 1. Fuelle alle Kurse bis zur Mindest-Teilnehmerzahl
     * 2. Bringe uebrige Teilnehmer in zufaellige Reihenfolge
     * 3. fuer alle Teilnehmer in dieser Reihenfolge:
     *  a) bestimme Anziehung der gewaehlten Kurse auf diesen TN
     *  b) ordne den TN nach dieser Verteilung einer seiner Wahlen zu
     */
     let teilnehmer=this.projekt.getTeilnehmerCopy();
    /**fuellen bis zur Mindestzahl */
    
    /**zufaellige Reihenfolge */
    let order=randomize(createRangeArray(0,teilnehmer.length-1));
    /** teilnehmer in dieser Reihenfolge zuordnen:*/
    for(let i=0;i<teilnehmer.length;i++){
      let index=order[i];
      let t=teilnehmer[index];
      let wahl=t.getBesteWahl(nochFrei);
      let s;
      if(wahl){
        z.ordneZu(t,wahl.kurs);
        nochFrei[wahl.kurs.index]--;
        s=strafen[wahl.wahlIndex];
      }else{
        s=strafen[strafen.length-1];
      }
      strafe+=s;
      if(strafe>besteStrafe){
        return -1;
      }
      // let w=Math.random();
      // let sum=0;
      // for(let i=0;i<anzWahlen;i++){
      //   sum+=anziehungen[i];
      //   if(w<=sum){
      //     let wahl=wahlen[i];

      //   }
      // }
    }
    this.paste(z);
    return strafe;
  }

  

  calcAnziehungen(t){
    let array=[];
    let anzWahlen=this.projekt.getAnzahlWahlen();
    let sum=0;
    for(let i=0;i<anzWahlen;i++){
      let a=Math.pow(2,anzWahlen-i-1);
      array.push(a);
      sum+=a;
    }
    for(let i=0;i<anzWahlen;i++){
      array[i]=array[i]/sum;
    }
    return array;
  }

  getKurse(){
    let kurse=this.projekt.kurse;
    let teilnehmer=this.projekt.teilnehmer;
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