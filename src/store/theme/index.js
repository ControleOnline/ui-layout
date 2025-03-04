import * as getters from "./getters";
import mutations from "./mutations";

export default {
  namespaced: true,
  state: {
 item:{},
items:[],
    colors: {},
    menus:{},
  },
  getters,
  mutations,
};
