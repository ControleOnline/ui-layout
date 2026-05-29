import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";


export default {
  namespaced: true,
  state: {
    item: {},
    items: [],
    colors: {},
    menus: [],
  },
  getters,
  mutations,
  actions
};
