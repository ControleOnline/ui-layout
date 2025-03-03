<template>
  <div v-if="isLoading" class="row">
    <div class="col-12 pageloader">
      <q-spinner color="primary" class="q-uploader__spinner" />
    </div>
  </div>
  <q-layout
    v-else-if="isAdmin && !disabled"
    view="lHh Lpr fff"
    class="bg-image"
  >
    <Header />
    <q-page-container class="GPL__page-container">
      <router-view />
    </q-page-container>
  </q-layout>
  <div v-else-if="companies.length > 0" class="row">
    <div class="col-12 pageloader">
      <MyCompanies />
      <span>Você não tem permissão para acessar este aplicativo</span><br />
      <q-btn color="primary" label="Sair" size="sm" @click="onLogout" />
    </div>
  </div>
  <div v-else class="row">
    <div class="col-12 pageloader">
      <Company />
    </div>
  </div>
</template>

<script>
import Header from "@controleonline/ui-layout/src/components/Header.vue";
import MyCompanies from "@controleonline/ui-common/src/components/Common/MyCompanies";
import { mapActions, mapGetters } from "vuex";
import Company from "@controleonline/ui-common/src/components/Common/Company.vue";
export default {
  name: "AdminLayout",

  components: {
    MyCompanies,
    Company,
    Header,
  },

  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      companies: "people/companies",
    }),
    isLoading() {
      return this.$store.getters["acl/isLoading"];
    },
    isAdmin() {
      return this.$store.getters["acl/isAdmin"];
    },
    disabled() {
      return this.$store.getters["acl/disabled"];
    },
  },
  created() {},
  watch: {
    /* 
    isLoading(isLoading) {
      if (isLoading) this.$q.loading.show();
      else this.$q.loading.hide();
    },
    */
    isAdmin(isAdmin) {
      console.log("isAdmin", isAdmin);
    },
  },

  methods: {
    ...mapActions({}),
    onLogout() {
      this.$auth.logout();
    },
  },
};
</script>

<style lang="sass" scoped>
.pageloader
  position: relative
  text-align: center
  margin-top: 300px
.bg-image
  background-position: center !important
  background-repeat: no-repeat !important
  background-size: cover !important
</style>
