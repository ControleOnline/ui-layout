<template>
  <q-layout view="lHh lpr lFf" class="bg-image">
    <q-header class="q-pa-sm">
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

        <q-input dark dense standout class="q-ml-md" style="min-width: 30%">
          <template v-slot:append>
            <q-icon name="search" />
            <q-icon class="cursor-pointer" />
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

      <q-toolbar> <Menu /></q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
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
    return {};
  },
  methods: {
    style() {
      if (this.defaultCompany && this.defaultCompany.background) {
        return (
          "min-height: 125vh;background-image: url('//" +
          this.defaultCompany.theme.background.domain +
          this.defaultCompany.theme.background.url +
          "')"
        );
      }
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
