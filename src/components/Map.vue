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

        </div>
        <div class="col-md-8" style="margin-top: 5%">
            <div id="map" style="height: 600px"></div>
        </div>
        <div class="col-md-2">
            <h3 class="text-center">Tasks</h3>
            <br />

        </div>
    </div>
</template>

<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default {
    name: "app",
    data() {
        return {
            loading: false,
            location: "",
            access_token: process.env.VUE_APP_MAP_ACCESS_TOKEN,
            center: [0, 0],
            map: {},
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
                    zoom: 11,
                });

                let geocoder = new MapboxGeocoder({
                    accessToken: this.access_token,
                    mapboxgl: mapboxgl,
                    marker: false,
                });

                this.map.addControl(geocoder);

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
    },
}
</script>
