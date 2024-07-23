<template>
  <q-list class="q-pa-md">
    <q-expansion-item
      :content-inset-level="0.3"
      class="home-menu"
      :icon="mItem.icon"
      :label="mItem.label"
      v-for="(mItem, mIndex) in menus"
      :key="mItem.id"
      default-opened
    >
      <div class="row q-col-gutter-md">
        <div
          class="q-pa-md col-6 col-md-2 col-lg-2 col-xl-2 d-flex justify-center"
          v-for="(item, index) in mItem.menus"
          :key="index"
        >
          <q-card
            class="icon-card"
            @click="click(item)"
            :style="{
              backgroundColor: getCardBackground(
                mIndex.toString() + index.toString()
              ),
            }"
          >
            <q-card-section class="q-pa-md">
              <q-avatar class="big-icon">
                <q-icon :name="item.icon" color="white" size="50px" />
              </q-avatar>
            </q-card-section>
            <q-card-section class="q-pa-md">
              <div class="text-center larger-text text-weight-medium text-white">{{ $t(item.label) }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
    menus() {
      return this.$copyObject(this.$store.getters["theme/menus"]);
    },
  },
  created() {},
  methods: {
    ...mapActions({}),
    routeExists(routeName) {
      return this.$router.options.routes.some((route) => {
        if (route.children)
          return route.children.some((child) => routeName === child.name);
      });
    },
    click(route) {
      this.$emit("clickmenu", route);
      this.$router.push({ name: route.route });
    },
    getCardBackground(index) {
      const colors = [
        "#ee3e4f", // Vermelho Carmim
        "#43c4a6", // Verde Água
        "#00d2c1", // Turquesa
        "#6058cc", // Roxo Lavanda
        "#1975ec", // Azul Real
        "#2a5780", // Azul Escuro
      ];
      return colors[parseInt(index) % colors.length];
    },
  },
};
</script>

<style scoped>
.icon-card {
  cursor: pointer;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1;
}

.home-menu {
  width: 100%;
}

.big-icon {
  margin: auto;
}

.larger-text {
  font-size: 1.2em;
}

.q-card-section {
  padding: 10px;
  flex-grow: 1;
}
</style>
