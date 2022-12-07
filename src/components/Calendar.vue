<template>
  <div class="row">
    <div class="col-md-12">
      <br />
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary" @click="saveState">Save</button>
        <button type="button" class="btn btn-secondary" @click="loadState">Load</button>
      </div>
    </div>
  </div>
  <div class="row">

    <div class="col-md-10">
      <FullCalendar :options="calendarOptions" ref="calendar" />
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
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import BootStrapClasses from "../BootStrapClasses.js";
import Collectors from "../../test-data/collectors";
import Tasks from "../../test-data/tasks";

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
        headerToolbar: {
          left: '',
          center: 'title',
          right: 'prev,today,next resourceTimelineDay,resourceTimelineWeek'
        },
        resourceAreaColumns: [
          {
            headerContent: 'Collectors'
          }
        ],
        resourceAreaWidth: '15%',
        resources: [],
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
        slotMinWidth: 20,
        slotDuration: "00:10:00",
        slotMinTime: "08:00:00",
        slotMaxTime: "18:00:00",
        eventDragStop: this.eventDragStop,
        eventReceive: this.eventReceive,
      },
      collectors: Collectors,
      tasks: Tasks,
    };
  },
  methods: {
    initialSetup() {
      this.calendarOptions.resources = this.collectors.map(collector => ({
        id: collector.id,
        title: collector.name,
        eventColor: (BootStrapClasses[collector.id % 6]).code
      }));

      //make tasks draggable
      var ele = this.$refs[`taskContainer`]
      new Draggable(ele, {
        itemSelector: '.card'
      });
    },

    eventDragStop(info) {
      this.$alert('Event Removed');
      this.tasks.find(x => x.id == info.event._def.publicId).assigned = false;
      info.event.remove();
    },
    eventReceive(info) {
      this.$alert('Event Added');
      this.tasks.find(x => x.id == info.event._def.publicId).assigned = true;
    },

    saveState() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem('events', JSON.stringify(this.$refs.calendar.getApi().getEvents()));
    },
    loadState() {
      try {
        this.tasks = JSON.parse(localStorage.getItem('tasks'));
        var data = JSON.parse(localStorage.getItem('events'));
        this.calendarOptions.events = data
      }
      catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.initialSetup();
  },
};
</script>