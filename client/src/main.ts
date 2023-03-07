import { createApp } from 'vue'
import { createPinia } from 'pinia'
import BootstrapVue3 from 'bootstrap-vue-3';
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';


import store  from './stores/store';
import App    from './App.vue'
import router from './router';


const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(BootstrapVue3);
app.use(BootstrapIconsPlugin);
app.use(store);



app.mount('#app')
