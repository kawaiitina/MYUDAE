import { createApp } from "vue";
import { Quasar } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/dist/quasar.css";
import { createPinia } from "pinia";
import App from "./App.vue";

createApp(App)
  .use(Quasar, {
    plugins: {},
  })
  .use(createPinia())
  .mount("#app");
