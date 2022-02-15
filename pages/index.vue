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
    <v-combobox
      v-model="region"
      :items="Object.values(regionCodes)"
      label="Region Code"
      placeholder="us-east-1: US East (N. Virginia)"
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
      region: "us-east-1: US East (N. Virginia)",
      regionCodes: {
        "us-east-2": "us-east-2: US East (Ohio)",
        "us-east-1": "us-east-1: US East (N. Virginia)",
        "us-west-1": "us-west-1: US West (N. California)",
        "us-west-2": "us-west-2: US West (Oregon)",
        "af-south-1": "af-south-1: Africa (Cape Town)",
        "ap-east-1": "ap-east-1: Asia Pacific (Hong Kong)",
        "ap-southeast-3": "ap-southeast-3: Asia Pacific (Jakarta)",
        "ap-south-1": "ap-south-1: Asia Pacific (Mumbai)",
        "ap-northeast-3": "ap-northeast-3: Asia Pacific (Osaka)",
        "ap-northeast-2": "ap-northeast-2: Asia Pacific (Seoul)",
        "ap-southeast-1": "ap-southeast-1: Asia Pacific (Singapore)",
        "ap-southeast-2": "ap-southeast-2: Asia Pacific (Sydney)",
        "ap-northeast-1": "ap-northeast-1: Asia Pacific (Tokyo)",
        "ca-central-1": "ca-central-1: Canada (Central)",
        "cn-north-1": "cn-north-1: China (Beijing)",
        "cn-northwest-1": "cn-northwest-1: China (Ningxia)",
        "eu-central-1": "eu-central-1: Europe (Frankfurt)",
        "eu-west-1": "eu-west-1: Europe (Ireland)",
        "eu-west-2": "eu-west-2: Europe (London)",
        "eu-south-1": "eu-south-1: Europe (Milan)",
        "eu-west-3": "eu-west-3: Europe (Paris)",
        "eu-north-1": "eu-north-1: Europe (Stockholm)",
        "me-south-1": "me-south-1: Middle East (Bahrain)",
        "sa-east-1": "sa-east-1: South America (São Paulo)",
      },
      tempAk: "",
      tempSk: "",
      persist: false,
      webStorageSupported: false,
    };
  },
  methods: {
    restoreForm() {
      this.region = this.regionCodes[this.$store.state.region];
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
        region: this.region.split(":")[0],
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
  watch: {
    "$store.state.loadingCredentials": function (val) {
      if (!val) {
        this.restoreForm();
      }
    },
  },
};
</script>
