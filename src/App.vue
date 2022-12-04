<template>
  <div>
    <select @change="changeView($event)">
      <option>Calendar</option>
      <option>Map</option>
    </select>
    <Calendar v-if="(this.view === 'Calendar')"/>
    <Map v-if="(this.view === 'Map')"/>
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue';
import Map from './components/Map.vue';

export default {
  name: 'App',
  components: {
    Calendar,
    Map,
  },
  data() {
    return {
      view : "Calendar",
    }
  },
  methods: {
    changeView(event)
      {
        this.view = event.target.value;
      },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
