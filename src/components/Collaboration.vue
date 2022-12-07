<template>
  <div class="row">
    <div class="col-md-2">
      <h3 class="text-center">Schedulers</h3>
      <br />
      <div :ref="'schedulerContainer'" style="overflow-y: scroll; height: 78vh">
        <div v-for="scheduler in this.schedulers" :key="scheduler.id" :value="scheduler.id" class="card bg-primary mb-3 scheduler-card" :data-event="JSON.stringify(scheduler)">
          <div class="card-header" @click="setSelectedUser(scheduler.id)">{{ scheduler.name }}</div>
          <div class="card-body" @click="setSelectedUser(scheduler.id)">
            <p class="card-text">
              {{ scheduler.id }} <br />
              {{ scheduler.name }} <br />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <div id="peterHistory" v-if="(selectedUser==1)">
        <!-- chats go here -->
        <p class="peter"></p>
        <p class="user1"></p>
      </div>
      <div id="johnHistory" v-if="(selectedUser==2)">
        <!-- chats go here -->
      </div>
      <div id="louiseHistory" v-if="selectedUser==3">
        <!-- chats go here -->
      </div>
      <form class="chat">

        <div v-if="(selectedUser==1)">
          <input id="PeterSmythInput" type="text" placeholder="Message Peter"/>
          <input type="button" @click="this.peterChat()" value="submit" />
        </div>

        <div v-if="(selectedUser==2)">
         <input id="JohnConnorsInput" type="text" placeholder="Message John"/>
         <input type="button" @click="this.johnChat()" value="submit" />
        </div>

        <div v-if="(selectedUser==3)">
          <input id="LouisePitcherInput" type="text" placeholder="Message Louise" />
          <input type="button" @click="this.louiseChat()" value="submit" />
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import Schedulers from "../../test-data/schedulers";
import PeterSmythResponses from "../../test-data/PeterSmythResponses";
import JohnConnorsResponses from "../../test-data/JohnConnorsResponses";
import LouisePitcherResponses from "../../test-data/LouisePitcherResponses"

export default {
  name: "Collaboration",
  data() {
    return {
      schedulers: Schedulers,
      responses1: PeterSmythResponses,
      responses2: JohnConnorsResponses,
      responses3: LouisePitcherResponses,
      count1: 0,
      count2: 0,
      count3: 0,
      selectedUser: 0,
    };
  },
  methods: {
    peterChat() {
      var userInput = document.getElementById("PeterSmythInput").value;
      document.getElementById("peterHistory").append(userInput);
      this.count1++;

      console.log("hit");
      this.responses1.forEach((response) => {
        if (response.id == this.count1) {
          console.log(response.body)
          document.getElementById("peterHistory").append(response.body);
        }
      });
    },
    johnChat() {
      var userInput = document.getElementById("JohnConnorsInput").value;
      document.getElementById("johnHistory").append(userInput);
      this.count2++;

      this.responses2.forEach((response) => {
        if (response.id == this.count2) {
          document.getElementById("johnHistory").append(response.body);
        }
      });
    },
    louiseChat() {
      var userInput = document.getElementById("LouisePitcherInput").value;
      document.getElementById("louiseHistory").append(userInput);
      this.count3++;

      this.responses3.forEach((response) => {
        if (response.id == this.count3) {
          document.getElementById("louiseHistory").append(response.body);
        }
      });
    },
    setSelectedUser(userId) {
      this.selectedUser = userId;
      console.log("selected user is " + this.selectedUser);
    },
  },
};
</script>
