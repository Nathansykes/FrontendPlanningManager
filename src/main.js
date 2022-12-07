import { createApp, createVNode, render } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Alert from './components/Alert.vue'
import Toast from './components/Toast.vue'

const app = createApp(App);


app.config.globalProperties.$alert = function (message, type = 'alert-primary', time = 5000) {
    let target = document.getElementById('alertContainer').appendChild(document.createElement('div'));
    let id = `alert-${Math.random()}`;
    let data = { msg: message, type: type, id: id };
    let vnode = createVNode(Alert, data);
    console.log(vnode);
    console.log(target);
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
    console.log(vnode);
    console.log(target);
    render(vnode, target);

    setTimeout(() => {
        var ele = document.getElementById('close-' + id);
        if(ele){ ele.click(); }
    }, time);


}

app.mount('#app')