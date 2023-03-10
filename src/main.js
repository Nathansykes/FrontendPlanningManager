import { createApp, createVNode, render } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Alert from './components/Alert.vue'
import Toast from './components/Toast.vue'
import Message from './components/Message.vue'

const app = createApp(App);

app.config.globalProperties.$selectedRegion = 0;
app.config.globalProperties.$alert = function (message, type = 'alert-primary', time = 5000) {
    let target = document.getElementById('alertContainer').appendChild(document.createElement('div'));
    let id = `alert-${Math.random()}`;
    let data = { msg: message, type: type, id: id };
    let vnode = createVNode(Alert, data);
    render(vnode, target);

    setTimeout(() => {
        var ele = document.getElementById('close-' + id);
        if(ele){ ele.click(); }
    }, time);
}

app.config.globalProperties.$toast = function (title, message, time = 5000) {
    let target = document.getElementById('toastContainer').appendChild(document.createElement('div'));
    let id = `toast-${Math.random()}`;
    let data = { msg: message, title: title, id: id };
    let vnode = createVNode(Toast, data);
    render(vnode, target);

    setTimeout(() => {
        var ele = document.getElementById('close-' + id);
        if(ele){ ele.click(); }
    }, time);
}

app.config.globalProperties.$message = function (title, message, sent, self, userId, ) {
    console.log(userId);
    let target = document.getElementById(`messageContainer-${userId}`).appendChild(document.createElement('div'));
    let id = `message-${Math.random()}`;
    let data = { msg: message, title: title, sent: sent, self: self };
    let vnode = createVNode(Message, data);
    render(vnode, target);
}

app.config.globalProperties.$getRegion = function (postcode){
    let region;
    if(postcode.startsWith('S1')){
        region = 0;
    } else if(postcode.startsWith('L')){
        region = 1;
    } else if(postcode.startsWith('T') || postcode.startsWith('W') || postcode.startsWith('B') || postcode.startsWith('ST') || postcode.startsWith('SY')){
        region = 2;
    }
    return region || 0;
}

app.mount('#app')