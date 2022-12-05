<template>
  <div id="home">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
          <a class="navbar-brand">Scheduler</a>
        <div class="navbar-nav me-auto">

          
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">View</a>
            <div class="dropdown-menu">
              <a class="dropdown-item" @click="changeView(0)">Calendar</a>
              <a class="dropdown-item" @click="changeView(1)">Map</a>
            </div>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Region</a>
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
              <a class="nav-link" >Logout</a>
          </li>
        </div>
      </div>
    </nav>
    <div class="row">
      <div class="col-md-12">

      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        
      </div>
      <div class="col-md-8">
        <Calendar v-if="(this.view == 0)"/>
        <Map v-if="(this.view == 1)"/>
      </div>
      <div class="col-md-2">
        
      </div>
    </div>

    
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
      view : 0,
    }
  },
  methods: {
    changeView(viewIndex)
      {
        this.view = viewIndex;
      },
  }
}
</script>
