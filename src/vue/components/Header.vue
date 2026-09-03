<template>
  <q-header elevated :height-hint="header.height">
    <q-toolbar class="GPL__toolbar" :style="{ height: header.height + 'px' }">
      <q-btn
        v-if="$appType == 'ERP'"
        flat
        dense
        round
        @click="leftDrawerOpen = !leftDrawerOpen"
        aria-label="Menu"
        icon="menu"
        class="q-mx-md menu-button"
      />
      <div
        v-if="$appType == 'ERP'"
        class="q-gutter-sm items-center row current-logo-container"
      >
        <router-link v-if="myCompany && myCompany.logo" v-bind:to="'/'" tag="a">
          <img
            :src="'//' + myCompany.logo.domain + myCompany.logo.url"
            class="current-logo"
          />
        </router-link>
      </div>

      <div class="q-gutter-sm items-center no-wrap full-width">
        <q-toolbar class="full-width">
          <router-link
            class="main-logo-container"
            v-if="$appType == 'SHOP' && defaultCompany && defaultCompany.logo"
            v-bind:to="'/'"
            tag="a"
          >
            <img
              :src="'//' + defaultCompany.logo.domain + defaultCompany.logo.url"
              class="main-logo"
            />
          </router-link>
          <MyCompanies />
          <div class="company-title" v-if="this.$q.screen.gt.sm">
            {{ myCompany?.alias }}
          </div>
          <div
            v-if="$appType == 'SHOP' && this.$q.screen.gt.xs"
            class="search q-gutter-sm items-center row"
          >
            <q-input
              v-if="$appType == 'SHOP'"
              dense
              class="full-width q-ml-md"
              v-model="searchTerm"
              style="min-width: 30%"
              @keyup.enter="searchMethod"
            >
              <template v-slot:append>
                <q-icon name="search" color="black" @click="searchMethod" />
                <q-icon class="cursor-pointer" @click="searchMethod" />
              </template>
            </q-input>
          </div>
        </q-toolbar>
      </div>
      <div class="q-gutter-sm row items-center no-wrap current-user-container">
        <Notifications />
        <q-btn icon="account_circle" flat round>
          <q-tooltip>{{ $tt("menu", "configs", "myAccount") }}</q-tooltip>
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md text-center">
                  {{ $tt("menu", "configs", "myAccount") }}
                </div>
                <q-list>
                  <q-item
                    v-if="this.isLogged"
                    :to="{
                      name:
                        $appType == 'SHOP' ? 'ClientProfile' : 'UserProfile',
                    }"
                    exact
                  >
                    <q-item-section avatar>
                      <q-icon name="face" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        $tt("menu", "configs", "myProfile")
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="$appType != 'SHOP' && this.isLogged"
                    :to="{ name: 'CompanyIndex' }"
                    exact
                  >
                    <q-item-section avatar>
                      <q-icon name="business" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        $tt("menu", "configs", "myCompany")
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="$appType == 'SHOP' && this.isLogged"
                    :to="{ name: 'ClientOrdersIndex' }"
                    exact
                  >
                    <q-item-section avatar>
                      <q-icon name="orders" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        $tt("menu", "configs", "myOrders")
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="user?.isSuperAdmin"
                    :to="{ name: 'ConfigsIndex' }"
                    exact
                  >
                    <q-item-section avatar>
                      <q-icon name="settings" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        $tt("menu", "configs", "configs")
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item exact>
                    <q-item-section avatar>
                      <router-link
                        v-if="user?.isSuperAdmin"
                        :to="{ name: 'TranslateIndex' }"
                      >
                        <q-icon name="g_translate" />
                      </router-link>
                      <q-icon v-else name="g_translate" />
                    </q-item-section>
                    <q-item-section side>
                      <Language />
                    </q-item-section>
                  </q-item>

                  <div class="text-body2 text-center"></div>
                </q-list>
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column items-stretch justify-between">
                <div class="text-center">
                  <q-avatar size="64px">
                    <q-img
                      :src="
                        this.user.avatar
                          ? this.user.avatar.domain + this.user.avatar.url
                          : gravatar
                      "
                    />
                  </q-avatar>
                </div>
                <div class="text-body2 text-center" v-if="this.isLogged">
                  {{ this.user.realname }}
                </div>
                <div class="text-body2 text-center">
                  <DarkMode />
                </div>
                <div class="text-body2 text-center">
                  <q-btn
                    v-if="this.isLogged"
                    v-close-popup
                    color="primary"
                    :label="$tt('menu', 'configs', 'Logout')"
                    size="sm"
                    @click="onLogout"
                  />
                  <q-btn
                    v-if="!this.isLogged"
                    v-close-popup
                    color="primary"
                    :label="$tt('menu', 'configs', 'Login')"
                    size="sm"
                    @click="
                      () => {
                        this.$router.push({
                          name: 'LoginIndex',
                          query: {
                            redirect: this.$router.currentRoute.value.fullPath,
                          },
                        });
                      }
                    "
                  />
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>

  <q-drawer v-if="$appType == 'ERP'" v-model="leftDrawerOpen" :width="270">
    <q-scroll-area class="fit">
      <q-toolbar class="drawer-logo-toolbar">
        <q-toolbar-title class="text-center drawer-logo-title">
          <router-link
            v-if="defaultCompany && defaultCompany.logo"
            v-bind:to="'/'"
            tag="a"
            class="drawer-logo-link"
          >
            <img
              :src="'//' + defaultCompany.logo.domain + defaultCompany.logo.url"
              class="drawer-logo"
              alt=""
            />
          </router-link>
        </q-toolbar-title>
      </q-toolbar>

      <div class="q-pt-md q-px-sm column">
        <q-list padding>
          <q-item
            v-ripple
            clickable
            class="GNL__drawer-item"
            @click="leftDrawerOpen != leftDrawerOpen"
            :to="{ name: 'DashboardIndex' }"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              {{ $te("menu.dashboard") ? $t("menu.dashboard") : "Painel" }}
            </q-item-section>
          </q-item>
          <q-separator inset class="q-my-sm" />
          <Menu
            :context="'super_admin'"
            :people="this.user"
            @clickmenu="onClickmenu"
          />
        </q-list>
      </div>
    </q-scroll-area>
  </q-drawer>
  <q-scroll-observer horizontal @scroll="onScroll"></q-scroll-observer>
