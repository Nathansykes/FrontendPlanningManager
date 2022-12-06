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
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">Region</a>
            <div class="dropdown-menu">
              <a class="dropdown-item">South Yorkshire</a>
              <a class="dropdown-item">Shropshire</a>
              <a class="dropdown-item">Lancashire</a>
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
      <Calendar v-if="(this.view == 0)" />
      <Map v-if="(this.view == 1)" />
    </div>
    <div id="alertContainer">
      <div v-for="alert in alerts" :key="alert">
        <Alert :msg="alert.msg" :type="alert.type" :id="alert.id" />
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue';
import Map from './components/Map.vue';
import Alert from './components/Alert.vue';


export default {
  name: 'App',
  components: {
    Calendar,
    Map,
    Alert,
  },
  data() {
    return {
      view: 0,
    }
  },
  methods: {
    changeView(viewIndex) {
      this.view = viewIndex;
      this.$alert('changed view')
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