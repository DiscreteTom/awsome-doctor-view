<template>
  <div>
    <v-text-field
      v-model="tempAk"
      label="Access Key Id"
      :messages="tempCredentialHint"
    />
    <v-text-field
      v-model="tempSk"
      label="Secret Access Key"
      type="password"
      :messages="tempCredentialHint"
    />
    <v-text-field
      label="Region Code"
      v-model="region"
      placeholder="us-east-1"
    />

    <v-btn @click="save" color="primary">Save</v-btn>
    <v-btn @click="resetForm">Reset</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempCredentialHint:
        "This will not be saved and is only available during the current session.",
      region: "us-east-1",
      tempAk: "",
      tempSk: "",
    };
  },
  methods: {
    resetForm() {
      this.region = this.$store.state.region;
      this.tempAk = this.$store.state.tempAk;
      this.tempSk = this.$store.state.tempSk;
    },
    save() {
      this.$store.commit("updateConfig", {
        region: this.region,
        tempAk: this.tempAk,
        tempSk: this.tempSk,
      });

      this.$bus.$emit("append-msg", "Saved");
    },
  },
  mounted() {
    this.resetForm();
  },
};
</script>
