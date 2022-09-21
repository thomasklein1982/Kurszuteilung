<template>
  <table>
    <tr><th>Wahl</th><th>Anzahl</th><th>%</th><th>Strafe</th></tr>
    <tr v-for="(s,i) in infos.wahlen">
      <td>{{s.name}}</td><td>{{s.count}}</td><td>{{(100*s.count/infos.total.count).toFixed(2)}}%</td><td>{{s.strafe}}</td>
    </tr>
    <tr style="border-top: 2pt solid black">
      <th>Gesamt</th><td>{{infos.total.count}}</td><td>100%</td><td>{{infos.total.strafe}}</td>
    </tr>
  </table>
</template>

<script>
  export default{
    props: {
      projekt: Object,
      zuordnung: Object
    },
    computed: {
      infos(){
        var statistik=this.zuordnung.getStatistik();
        return statistik;
        // var total=counts[counts.length-1];
        // var totalStrafe=0;
        // for(var i=0;i<counts.length-2;i++){
        //   let s=strafen[i]*counts[i];
        //   totalStrafe+=s;
        //   var wahl={
        //     name: (i+1)+". Wahl",
        //     count: counts[i],
        //     percent: (counts[i]*100/total).toFixed(2),
        //     strafe: s
        //   };
        //   wahlen.push(wahl);
        // }
        // let s=strafen[counts.length-2]*counts[counts.length-2];
        // totalStrafe+=s;
        // wahlen.push({
        //   name: "Keine Wahl",
        //   count: counts[counts.length-2],
        //   percent: (counts[counts.length-2]*100/total).toFixed(2),
        //   strafe: s
        // });
        // infos.wahlen=wahlen;
        // infos.total={
        //   count: total,
        //   strafe: totalStrafe
        // }
        // return infos;
      },
      anzWahlen(){
        return this.projekt.getAnzahlWahlen();
      },
      strafen(){
        let w=this.projekt.getStrafen();
        return w;
      }
    }
  }
</script>