<template>
  <template v-if="kurseNachZeitslot">
    <div v-for="(kurse,i) in kurseNachZeitslot">
      <h1>Zeitslot {{ i+1 }}</h1>
      <table>
        <tr><th>Kurs</th><th>ID</th><th>Teilnehmer</th><th v-for="(c,i) in captions">{{ c }}</th></tr>
        <tr v-for="(k,i) in kurse">
          <td>{{k.getAngebotName()}}</td>
          <td>{{k.getAngebotId()}}</td>
          <td>{{ k.getAnzahlTeilnehmer() }} / {{ k.angebot.maxTeilnehmer }}</td>
          <td v-for="(c,j) in captions">{{ -1 }} <span v-if="j<k.angebot.interessenten.length">/ {{ k.angebot.interessenten[j].length }}</span></td>
            
          <!-- <template v-else>
            <td>Ohne Kurs</td>
            <td>--</td>
            <td>{{ k.alleTeilnehmer.length }}</td>
            <td v-for="j in anzahlWahlen+1">--</td>
          </template> -->
          <td><Button icon="pi pi-search" @click="$event=>openDetails(k)"/></td>
        </tr>
      </table>
    </div>
  </template>
  <!-- <Dialog :header="dialogDetails.kurs.kurs? dialogDetails.kurs.kurs.name+' ['+dialogDetails.kurs.kurs.id+']' : 'Ohne Kurszuordnung'" v-model:visible="dialogDetails.show">
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
  </Dialog> -->
</template>

<script>
  export default{
    props: {
      kurseNachZeitslot: Array,
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
          kurs: null//this.kurseNachZeitslot[0].kurs
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