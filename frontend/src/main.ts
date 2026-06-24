import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
  faChevronRight,
  faCircleUser,
  faCreditCard,
  faDesktop,
  faDownload,
  faFileInvoiceDollar,
  faGear,
  faGlobe,
  faHome,
  faLaptop,
  faLock,
  faMoneyBillWave,
  faNetworkWired,
  faPowerOff,
  faRotate,
  faServer,
  faShieldHalved,
  faSliders,
  faUnlockKeyhole,
  faUserGroup,
  faWifi
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./styles/main.css";

library.add(
  faBell,
  faChevronRight,
  faCircleUser,
  faCreditCard,
  faDesktop,
  faDownload,
  faFileInvoiceDollar,
  faGear,
  faGlobe,
  faHome,
  faLaptop,
  faLock,
  faMoneyBillWave,
  faNetworkWired,
  faPowerOff,
  faRotate,
  faServer,
  faShieldHalved,
  faSliders,
  faUnlockKeyhole,
  faUserGroup,
  faWifi
);

createApp(App).component("FontAwesomeIcon", FontAwesomeIcon).use(createPinia()).use(router).mount("#app");
