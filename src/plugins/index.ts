import vuetify from "./vuetify";
import pinia from "../stores";
import router from "../router";
import echart from "./echart";
import toastification from "./toastification";

import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(toastification).use(echart);
}
