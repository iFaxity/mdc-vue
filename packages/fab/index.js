import Fab from "./fab.vue";
import "@material/fab/mdc-fab.scss";

export { Fab };
export function install(Vue) {
  Vue.component(Fab.name, Fab);
}