import * as types from "./mutation_types";

export default {
  [types.SET_COLORS](state, payload) {
    if (!payload?.colors) Object.assign(state, { colors: payload });
    return { ...state, colors: payload?.colors || payload };
  },

  [types.SET_MENUS](state, payload) {
    if (!payload?.menus) Object.assign(state, { menus: payload });
    return { ...state, menus: payload?.menus || payload };
  },
};
