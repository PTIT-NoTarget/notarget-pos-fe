import { createApp } from "vue";
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { POSITION } from "vue-toastification/src/ts/constants";

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

export default {
  install(app: ReturnType<typeof createApp>) {
    app.use(Toast, options);
  },
};
