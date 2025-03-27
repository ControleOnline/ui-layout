<template>
  <q-layout view="lHh Lpr lFf" class="bg-image" :style="style">
    <q-page-container>
      <router-view :key="key" />
    </q-page-container>
    <bottomCart :show="false"/>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import bottomCart from "@controleonline/ui-orders/src/vue/components/cart/bottomCart";

export default {
  name: "MainLayout",
  components: {
    bottomCart,
  },

  methods: {
    ...mapActions({}),
  },

  mounted() {},
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "people/isLoading",
    }),
    style() {
      if (this.defaultCompany && this.defaultCompany?.theme?.background) {
        let style = {
          "min-height": "calc(100vh / var(--zoom-level))",
        };
        if (this.$route.name === "LoginIndex")
          style["background-image"] =
            "url('//" +
            this.defaultCompany?.theme?.background.domain +
            this.defaultCompany?.theme?.background.url +
            "')";
        return style;
      }
    },
  },
  watch: {
    $route: {
      handler: function (current, preview) {
        this.key++;
      },
      deep: true,
    },
    isLoading(isLoading) {
      if (isLoading) this.$q.loading.show();
      else this.$q.loading.hide();
    },
  },
  data() {
    return {
      key: 0,
    };
  },
};
</script>
<style lang="sass" scoped>
.pageloader
  position: relative
  text-align: center
  margin-top: 300px
.logo-container
  width: 100%

.current-logo
  display: block
  margin: auto
  margin-top: 3px
  max-height: 100%
  max-width: 140px
.logo-container a
  margin: auto
.main-logo
  display: block
  margin-top: 3px
  max-width: 100%
  max-height: 100%
.bg-image
  background-position: center !important
  background-repeat: no-repeat !important
  background-size: cover !important
</style>
