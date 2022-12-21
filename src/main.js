import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';

import App from "./App.vue";
import router from "./router";
import setupPrimevue from "./setupPrimevue";

import 'primevue/resources/themes/saga-blue/theme.css';       //theme
import 'primevue/resources/primevue.min.css';                 //core css
import 'primeicons/primeicons.css';                           //icons

import "./assets/main.css";
import "./assets/print.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

setupPrimevue(app);

app.mount("#app");
