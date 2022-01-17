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
            href="https://github.com/DiscreteTom/awsome-doctor-view"
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
      :timeout="5000"
      top
      right
      app
    ></v-snackbars>
  </v-app>
</template>

<script>
import VSnackbars from "v-snackbars";
import executor from "../executor-core";

export default {
  components: {
    "v-snackbars": VSnackbars,
  },
  data() {
    return {
      leftDrawer: true,
      messages: [],
    };
  },
  methods: {
    getUrl() {
      return window.location.href;
    },
  },
  mounted() {
    this.$bus.$on("append-msg", (e) => this.messages.push(e));
    this.$bus.$on("configure-aws", (arg) => {
      executor.configure({ ...arg, region: this.$store.state.region });
      this.messages.push("AWS SDK configured.");
    });
  },
};
</script>
