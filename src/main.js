import { createApp } from 'vue';
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from './i18n'


i18n(createApp(App)).use(router).use(store).mount('#app')
