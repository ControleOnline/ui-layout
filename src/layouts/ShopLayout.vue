<template>
  <q-layout view="lHh lpr lFf" class="bg-image">
    <q-header elevated class="shadow-2 q-pa-sm">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-toolbar-title>
          <!-- Aqui vai a logomarca do cliente -->
          Controle Online
        </q-toolbar-title>

        <q-space />

        <q-input dark dense standout class="q-ml-md" style="min-width:30%;">
          <template v-slot:append>
            <q-icon name="search" />
            <q-icon class="cursor-pointer" />
          </template>
        </q-input>

        <q-space />

        <q-btn size="14px" label="Minha conta" icon="person" no-caps flat stack>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/shop/login">
                <q-item-section>Iniciar sessão</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Criar uma conta</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!--
            Para este button precisa criar o contador de itens adicionados no carrinho
            e na sessão itens do carrinho precisa listar os itens adicionados ao carrinho
          -->
        <q-btn size="14px" label="Meu carrinho" icon="pershopping_cartson" no-caps flat stack>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/shop/login">
                <q-item-section>Itens do carrinho</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

      </q-toolbar>

      <q-toolbar>
        Aqui vai as categorias do menu
      </q-toolbar>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ShopLayout",
  components: {},

  methods: {
    style() {
      if (this.defaultCompany && this.defaultCompany.background) {
        return "min-height: 125vh;background-image: url('//" + this.defaultCompany.theme.background.domain + this.defaultCompany.theme.background.url + "')";
      }
    },
  },

  mounted() {
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "people/isLoading",
    })
  },
  data() {
    return {
    };
  },
};
</script>