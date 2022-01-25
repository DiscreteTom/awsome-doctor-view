<template>
  <div>
    <v-text-field
      v-model="tempAk"
      label="Access Key Id"
      hide-details
      class="my-3"
    />
    <v-text-field
      v-model="tempSk"
      label="Secret Access Key"
      type="password"
      hide-details
      class="my-3"
    />
    <v-text-field
      v-model="region"
      label="Region Code"
      placeholder="us-east-1"
      hide-details
      class="my-3"
    />

    <v-checkbox
      v-if="webStorageSupported"
      v-model="persist"
      color="red"
      hide-details
      class="my-3"
    >
      <template v-slot:label>
        <span :style="`color:${persist ? 'red' : 'unset'}`">
          Store AK/SK in Local Storage. DO NOT check this if you don't know what
          you are doing!
        </span>
      </template>
    </v-checkbox>

    <v-btn class="mr-2" @click="save" color="primary"> Save </v-btn>
    <v-btn class="mr-2" @click="restoreForm"> Restore </v-btn>
    <v-btn class="mr-2" @click="clearForm"> Clear </v-btn>
    <v-btn
      class="mr-2"
      v-if="$store.state.persistCredentials"
      @click="clearPersistedCredentials"
    >
      Clear Local Storage
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      region: "us-east-1",
      tempAk: "",
      tempSk: "",
      persist: false,
      webStorageSupported: false,
    };
  },
  methods: {
    restoreForm() {
      this.region = this.$store.state.region;
      this.tempAk = this.$store.state.tempAk;
      this.tempSk = this.$store.state.tempSk;
      this.persist = this.$store.state.persistCredentials;
    },
    clearForm() {
      this.region = "";
      this.tempAk = "";
      this.tempSk = "";
    },
    save() {
      this.$store.commit("updateConfig", {
        region: this.region,
        tempAk: this.tempAk,
        tempSk: this.tempSk,
      });
      this.$bus.$emit("append-msg", "Saved");

      if (this.webStorageSupported) {
        if (this.persist) {
          localStorage.setItem("tempAk", this.tempAk);
          localStorage.setItem("tempSk", this.tempSk);
          this.$store.commit("updateConfig", { persistCredentials: true });
          this.$bus.$emit("append-msg", "Credentials stored in Local Storage.");
        } else {
          if (this.$store.state.persistCredentials)
            this.clearPersistedCredentials();
        }
      }

      this.$bus.$emit("configure-aws", {
        accessKeyId: this.tempAk,
        secretAccessKey: this.tempSk,
      });
    },
    clearPersistedCredentials() {
      if (this.webStorageSupported) {
        localStorage.removeItem("tempAk");
        localStorage.removeItem("tempSk");
        this.$store.commit("updateConfig", { persistCredentials: false });
        this.$bus.$emit("append-msg", "Local Storage cleared.");
      }
    },
  },
  mounted() {
    this.restoreForm();
    this.webStorageSupported = typeof Storage !== "undefined";
  },
};
</script>
