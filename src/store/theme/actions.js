import * as types from "./mutation_types";

export const setMenus = ({ commit, getters }, params = {}) => {
  commit(types.SET_MENUS, params);
};

export const setColors = ({ commit, getters }, params = {}) => {
  commit(types.SET_COLORS, params);
}