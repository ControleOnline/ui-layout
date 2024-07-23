<template>
  <q-toggle size="lg" v-model="darkMode" unchecked-icon="light_mode" icon="nightlight" />
</template>

<script>
import Config from "@controleonline/quasar-legacy-ui/ui-common/src/utils/config";

export default {
  components: {
    Config,
  },

  data() {
    return {
      darkMode: false,
      config: new Config(),
    };
  },

  created() {
    let mediaQueryObj = window.matchMedia("(prefers-color-scheme: dark)");
    let isDarkMode = mediaQueryObj.matches;
    let darkMode = this.config.getConfig("darkMode");
    this.darkMode = darkMode == undefined ? isDarkMode : darkMode;
  },

  watch: {
    darkMode(darkMode) {
      this.$q.dark.set(darkMode);
      this.config.setConfig("darkMode", darkMode);
    },
  },
};
</script>
