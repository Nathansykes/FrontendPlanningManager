<template>
  <div id="home">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand">Scheduler</a>
        <div class="navbar-nav me-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">View</a>
            <div class="dropdown-menu">
              <a class="dropdown-item" @click="changeView(0)">Calendar</a>
              <a class="dropdown-item" @click="changeView(1)">Map</a>
              <a class="dropdown-item" @click="changeView(2)">Collaboration</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">Region</a>
            <div class="dropdown-menu">
              <a class="dropdown-item" v-for="region in regions" :key="region.id" @click="changeRegion(region.id)">{{region.name}}</a>
            </div>
          </li>
        </div>
        <div class="navbar-nav mr-auto">
          <li id="currUser" class="nav-item">
            <form>
              <a class="nav-link">Tonderai Maswera</a>
            </form>
          </li>
          <li class="nav-item">
            <a class="nav-link">Logout <i class="bi bi-box-arrow-right"></i></a>
          </li>
        </div>
      </div>
    </nav>
    <div id="view" class="container-fluid">
      <Calendar v-if="(this.view == 0)" :region="this.$selectedRegion" :key="calendarKey"/>
      <Map v-if="(this.view == 1)" />      
      <Collaboration v-if="(this.view == 2)"/>
    </div>
    <div id="alertContainer">
      
    </div>
    <div class="toast-container" id="toastContainer">

    </div>
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue';
import Map from './components/Map.vue';
import Collaboration from './components/Collaboration.vue';
import Regions from '../test-data/regions';

export default {
  name: 'App',
  components: {
    Calendar,
    Map,
    Collaboration,
  },
  data() {
    return {
      regions: Regions,
      view: 0,
      calendarKey: 0,
    }
  },
  methods: {
    changeView(viewIndex) {
      this.view = viewIndex;
      
    },
    changeRegion(region) {
      this.$selectedRegion = region;
      this.calendarKey++;
      this.$toast('Region Changed', `Region changed to ${Regions[region].name}`)
    },
  }
}
</script>

<style lang="scss">
@import './assets/bootstrap-theme.scss';
@import './assets/all.css';
@import "~bootstrap/scss/bootstrap.scss";
@import 'bootstrap/dist/css/bootstrap.min.css';
</style>