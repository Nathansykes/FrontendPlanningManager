import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.config.globalProperties.alerts = [];
app.config.globalProperties.$alert = function (message, type = 'alert-primary', time = 5000) {
    let index = this.alerts.length;
    let id = `alert-${index}`;
    var item = { msg: message, type: type, id: id };
    this.alerts.push(item);
    setTimeout(() => {
        document.getElementById('close-' + id).click();
    }, time);
}


app.mount('#app')