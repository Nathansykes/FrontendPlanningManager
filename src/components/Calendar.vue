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
    <div class="col-md-8">
      <FullCalendar :options="calendarOptions" />
    </div>
    <div class="col-md-2">
      <h3 class="text-center">Tasks</h3>
      <br />
      <div :ref="'taskContainer'" style="overflow-y:scroll; height: 78vh;">
        <div v-for="task in this.tasks" :key="task.id" :value="task.id" class="card bg-primary mb-3"
          :data-event="JSON.stringify(task)">
          <div class="card-header">{{ task.title }}</div>
          <div class="card-body">
            <p class="card-text">{{ task.location }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import BootStrapClasses from "../BootStrapClasses.js";
import Collectors from "test-data/collectors";
import Tasks from "test-data/tasks";

export default {
  name: "app",
  components: {
    FullCalendar, // make the FullCalendar tag available
  },
  data() {
    return {
      calendarOptions: {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        plugins: [resourceTimelinePlugin, interactionPlugin],
        initialView: "resourceTimeline",
        resourceAreaColumns: [
          {
            headerContent: 'Collectors'
          }
        ],
        resources: Collectors.map(collector => {
          return {
            id: collector.id,
            title: collector.name,
            color: BootStrapClasses[collector.id % 7].code
          }
        }),        
        editable: true,
        selectable: true,
        dropable: true,
        eventStartEditable: true,
        weekends: false,
        now: new Date(),
        eventClick: this.onEventClick,
        events: [],
        ApplicationUser: null,
        contentHeight: 'auto',
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
          startTime: '08:00',
          endTime: '18:00',
        },
        slotMinTime: "07:00:00",
        slotMaxTime: "20:00:00",
      },
      collectors: Collectors,
      tasks: Tasks
    };
  },
  methods: {

    initialSetup() {      
      //make tasks draggable
      var ele = this.$refs[`taskContainer`]
      new Draggable(ele, {
        itemSelector: '.card'
      });

    },
  },
  mounted() {
    this.initialSetup();
  }
};
</script>