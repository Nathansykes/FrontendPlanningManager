<template>
  <div class="row">
    <div class="col-md-12">
      <br />
    </div>
  </div>
  <div class="row">

    <div class="col-md-10">
      <FullCalendar :options="calendarOptions" />
    </div>
    <div class="col-md-2">
      <h3 class="text-center">Tasks</h3>
      <br />
      <div :ref="'taskContainer'" style="overflow-y:scroll; height: 78vh;">
        <div v-for="task in this.tasks" :key="task.id" :value="task.id" class="card bg-primary mb-3 task-card"
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
import Collectors from "../../test-data/collectors";
import Tasks from "../../test-data/tasks";

export default {
  name: "app",
  components: {
    FullCalendar, // make the FullCalendar tag available
  },
  data() {
    return {
      calendarOptions: this.getCalendarOptions(),
      collectors: Collectors,
      tasks: Tasks
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

    eventDragStop(e) {
      this.$alert('Event Removed');
      e.event.remove();      
    },

    getCalendarOptions() {
      return {
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
      };
    },
  },
  mounted() {
    this.initialSetup();
  },
};
</script>