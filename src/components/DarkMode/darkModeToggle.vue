<template>
  <q-toggle
    size="lg"
    v-model="darkMode"
    unchecked-icon="light_mode"
    icon="nightlight"
  />
</template>

<script>
export default {
  data() {
    return {
      darkMode: this.$copyObject(this.$q.dark.isActive),
    };
  },
  watch: {
    darkMode(darkMode) {
      this.$q.dark.set(darkMode);
    },
  },
};
</script>