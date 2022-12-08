<template>
  <div class="row">
    <div class="col-md-12">
      <br />
    </div>
  </div>

  <div class="row">
    <div class="col-md-10">
      <button class="btn btn-primary text-white" type="button" data-bs-target="#newCollectorModal" data-bs-toggle="modal"
        title="Add New Collector">
        Add New Collector <i class="bi bi-plus-square"></i></button>
      <div class="row">
        <FullCalendar :options="calendarOptions" ref="calendar" />
      </div>
      <div class="row">
        <div style="display:flex; justify-content:flex-start; margin-top: 2.5vh;">
          <button id="onDropModalButton" class="btn btn-primary text-white" type="button" style="height: 6vh; width: 8vh" data-bs-target="#OnDropModal" data-bs-toggle="modal" title="Add New Task"><i class="bi bi-plus-square"></i></button>
          <button class="btn btn-primary text-white" type="button" style="height: 6vh; width: 10vh; margin-left: 90%;" @click="saveButton">Save</button>
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="alert alert-primary" style="overflow-y:auto; height: 85vh;">
        <div id="tasksHeader" style="margin-top: 5%; display: flex; justify-content: space-between;">
          <h3 class="text-center margin">Tasks</h3>
          <button class="btn btn-primary text-white margin" type="button" data-bs-target="#newTaskModal" data-bs-toggle="modal"
            title="Add New Task"><i class="bi bi-plus-square text-white"></i></button>
        </div>
        <div :ref="'taskContainer'" >
          <div v-if="((this.tasks.filter(x => x.assigned == false)).length <= 0)">
            <div class="alert alert-primary margin">
              Backlog is empty!
            </div>
          </div>
          <div v-else v-for="task in this.tasks.filter(x => x.assigned == false)" :key="task.id" :value="task.id"
            class="card bg-primary mb-3 task-card text-white margin" :data-event="JSON.stringify(task)">
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
  </div>

  <div class="modal" id="newTaskModal" ref="newTaskModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <form v-on:submit.prevent="saveNewTask">
          <div class="modal-header">
            <h5 class="modal-title">Add New Task</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="titleInput" class="form-label mt-4">Title</label>
              <input required type="text" class="form-control" id="titleInput" v-model="this.newTask.title"
                aria-describedby="emailHelp" placeholder="Enter Task Title">
            </div>
            <div class="form-group">
              <label for="clientInput" class="form-label mt-4">Client</label>
              <input required type="text" class="form-control" id="clientInput" v-model="this.newTask.client"
                aria-describedby="emailHelp" placeholder="Enter Client Name">
            </div>
            <div class="form-group">
              <label for="locationInput" class="form-label mt-4">Location</label>
              <input required type="text" class="form-control" id="locationInput" v-model="this.newTask.location"
                aria-describedby="emailHelp" placeholder="Enter Address">
            </div>
            <div class="form-group">
              <label for="postcodeInput" class="form-label mt-4">Postcode</label>
              <input type="text" class="form-control" id="postcodeInput" v-model="this.newTask.postcode"
                aria-describedby="emailHelp" placeholder="Enter Postcode">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
              ref="dismissNewTaskModal">Close</button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal" id="OnDropModal" ref="newTaskModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <form v-on:submit.prevent="addTimeToTask">
          <div class="modal-header">
            <h5 class="modal-title">Add Journey Time</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeTimeModal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <h2>Add Journey Time to beginning of the Collection</h2>
            </div>
            <div class="form-group">
              <label for="timeInput" class="form-label mt-4">Journey Time (Minutes)</label>
              <input required type="number" class="form-control" id="timeInput" v-model="this.addTime.time"
                aria-describedby="emailHelp" placeholder="Time In Minutes">
            </div>
            <p>A 15% margin will be applied.</p>
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
              ref="dismissNewTaskModal">Don't Add Extra Time</button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>



  <div class="modal" id="newCollectorModal" ref="newCollectorModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <form v-on:submit.prevent="saveNewCollector">
          <div class="modal-header">
            <h5 class="modal-title">Add New Collector</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="collectorNameInput" class="form-label mt-4">Name</label>
              <input required type="text" class="form-control" id="collectorNameInput" v-model="this.newCollector.name"
                aria-describedby="emailHelp" placeholder="Enter Collector Name">
            </div>
            <div class="form-group">
              <label for="collectorRegionInput" class="form-label mt-4">Region</label>
              <input required type="text" class="form-control" id="collectorRegionInput"
                v-model="this.newCollector.name" aria-describedby="emailHelp" placeholder="Enter Region Id">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
              ref="dismissNewCollectorModal">Close</button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<script>