</template>

<script>
import Menu from "@controleonline/ui-common/src/vue/components/Common/Menu";
import Header from "@controleonline/ui-layout/src/vue/components/Header.vue";
import MyCompanies from "@controleonline/ui-common/src/vue/components/Common/MyCompanies";
import Notifications from "@controleonline/ui-common/src/vue/components/Common/Notifications.vue";
import DarkMode from "@controleonline/ui-layout/src/vue/components/DarkMode/darkModeToggle.vue";
import Language from "@controleonline/ui-common/src/vue/components/Language/languageToogle.vue";
import md5 from "md5";
import { mapActions, mapGetters } from "vuex";
import Company from "@controleonline/ui-common/src/vue/components/Common/Company.vue";
export default {
  name: "AdminLayout",

  components: {
    Menu,
    MyCompanies,
    DarkMode,
    Language,
    Notifications,
    Company,
    Header,
  },

  data() {
    return {
      notifications: {
        count: 0,
      },
      searchTerm: "",
      disabled: false,
      header: { height: this.$q.screen.lt.sm ? 64 : 110 },
      pageLoading: true,
      leftDrawerOpen: false, //this.$q.screen.gt.sm,
      route: {
        color: "var(--secondary)",
      },
    };
  },

  created() {
    this.init();
  },

  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "people/isLoading",
      myCompany: "people/currentCompany",
      companies: "people/companies",
      menus: "theme/menus",
      user: "auth/user",
      isLogged: "auth/isLogged",
    }),

    style() {
      return "background: #182840";
    },
    gravatar() {
      if (this.user.email === undefined) {
        return "";
      }
      return `https://www.gravatar.com/avatar/${md5(this.user.email)}?s=400`;
    },
  },

  watch: {
    isLoading(isLoading) {
      if (isLoading) this.$q.loading.show();
      else this.$q.loading.hide();
    },
    defaultCompany(data) {
      //this.verifyPermissions();
    },
    menus() {
      this.getRouteFromMenu(this.$route.name);
    },
    $route() {
      this.route = {
        color: "var(--header-primary)",
      };
      this.getRouteFromMenu(this.$route.name);
    },
  },

  methods: {
    ...mapActions({
      getRoute: "routes/getItems",
      setCurrentModule: "configs/currentModule",
      logOut: "auth/logOut",
    }),
    onScroll(info) {
      if (info.position > 0) this.leftDrawerOpen = false;
    },
    onClickmenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    init() {
      let search = decodeURIComponent(this.$route.params.q);
      if (search != "undefined") this.searchTerm = search;
      this.getRouteFromMenu(this.$route.name);
    },
    getRouteFromMenu(routeName) {
      if (!Array.isArray(this.menus)) return;
      this.menus.forEach((category) => {
        if (Array.isArray(category.menus)) {
          const foundMenu = category.menus.find((m) => m.route === routeName);
          if (foundMenu) {
            this.route = foundMenu;
            this.setCurrentModule(this.route.module);
            return;
          }
        }
      });

      if (!this.route.name)
        this.getRoute({ route: routeName }).then((result) => {
          if (result?.lenght > 0) {
            this.route = result[0];
            this.setCurrentModule(this.route.module.replace(/\D/g, ""));
          }
        });
    },
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
    onLogout() {
      this.logOut();
    },
  },
};
</script>

<style lang="sass" scoped>
.company-title
  margin-left: 20px
.main-logo-container
  padding-right: 20px
.current-logo, .main-logo
  display: block
  margin: auto
  margin-top: 3px
  max-height: 100%
  max-width: 140px
.current-logo-container a
  margin: auto
.main-logo
  display: block
  margin-top: 3px
.current-logo-container
  display: flex
  align-items: center
  justify-content: flex-end
  min-width: 140px
  margin-left: auto
.drawer-logo-toolbar
  min-height: 64px
  padding: 8px 16px
  justify-content: center
.drawer-logo-title
  padding: 0
.drawer-logo-link
  display: flex
  align-items: center
  justify-content: center
  width: 100%
.drawer-logo
  display: block
  margin: 0 auto
  max-height: 40px
  max-width: 200px
  width: auto
  height: auto
  object-fit: contain
.search
  position: absolute
  width: 400px
  left: 50%
  margin-left: -200px
</style>
