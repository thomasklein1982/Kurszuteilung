<template>
  <table v-if="kurse">
    <tr><th>Kurs</th><th>ID</th><th>Teilnehmer</th><th v-for="(c,i) in captions">{{ c }}</th></tr>
    <tr v-for="(k,i) in kurse">
      <template v-if="k.kurs">
        <td>{{k.kurs.name}}</td>
        <td>{{k.kurs.id}}</td>
        <td>{{ k.alleTeilnehmer.length }} / {{ k.kurs.maxTeilnehmer }}</td>
        <td v-for="(g,j) in k.teilnehmer">{{ g.length }} <span v-if="j<k.kurs.interessenten.length">/ {{ k.kurs.interessenten[j].length }}</span></td>
        
      </template>
      <template v-else>
        <td>Ohne Kurs</td>
        <td>--</td>
        <td>{{ k.alleTeilnehmer.length }}</td>
        <td v-for="j in anzahlWahlen+1">--</td>
      </template>
      <td><Button icon="pi pi-search" @click="$event=>openDetails(k)"/></td>
    </tr>
  </table>
  <Dialog :header="dialogDetails.kurs.kurs? dialogDetails.kurs.kurs.name+' ['+dialogDetails.kurs.kurs.id+']' : 'Ohne Kurszuordnung'" v-model:visible="dialogDetails.show">
    <table>
      <tr>
        <th>Nr.</th><th>Nachname</th><th>Vorname</th><th>Stufe</th><th>Wahlen</th>
      </tr>
      <tr v-for="(t,i) in dialogDetails.kurs.alleTeilnehmer">
        <td>{{ i+1 }}</td>
        <td>{{ t.nachname }}</td>
        <td>{{ t.vorname }}</td>
        <td>{{ t.stufe }}</td>
        <td>{{ t.getWahlenIDs().join(', ') }}</td>
      </tr>
    </table>
  </Dialog>
</template>

<script>
  export default{
    props: {
      kurse: Array,
      anzahlWahlen: Number
    },
    computed: {
      captions(){
        let captions=[];
        for(let i=0;i<this.anzahlWahlen;i++){
          captions.push((i+1)+". Wahl");
        }
        captions.push("Nicht gewählt");
        return captions;
      }
    },
    data(){
      return {
        dialogDetails: {
          show: false,
          kurs: this.kurse[0].kurs
        }
      }
    },
    methods: {
      openDetails(kurs){
        this.dialogDetails.kurs=kurs;
        this.dialogDetails.show=true;
      }
    }
  }
</script>