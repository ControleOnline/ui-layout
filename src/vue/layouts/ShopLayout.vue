<template>
  <q-layout view="lHh lpr lFf" class="bg-image">
    <Header />
    <q-page-container style="padding-bottom: 20px !important">
      <q-toolbar class="tool-bar q-pa-none q-ma-none sticky-top">
        <Menu />
      </q-toolbar>
      <router-view :key="key" />
    </q-page-container>
    <bottomCart />
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Header from "@controleonline/ui-layout/src/vue/components/Header.vue";
import Menu from "@controleonline/ui-shop/src/vue/components/menu/Menu.vue";
import bottomCart from "@controleonline/ui-orders/src/vue/components/cart/bottomCart";

export default {
  name: "DefaultLayout",
  components: {
    bottomCart,
    Menu,
    Header,
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "people/isLoading",
    }),
  },
  data() {
    return { key: 0 };
  },
  created() {},
  watch: {
    $route: {
      handler: function (current, preview) {
        this.key++;
      },
      deep: true,
    },
  },
  methods: {},
};
</script>
