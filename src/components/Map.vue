<template>
    <div class="row">
        <div class="col-md-12" v-for="region in regions" :key="region.id">
            <h4 v-if="(region.id == this.region)" style="margin-top: 1rem; margin-bottom: 0rem"> 
                {{region.name}}
                {{(this.date)}} 
            </h4>
        </div>
    </div>
    <div class="row">
        <div class="col-md-2" style="margin-top: 2vh">
            <div class="alert alert-primary">
                <h3 class="text-center">Collectors</h3>
                <br />
                <div :ref="'taskContainer'" style="overflow-y:auto; height: 73.2vh;">
                    <div v-for="collector in this.collectors" :key="collector" :value="collector"
                        class="card text-white mb-3" style="cursor: pointer" @click="selectCollector(collector.id)"
                        :class="`bg-${collector.color}`">
                        <div class="card-header">{{ collector.name }}</div>
                        <div class="card-body">
                            <p class="card-text">ID: {{ collector.id }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-10" style="margin-top: 2vh;">
            <div class="row" style="margin-right: 1vh;">
                <div id="map" style="height: 76vh;"></div>
            </div>
            <div class="row" style="margin-right: 1vh;">
                <div v-if="(this.events.length > 0)">
                    <section class="time-line-box">
                        <div class="swiper-container text-center"> 
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="(event, index) in this.events" :key="index">
                                    <div class="timestamp"><span class="date">{{new Date(event.event.start).getHours() + ":" + new Date(event.event.start).getMinutes()}}</span></div>
                                    <div class="status" @click="this.map.flyTo({center: event.event.extendedProps.coordinates, zoom : 14});"><span>{{event.event.title}}</span></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div v-else class="alert alert-dismissible alert-danger" style="margin-top: 2vh">
                    <strong>No events!</strong> This collector has no collections for today..
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import BootStrapClasses from "../BootStrapClasses.js";
import Collectors from "../../test-data/collectors";
import Tasks from "../../test-data/tasks";
import Regions from '../../test-data/regions';

export default {
    name: "app",
    data() {
        return {
            loading: false,
            location: "",
            access_token: process.env.VUE_APP_MAP_ACCESS_TOKEN,
            center: [-1.495063, 53.372188],
            map: {},
            start: [-1.495063, 53.372188],
            collectors: Collectors.filter(x => x.region == this.region).map(x => function () {
                x.color = (BootStrapClasses[x.id % 6]).name;
                return x;
            }()),
            tasks: Tasks.filter(x => this.$getRegion(x.postcode) == this.region),
            coordinates: [],
            selectedCollector: 1,
            events: [],
            regions: Regions,
            date: new Date()
        }
    },
    props: {
        region: Number,
    },
    methods: {
        async createMap() {
            try {
                mapboxgl.accessToken = this.access_token;
                this.map = new mapboxgl.Map({
                    container: "map",
                    style: "mapbox://styles/mapbox/streets-v11",
                    center: this.center,
                    zoom: 8,
                });

                let geocoder = new MapboxGeocoder({
                    accessToken: this.access_token,
                    mapboxgl: mapboxgl,
                    marker: false,
                });

                this.map.addControl(geocoder);
                this.map.addControl(new mapboxgl.NavigationControl());

                geocoder.on("result", (e) => {
                    const marker = new mapboxgl.Marker({
                        draggable: true,
                        color: "#D80739",
                    })
                    .setLngLat(e.result.center)
                    .addTo(this.map);

                    this.center = e.result.center;

                    marker.on("dragend", (e) => {
                        this.center = Object.values(e.target.getLngLat());
                    });
                });
            }
            catch (err) {
                console.log("map error", err);
            }
        },
        async getLocation() {
            try {
                this.loading = true;
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.center[0]},${this.center[1]}.json?access_token=${this.access_token}`);
                this.loading = false;
                this.location = response.data.features[0].place_name;
            }
            catch (err) {
                this.loading = false;
                console.log(err);
            }
        },
        async plotMap(start, end, index) {

            const query = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
                { method: 'GET' }
            );
            const json = await query.json();
            const data = json.routes[0];
            const route = data.geometry.coordinates;
            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: route
                }
            };
            // if the route already exists on the map, we'll reset it using setData
            if (this.map.getSource('route' + index)) {
                this.map.getSource('route' + index).setData(geojson);
            }
            // otherwise, we'll make a new request
            else {
                this.map.addLayer({
                    id: 'route' + index,
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': this.getCollectorEvents()[0]?.collector?.eventBackgroundColor,
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });
            }
        },
        copyLocation() {
            if (this.location) {
                navigator.clipboard.writeText(this.location);
                alert("Location Copied")
            }
            return;
        },

        async selectCollector(id) {
            this.selectedCollector = id;
            let routes = this.map.getStyle().layers.filter(x => x.id.includes('route'));

            for(let i = 0; i < routes.length; i++) {
                this.map.removeLayer('route' + i);
                this.map.removeSource('route' + i);
            }
            if(this.map.getSource('points'))
            {
                this.map.removeLayer('points');
                this.map.removeSource('points');
            }
            
            await this.setCoordinates(id);

            this.plotRoute();
            this.setPlots();
        },

        getCollectorEvents(){
            var calendar = JSON.parse(localStorage.getItem('calendar-' + this.region));
            var events = calendar.filter(x => x.collector.id == this.selectedCollector);
            events = events.sort((a, b) => new Date(a.event.start) - new Date(b.event.start))
            return events;
        },
        

        async setCoordinates() {
            this.coordinates = [];
            this.events = this.getCollectorEvents();
            var postcodes = this.events.map(x => x.event?.extendedProps?.postcode);

            if (this.events[0].collector.extendedProps?.startPostcode) {
                this.start = await this.getCoordinatesFromPostcode(this.events[0].collector.extendedProps?.startPostcode, 0);
            }

            this.coordinates.push(this.start);

            for (let i = 0; i < postcodes.length; i++) {
                await this.setCoordinatesFromPostcode(postcodes[i], i);
            }

            this.coordinates.push(this.start);

        },
        async getCoordinatesFromPostcode(postcode) {
            try {
                let query = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode}.json?access_token=${mapboxgl.accessToken}`,
                    { method: 'GET' }
                )
                var data = await query.json();
                let coordinates = data.features[0].geometry.coordinates;
                if (coordinates) {
                    return coordinates;
                }
            }
            catch {
                // probs not a real postcode
            }
        },
        async setCoordinatesFromPostcode(postcode, i) {
            await this.getCoordinatesFromPostcode(postcode).then((coordinates) => {
                if (coordinates) {
                    this.coordinates.push(coordinates);
                    this.events[i].event.extendedProps.coordinates = coordinates;
                }
            });
        },
        plotRoute() {
            this.coordinates.map((coords, index) => this.plotMap(this.coordinates[index - 1] || this.start, coords, index));
        },
        setPlots(){
            let plots = this.coordinates.map((coords, index) => {
                if (index == 0) 
                {
                    return {
                        coordinates: coords,
                        title: 'Start'
                    }
                }
                else
                {
                    return {
                        coordinates: coords,
                        title: 'Collection ' + index
                    }
                }
            })

            var features = [];
                plots.map(plot => {
                    features.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': plot.coordinates,
                        },
                        'properties': {
                            'title': plot.title
                        }
                    });
                })

                this.map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': features,
                    }
                });

                // Add a symbol layer
                this.map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'custom-marker',
                        // get the title name from the source's "title" property
                        'text-field': ['get', 'title'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                });
        },
    },


    mounted() {
        this.createMap();
        this.selectCollector(0);
        
        var calendar = JSON.parse(localStorage.getItem('calendar-' + this.region));
        this.date = new Date(calendar[0].event.start).toLocaleDateString();

        this.map.on('load', () => {
            this.map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
                if (error) throw error;
                this.map.addImage('custom-marker', image);                
            });
            this.plotRoute();
            this.setPlots();            
        });
    },
}
</script>

<style scoped>

.time-line-box {
    margin-top: 2vh;
    height: 10vh;
}

.time-line-box .timeline {
  display: flex;
  text-align: center;
}

.time-line-box .timestamp {
  margin-bottom: 5px;
}

.time-line-box .status {
  padding: 0px 10px;
  display: flex;
  justify-content: center;
  border-top: 3px solid #648FFF;
  position: relative;
}

.time-line-box .status :hover{
    cursor: pointer;
    border-top: 3px solid black;
}

.time-line-box .status span {
  padding-top: 8px;
}
.time-line-box .status span:before {
  content: '';
  width: 12px;
  height: 12px;
  background-color: #648FFF;
  border-radius: 12px;
  border: 2px solid #648FFF;
  position: absolute;
  left: 50%;
  top: 0%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  transition: all 200ms ease-in;
}

.swiper-container {
  width: 95%; 
  margin: auto;
  overflow-y: auto;
}
.swiper-wrapper{
  display: inline-flex;
}

.swiper-container::-webkit-scrollbar{
  height: 2px;
}

.swiper-slide {
  width: 200px;
}
</style>