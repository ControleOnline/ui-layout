<template>
  <div v-if="pageLoading" class="row">
    <div class="col-12 pageloader">
      <q-spinner color="primary" class="q-uploader__spinner" />
    </div>
  </div>
  <q-layout
    v-else-if="isSuperAdmin && !disabled"
    view="lHh Lpr fff"
    class="bg-image"
  >
    <q-header elevated height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md menu-button"
        />
        <div class="q-gutter-sm items-center row logo-container">
          <router-link
            v-if="this.$q.screen.gt.sm && myCompany && myCompany.logo"
            v-bind:to="'/'"
            tag="a"
          >
            <img
              :src="'//' + myCompany.logo.domain + myCompany.logo.url"
              class="current-logo"
            />
          </router-link>
          <img
            v-else-if="myCompany && myCompany.logo"
            :src="'//' + myCompany.logo.domain + myCompany.logo.url"
            class="current-logo"
          />
        </div>
        <div
          class="q-gutter-sm row items-center no-wrap current-logo-container"
        >
          <q-toolbar class="">
            <MyCompanies />
          </q-toolbar>
        </div>
        <div v-if="this.$q.screen.gt.sm" class="q-gutter-sm items-center row">
          <q-item
            v-ripple
            :style="
              'color:' + ($route.meta.color || 'var(--q-color-secondary)')
            "
          >
            <q-item-section avatar v-if="$route.meta.icon">
              <q-icon class="item-icon" :name="$route.meta.icon" />
            </q-item-section>
            <q-item-section no-wrap>
              <q-item-label class="module-tittle">{{
                $t("route." + this.$route.name)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div
          class="q-gutter-sm row items-center no-wrap current-user-container"
        >
          <Notifications />
          <!-- DarkMode -->
          <q-btn icon="account_circle" flat round>
            <q-tooltip>{{ $t("menu.myacount") }}</q-tooltip>
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">{{ $t("menu.myacount") }}</div>
                  <q-list>
                    <q-item :to="{ name: 'UserProfile' }" exact>
                      <q-item-section avatar>
                        <q-icon name="face" />
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{ $t("menu.myprofile") }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :to="{ name: 'CompanyIndex' }" exact>
                      <q-item-section avatar>
                        <q-icon name="business" />
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{ $t("menu.mycompany") }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :to="{ name: 'MenuIndex' }" exact>
                      <q-item-section avatar>
                        <q-icon name="business" />
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{ $t("menu.configs") }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-stretch justify-between">
                  <div class="text-center">
                    <q-avatar size="64px">
                      <q-img :src="user.avatar || gravatar" />
                    </q-avatar>
                  </div>

                  <div class="text-body2 text-center">
                    {{ user.realname || "John Doe" }}
                  </div>

                  <q-btn
                    v-close-popup
                    color="primary"
                    label="Sair"
                    size="sm"
                    @click="onLogout"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="270">
      <q-scroll-area class="fit">
        <q-toolbar class="q-pa-md">
          <q-toolbar-title class="text-center">
            <q-avatar size="100px" class="vertical-middle menu-avatar">
              <router-link v-bind:to="'/'" tag="a" class="primary">
                <img
                  v-if="defaultCompany.logo"
                  :src="
                    '//' + defaultCompany.logo.domain + defaultCompany.logo.url
                  "
                  class="q-pa-sm main-logo"
                />
              </router-link>
            </q-avatar>
          </q-toolbar-title>
        </q-toolbar>

        <div class="q-pt-md q-px-sm column">
          <q-list padding>
            <q-item
              v-if="isSimple() == false"
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
                {{ $t("menu.dashboard") }}
              </q-item-section>
            </q-item>
            <q-separator inset class="q-my-sm" />
            <Menu
              v-if="isSimple() != true"
              :context="'super_admin'"
              :people="this.user.people"
              @clickmenu="onClickmenu"
            />
          </q-list>
        </div>
        <div class="q-pt-xl q-px-sm column pull-button">
          <DarkMode />
          <Language />
        </div>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="GPL__page-container">
      <q-scroll-observer horizontal @scroll="onScroll"></q-scroll-observer>
      <div>
        <div v-if="!this.$q.screen.gt.sm">
          <q-item v-ripple>
            <q-item-section avatar v-if="$route.meta.icon">
              <q-icon :name="$route.meta.icon" />
            </q-item-section>
            <q-item-section no-wrap>
              {{ $t("route." + this.$route.name) }}
            </q-item-section>
          </q-item>
        </div>
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
  <div v-else class="row">
    <div class="col-12 pageloader">
      <MyCompanies />
      <span>Você não tem permissão para acessar este aplicativo</span><br />
      <q-btn color="primary" label="Sair" size="sm" @click="onLogout" />
    </div>
  </div>
</template>

<script>
import Menu from "@controleonline/ui-common/src/components/Common/Menu";
import MyCompanies from "@controleonline/ui-common/src/components/Common/MyCompanies";
import Notifications from "@controleonline/ui-legacy/ui-common/src/components/Common/Notifications.vue";
import DarkMode from "@controleonline/ui-layout/src/components/DarkMode/darkModeToggle.vue";
import Language from "@controleonline/ui-legacy/ui-common/src/components/Language/languageToogle.vue";
import acl from "@controleonline/ui-legacy/ui-common/src/utils/acl";
import md5 from "md5";
import { LocalStorage } from "quasar";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AdminLayout",

  components: {
    Menu,
    MyCompanies,
    DarkMode,
    Language,
    Notifications,
  },

  data() {
    return {
      notifications: {
        count: 0,
      },
      ACL: new acl(this.$route),
      disabled: false,
      isAdmin: false,
      permissions: [],
      pageLoading: true,
      leftDrawerOpen: false, //this.$q.screen.gt.sm,
    };
  },

  created() {
    this.discoveryMyCompanyies();
    if (this.defaultCompany) {
      this.pageLoading = false;
    }
  },

  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "people/isLoading",
      myCompany: "people/currentCompany",
    }),

    user() {
      let user = this.$store.getters["auth/user"] || {};
      return user;
    },
    style() {
      return "background: #182840";
    },
    gravatar() {
      if (this.user.email === undefined) {
        return "";
      }
      return `https://www.gravatar.com/avatar/${md5(this.user.email)}?s=400`;
    },
    isSuperAdmin() {
      return this.myCompany
        ? Object.values(this.myCompany.permission).indexOf("super") != -1 ||
            Object.values(this.myCompany.permission).indexOf("franchisee") != -1
        : false;
    },
  },

  watch: {
    isLoading(isLoading) {
      if (isLoading) this.$q.loading.show();
      else this.$q.loading.hide();
    },
    defaultCompany(data) {
      this.verifyPermissions();
      this.pageLoading = false;
    },
  },

  methods: {
    ...mapActions({
      getCompanies: "people/myCompanies",
    }),
    onClickmenu() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    onScroll(info) {
      if (info.position > 0) this.leftDrawerOpen = false;
    },
    isSimple() {
      return this.defaultCompany.domainType === "simple";
    },
    setMyCompanies(data) {
      this.companies = data;
      this.discoveryIfEnabled();
    },
    verifyPermissions() {
      this.defaultCompany?.permissions?.forEach((item) => {
        if (this.permissions.indexOf(item) === -1) {
          this.permissions.push(item);
          if (
            item.indexOf("franchisee") !== -1 ||
            item.indexOf("salesman") !== -1 ||
            item.indexOf("super") !== -1 ||
            item.indexOf("admin") !== -1
          ) {
            this.isAdmin = true;
          }
        }
      });
    },
    discoveryIfEnabled() {
      if (this.companies) {
        let disabled = true;
        let user_disabled = true;
        this.companies.forEach((company) => {
          user_disabled = !company.user.enabled;
          if (
            company.enabled &&
            company.user.employee_enabled &&
            !user_disabled
          ) {
            if (!this.myCompany)
              this.$store.dispatch("people/currentCompany", company);
            disabled = false;
          }
          company.permission.forEach((item) => {
            if (this.permissions.indexOf(item) === 1) {
              this.permissions.push(item);
            }
          });
        });
        this.disabled = user_disabled || disabled;
      }
    },
    discoveryMyCompanyies() {
      this.getCompanies().then((response) => {
        this.setMyCompanies(response.data);
      });
    },
    onLogout() {
      this.$store.dispatch("auth/logOut");
      this.$router.push("/login");
    },
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
  min-height: 50px
  height: 50px
  max-height: 100%
  max-width: 140px
.logo-container a
  margin: auto
.main-logo
  display: block
  margin-top: 3px
  min-height: 50px
  height: 50px
  max-width: 100%
  max-height: 100%
.bg-image
  background-position: center !important
  background-repeat: no-repeat !important
  background-size: cover !important
</style>
