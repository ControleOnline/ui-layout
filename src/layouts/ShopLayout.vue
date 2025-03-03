<template>
  <q-layout view="lHh lpr lFf" class="bg-image">
    <Header />

    <q-toolbar class="tool-bar q-pa-none q-ma-none"> <Menu /></q-toolbar>
    <q-page-container>
      <router-view :key="key" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Header from "@controleonline/ui-layout/src/components/Header.vue";

import Menu from "@controleonline/ui-shop/src/components/menu/Menu.vue";

export default {
  name: "ShopLayout",
  components: { Menu, Header },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "people/isLoading",
    }),
  },
  data() {
    return { searchTerm: "", key: 0 };
  },
  created() {
    let search = decodeURIComponent(this.$route.params.q);
    if (search != "undefined") this.searchTerm = search;
  },
  watch: {
    $route: {
      handler: function (current, preview) {
        this.key++;
      },
      deep: true,
    },
  },
  methods: {
    searchMethod() {
      if (this.searchTerm == "")
        this.$router.push({
          name: "HomeIndex",
        });
      else
        this.$router.push({
          name: "ShopSearch",
          params: { q: this.searchTerm },
        });
    },
  },
};
</script>
<style>
.tool-bar {
  margin-top: 65px;
}
</style>
