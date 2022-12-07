<template>
  <br />
  <div class="row">
    <div class="col-md-2">
      <h3 class="text-center">Schedulers</h3>
      <br />
      <div :ref="'schedulerContainer'" style="overflow-y: scroll; height: 78vh">
        <div v-for="scheduler in this.schedulers" :key="scheduler.id" :value="scheduler.id"
          class="card bg-primary mb-3 scheduler-card" :data-event="JSON.stringify(scheduler)">
          <div class="card-header" @click="setSelectedUser(scheduler.id)">{{ scheduler.name }}</div>
          <div class="card-body" @click="setSelectedUser(scheduler.id)">
            <p class="card-text">
              Last Online: 1 min ago <br />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-11">
            <h3>Chatting to {{this.schedulers.find(s => s.id == this.selectedUser).name}}</h3>
        </div>
        <div class="col-md-1">
          <a :href="('callto:07' + Math.floor(Math.random() * 9999999999))" class="btn btn-lg btn-success" title="Call"><i class="bi bi-telephone-outbound"></i></a>
          </div>
      </div>

      <div id="messageContainerParent">
        <div :id="`messageContainer-${this.selectedUser}`" v-if="(this.selectedUser == 1)">
          <!-- chats go here -->
        </div>
        <div :id="`messageContainer-${this.selectedUser}`" v-if="(this.selectedUser == 2)">
          <!-- chats go here -->
        </div>
        <div :id="`messageContainer-${this.selectedUser}`" v-if="this.selectedUser == 3">
          <!-- chats go here -->
        </div>

        <form class="chat" v-on:submit.prevent="sendChat">
          <h3 class="hidden" id="typing">{{this.typing}}</h3>
          <div class="input-group mb-3">
            <input required v-model="this.userInput" type="text" class="form-control" placeholder="Type Message"
              maxlength="100" />
            <div class="input-group-append">
              <button class="btn btn-primary" type="submit">Send</button>
            </div>
          </div>
        </form>
      </div>
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
      selectedUser: 1,
      userInput: '',
      typing: '.',
    };
  },
  methods: {
    sendChat() {
      this.$message('You', this.userInput, new Date(), true, this.selectedUser);
      this.userInput = '';
      let response;

      document.getElementById('typing').classList.remove('hidden');      

      setTimeout(() => {
        switch (this.selectedUser) {
          case 1:
            response = PeterSmythResponses[Math.floor(Math.random() * 3)];
            this.$message('Peter', response.body, new Date(), false, this.selectedUser);
            break;
          case 2:
            response = JohnConnorsResponses[Math.floor(Math.random() * 3)];
            this.$message('John', response.body, new Date(), false, this.selectedUser);
            break;
          case 3:
            response = LouisePitcherResponses[Math.floor(Math.random() * 3)];
            this.$message('Louise', response.body, new Date(), false, this.selectedUser);
            break;
        }
        document.getElementById('typing').classList.add('hidden');
      }, 2000);
    },
    setSelectedUser(userId) {
      this.selectedUser = userId;
    }, 
  },
  mounted(){
    setInterval(() => {
        this.typing = this.typing + '.';
        if (this.typing.length > 6) {
          this.typing = '.';
        }
      }, 200);
  }
};
</script>
