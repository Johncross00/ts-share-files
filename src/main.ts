import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { JSON_SERVER_URL } from "../config";

const jsonServerUrl: string = JSON_SERVER_URL;

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

console.log("JSON Server URL:", jsonServerUrl);
console.log("Vite env:", import.meta.env);
