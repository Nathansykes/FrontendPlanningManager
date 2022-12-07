<template>
    <div class="row">
        <div class="col-md-12">
            <br />
        </div>
    </div>
    <div class="row">
        <div class="col-md-2">
            <h3 class="text-center">Collectors</h3>
            <br />
            <div :ref="'taskContainer'" style="overflow-y:scroll; height: 78vh;">
                <div v-for="collector in this.collectors" :key="collector" :value="collector" class="card text-white mb-3"
                :class="`bg-${collector.color}`">
                <div class="card-header">{{ collector.name }}</div>
                <div class="card-body">
                    <p class="card-text">ID: {{ collector.id }}</p>
                </div>
                </div>
            </div>
        </div>
        <div class="col-md-8" style="margin-top: 4.5%">
            <div class="row">
                <div id="map" style="height: 66vh;"></div>
            </div>
            <div class="row">
                <section class="time-line-box">
                    <div class="swiper-container text-center"> 
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="timestamp"><span class="date">09:15am</span></div>
                                <div class="status"><span>Pickup 1</span></div>
                            </div>
                            <div class="swiper-slide">
                                <div class="timestamp"><span class="date">11:20am</span></div>
                                <div class="status"><span>Pickup 2</span></div>
                            </div>
                            <div class="swiper-slide">
                                <div class="timestamp"><span class="date">2:30am</span></div>
                                <div class="status"><span>Pickup 3</span></div>
                            </div>
                            <div class="swiper-slide">
                                <div class="timestamp"><span class="date">4:30am</span></div>
                                <div class="status"><span>Pickup 4</span></div>
                            </div>
                        </div>
                    </div>
            </section>
            </div>
        </div>
        <div class="col-md-2">
            <h3 class="text-center">Tasks</h3>
            <br />
            <div :ref="'taskContainer'" style="overflow-y:scroll; height: 78vh;">
                <div v-for="task in this.tasks.filter(x => x.assigned == false)" :key="task.id" :value="task.id"
                class="card bg-primary mb-3 task-card" :data-event="JSON.stringify(task)">
                    <div class="card-header">{{ task.title }}</div>
                    <div class="card-body">
                        <p class="card-text">
                        {{ task.client }} <br />
                        {{ task.location }} <br />
                        {{ task.postcode }}
                        </p>
                    </div>
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

export default {
    name: "app",
    data() {
        return {
            loading: false,
            location: "",
            access_token: process.env.VUE_APP_MAP_ACCESS_TOKEN,
            center: [0.1276, 51.5072],
            map: {},
            start: [-2.526614, 53.055115],
            collectors: Collectors,
            tasks: Tasks,
            coordinates: [],
        }
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
                `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
                });
            }

            this.map.on('load', () => {
                // make an initial directions request that
                // starts and ends at the same location
                this.plotMap(start, start, index);

                // Add starting point to the map
                this.map.addLayer({
                    id: 'point',
                    type: 'circle',
                    source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                            type: 'Point',
                            coordinates: start
                            }
                        }
                        ]
                    }
                    },
                    paint: {
                    'circle-radius': 10,
                    'circle-color': '#3887be'
                    }
                });
            });            
        },
        copyLocation() {
            if (this.location) {
                navigator.clipboard.writeText(this.location);
                alert("Location Copied")
            }
            return;
        },
    },
    mounted() {
        this.createMap()

        this.coordinates.push(this.start);
        this.coordinates.push([-2.180499,52.996990]);
        this.coordinates.push([-2.107938,52.573309]);
        this.coordinates.push([-2.458325,52.666138]);
        this.coordinates.push([-2.749057,52.702633]);
        this.coordinates.push(this.start);

        this.map.on('load', () => {
            
            this.coordinates.map((coords, index) => this.plotMap(this.coordinates[index - 1] || this.start, coords, index));

            var plots = [
            {
                coordinates: this.coordinates[0],
                title : 'Home'
            },
            {
                coordinates : this.coordinates[1],
                title : 'Pickup 1'
            },
            {
                coordinates: this.coordinates[2],
                title : 'Pickup 2'
            },
            {
                coordinates: this.coordinates[3],
                title : 'Pickup 3'
            },
            {
                coordinates: this.coordinates[4],
                title : 'Pickup 4'
            }];

            this.map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
                if (error) throw error;
                this.map.addImage('custom-marker', image);
                // Add a GeoJSON source with 2 points
                var features = [];
                plots.map(plot => 
                {
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
            });
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
  margin-top: 2.5vh;
  display: inline-flex;
}

.swiper-container::-webkit-scrollbar{
  height: 2px;
}

.swiper-slide {
  width: 200px;
}
</style>