<template>
  <q-layout view="lHh lpr lFf" class="bg-image">
    <q-header class="q-pa-none q-ma-none">
      <q-toolbar>
        <q-toolbar-title>
          <div class="q-gutter-sm items-center row logo-shop">
            <router-link v-bind:to="'/'" tag="a" class="primary">
              <img
                v-if="defaultCompany.logo"
                :src="
                  '//' + defaultCompany.logo.domain + defaultCompany.logo.url
                "
                class="q-pa-sm shop-logo"
              />
            </router-link>
          </div>
        </q-toolbar-title>

        <q-space />

        <q-input
          dense
          class="q-ml-md"
          v-model="searchTerm"
          style="min-width: 30%"
          @keyup.enter="searchMethod"
        >
          <template v-slot:append>
            <q-icon name="search" color="black" @click="searchMethod" />
            <q-icon class="cursor-pointer" @click="searchMethod" />
          </template>
        </q-input>

        <q-space />

        <q-btn size="14px" label="Minha conta" icon="person" no-caps flat stack>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section
                  v-if="this.$auth.isLogged"
                  @click="this.$auth.logout()"
                  >Deslogar</q-item-section
                >
                <q-item-section v-else @click="this.$auth.toLogin()"
                  >Iniciar sessão</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Meus Pedidos</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!--
            Para este button precisa criar o contador de itens adicionados no carrinho
            e na sessão itens do carrinho precisa listar os itens adicionados ao carrinho
          -->
        <q-btn
          size="14px"
          label="Meu carrinho"
          icon="pershopping_cartson"
          no-caps
          flat
          stack
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/cart">
                <q-item-section>Itens do carrinho</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <q-toolbar class="q-pa-none q-ma-none"> <Menu /></q-toolbar>
    </q-header>
    <q-page-container>
      <router-view :key="key" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Menu from "@controleonline/ui-shop/src/components/menu/Menu.vue";

export default {
  name: "ShopLayout",
  components: { Menu },
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
.shop-logo {
  height: 80px;
  width: auto;
}
</style>