import FullCalendar, { Calendar } from "@fullcalendar/vue3";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
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
        contentHeight: '70vh',
        height: '70vh',
        expandRows: true,
        resourceAreaWidth: '15%',
        resources: [],
        editable: true,
        selectable: true,
        eventStartEditable: true,
        weekends: false,
        now: new Date(),
        eventClick: this.onEventClick,
        events: [],
        lastEvent: null,
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
        eventChange: this.eventChange,
        eventOverlap: false,
      },
      collectors: Collectors.filter(x => x.region == this.region),
      tasks: [],
      newTask: {
        title: '',
        client: '',
        location: '',
        postcode: ''
      },
      newCollector: {
        name: '',
        region: '',
      },
      addTime: {
        time: ''
      }
    };
  },
  props: {
    region: Number,
  },
  methods: {
    saveNewTask() {
      this.tasks.push({
        id: this.tasks.length + 1,
        title: this.newTask.title,
        client: this.newTask.client,
        location: this.newTask.location,
        postcode: this.newTask.postcode,
        assigned: false
      });
      this.$alert('New Task Added');
      this.$refs.dismissNewTaskModal.click();
    },

    saveNewCollector() {
      this.collectors.push({
        id: this.collectors.length + 1,
        name: this.newCollector.name,
        region: this.newCollector.region
      });
      
      this.$alert('New Collector Added');
      this.setResources();
      this.$refs.dismissNewCollectorModal.click();
    },
    addTimeToTask() {
      let currentEvent = this.$refs.calendar.getApi().getEventById(this.lastEvent.id);
      let currentStart = currentEvent._instance.range.start;
      let timeToAddMs = this.addTime.time*1.15*60000;
      let newStartMs = currentStart.valueOf() - timeToAddMs;

      currentEvent.setStart(new Date(newStartMs));
      document.getElementById('closeTimeModal').click();
    },


    setResources() {
      this.calendarOptions.resources = Collectors.filter(x => x.region == this.region).map(collector => ({
        id: collector.id,
        title: collector.name,
        eventColor: (BootStrapClasses[collector.id % 6]).code,
        startPostcode: collector.startPostcode,
      }));
    },

    saveButton() {
      this.calendarOptions.resources = Collectors.filter(x => x.region == this.region).map(collector => ({
        id: collector.id,
        title: collector.name,
        eventColor: (BootStrapClasses[collector.id % 6]).code,
        startPostcode: collector.startPostcode,
      }));
    },

    eventChange() {
      this.saveCalendar();
    },

    loadCalendar() {
      let calendarJson = localStorage.getItem('calendar-' + this.region);
      if (calendarJson) {
        this.tasks = JSON.parse(localStorage.getItem('tasks'));
        let events = JSON.parse(calendarJson);
        if (events) {
          events.forEach(x => {
            var eventToAdd = {
              id: x.event.id,
              title: x.event.title,
              start: x.event.start,
              end: x.event.end,
              resourceId: x.collector.id,
              extendedProps: x.event.extendedProps
            }
            this.$refs.calendar.getApi().addEvent(eventToAdd);
          })
        }
      }
    },

    saveCalendar() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      let events = this.$refs.calendar.getApi().getEvents();
      let storeObject = events.map(x => ({
        event: x,
        collector: x.getResources()[0]
      }))
      console.log(storeObject);
      localStorage.setItem('calendar-' + this.region, JSON.stringify(storeObject));
    },

    initialSetup() {
      this.setResources();
      //make tasks draggable
      var ele = this.$refs[`taskContainer`]
      new Draggable(ele, {
        itemSelector: '.card'
      });
    },

    eventDragStop(info) {
      let x = info.jsEvent.pageX;
      let y = info.jsEvent.pageY;
      let rect = this.$refs.calendar.calendar.el.getBoundingClientRect();
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.tasks.find(x => x.id == info.event._def.publicId).assigned = false;
        info.event.remove();
        this.$alert('Event Removed');
      }
      this.saveCalendar();
    },
    eventReceive(info) {
      document.getElementById("onDropModalButton").click();
      this.$alert('Event Added');
      this.tasks.find(x => x.id == info.event._def.publicId).assigned = true;
      this.lastEvent = info.event;

      this.calendarOptions.resources.map(resource => {
        if (resource.id == info.event._def.resourceIds[0]) {
          resource.eventColor = "grey";
        }
      });

      this.saveCalendar();
    },
  },
  mounted() {
    this.initialSetup();
    this.loadCalendar();

    this.tasks = Tasks.filter(x => this.$getRegion(x.postcode) == this.region);
  },
};
</script>

<style scoped>
.margin {
  margin: 5%;
}
</style>