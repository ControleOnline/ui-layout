import * as types from './mutation_types';

export default {
  [types.SET_COLORS](state, colors) {
    state.colors = colors;
    return 'colors';
  },

  [types.SET_MENUS](state, menus) {
    state.menus = menus;
    return 'menus';
  },
};
