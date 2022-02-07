<template>
  <v-app dark>
    <v-navigation-drawer v-model="leftDrawer" clipped fixed app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Services </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="(value, key) in $store.state.workflows"
          :key="key"
          exact
          :to="`/workflow/${key}/`"
        >
          <v-list-item-action>
            <v-icon> mdi-cloud-outline </v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ key }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app dense>
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <v-toolbar-title class="d-flex"> Awsome Doctor 👩‍⚕️ 👨‍⚕️ </v-toolbar-title>

      <v-spacer />

      <!-- Home Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" to="/">
            <v-icon> mdi-home-outline </v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
      <!-- Github Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            href="https://github.com/DiscreteTom/awsome-doctor"
          >
            <v-icon> mdi-github </v-icon>
          </v-btn>
        </template>
        <span>View Source Code</span>
      </v-tooltip>
      <!-- Editor Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" to="/editor">
            <v-icon> mdi-circle-edit-outline </v-icon>
          </v-btn>
        </template>
        <span>Editor</span>
      </v-tooltip>
      <!-- Info Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            href="https://github.com/DiscreteTom/awsome-doctor-core/"
          >
            <v-icon> mdi-information-outline </v-icon>
          </v-btn>
        </template>
        <span> Core Version: {{ coreVersion }} </span>
      </v-tooltip>
      <!-- Share Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="
              $copyText(getUrl()).then(() => $bus.$emit('append-msg', 'Copied'))
            "
          >
            <v-icon> mdi-share-variant </v-icon>
          </v-btn>
        </template>
        <span>Copy Link</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer inset absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <v-snackbars
      :messages.sync="messages"
      :timeout="msgTimeout"
      bottom
      right
      app
    >
      <template v-slot:action="{ close }">
        <timeout-progress
          color="white"
          :width="2"
          :timeout="msgTimeout"
          :rotate="-90"
        >
          <v-btn icon @click="close()">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </timeout-progress>
      </template>
    </v-snackbars>
  </v-app>
</template>

<script>
import VSnackbars from "v-snackbars";
import executor from "awsome-doctor-core";
import TimeoutProgress from "../components/TimeoutProgress.vue";
import executorInfo from "awsome-doctor-core/package.json";

export default {
  components: {
    "v-snackbars": VSnackbars,
    TimeoutProgress,
  },
  data() {
    return {
      leftDrawer: true,
      messages: [],
      msgTimeout: 5000,
    };
  },
  methods: {
    getUrl() {
      return window.location.href;
    },
  },
  computed: {
    coreVersion() {
      return executorInfo.version;
    },
  },
  async mounted() {
    this.$bus.$on("append-msg", (e) => this.messages.push(e));
    this.$bus.$on("configure-aws", (arg) => {
      executor.configure({ ...arg, region: this.$store.state.region });
      this.$bus.$emit("append-msg", "AWS SDK configured.");
    });

    // restore ak/sk from local storage
    if (typeof Storage !== "undefined") {
      let ak = localStorage.getItem("tempAk");
      let sk = localStorage.getItem("tempSk");
      if (ak && sk) {
        this.$store.commit("updateConfig", {
          persistCredentials: true,
          tempAk: ak,
          tempSk: sk,
        });
        this.$bus.$emit("configure-aws", {
          accessKeyId: ak,
          secretAccessKey: sk,
        });
      }
    }
    this.$store.commit("updateConfig", { loadingCredentials: false });

    // show msg when new content available
    const workbox = await window.$workbox;
    if (workbox) {
      workbox.addEventListener("installed", (event) => {
        if (event.isUpdate) {
          this.$bus.$emit(
            "append-msg",
            "New content available. Please refresh this page."
          );
        }
      });
    }
  },
};
</script>
