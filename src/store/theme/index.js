import * as getters from "./getters";
import mutations from "./mutations";

export default {
  namespaced: true,
  state: {
    colors: {},
    menus:{},
  },
  getters,
  mutations,
};
