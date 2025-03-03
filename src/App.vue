<template>
  <div>
    <Analytics />
    <ThemeConfig />
    <Translate />
    <router-view v-if="defaultCompany" />
  </div>
</template>
<script>
import Analytics from "@controleonline/ui-common/src/components/Common/Analytics";
import ThemeConfig from "@controleonline/ui-layout/src/layouts/ThemeConfig";
import Translate from "@controleonline/ui-common/src/components/Common/Translate";
import { mapActions, mapGetters } from "vuex";
import Config from "@controleonline/ui-common/src/utils/config";
import { APP_ENV } from "@controleonline/../../config/env.js";

export default {
  components: {
    Analytics,
    ThemeConfig,
    Translate,
    Config,
  },
  name: "App",
  data() {
    return {
      config: new Config(),
      icons: [],
    };
  },
  methods: {
    ...mapActions({
      setIndexRoute: "auth/setIndexRoute",
      peopleDefaultCompany: "people/defaultCompany",
    }),

    getDarkMode() {
      let mediaQueryObj = window.matchMedia("(prefers-color-scheme: dark)");
      let isDarkMode = mediaQueryObj.matches;
      let darkMode = this.config.getConfig("darkMode");

      this.$q.dark.set(darkMode == undefined ? isDarkMode : darkMode);

      this.$watch(
        () => this.$q.dark.isActive,
        (darkMode) => {
          this.config.setConfig("darkMode", darkMode);
        }
      );
    },
    setZoom() {
      let zoom = parseFloat(APP_ENV.ZOOM || 0.8);
      var size = zoom < 1 ? parseFloat(100 / zoom) : 100;
      document.documentElement.style.setProperty("--zoom-width", size + "vw");
      document.documentElement.style.setProperty("--zoom-height", size + "vh");
      document.documentElement.style.setProperty("--zoom-level", zoom);
    },
    setIcon() {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/ico";
      link.href = process.env.API_ENTRYPOINT + "/files/1/download";
      document.head.appendChild(link);
    },
  },
  created() {
    this.getDarkMode();
    this.setIcon();
    this.setIndexRoute();
    this.peopleDefaultCompany();
    this.setZoom();
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
    }),
  },
};
</script>
<style>
#q-app,
.q-menu.q-position-engine {
  transform: scale(var(--zoom-level)) !important;
  transform-origin: top left;
}

#q-app {
  width: calc(100vw / var(--zoom-level)) !important;
  height: calc(100vh / var(--zoom-level)) !important;
  overflow: auto;
}
</style>
