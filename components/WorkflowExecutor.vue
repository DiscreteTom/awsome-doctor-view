<template>
  <div>
    <h2>Diagnosing: {{ workflow.title }}</h2>
    <v-expansion-panels v-if="workflow.description" class="my-3">
      <v-expansion-panel>
        <v-expansion-panel-header> Description </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-html="renderDescription()"
            class="markdown-body"
            style="padding: 10px"
          ></div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-for="input in workflow.input" :key="input.label">
      <v-file-input
        v-if="input.type == 'file'"
        :label="input.label"
        :placeholder="input.placeholder"
        v-model="workflowData[input.store]"
      />
      <v-text-field
        v-else
        :label="input.label"
        :placeholder="input.placeholder"
        :type="input.type"
        v-model="workflowData[input.store]"
      />
    </div>
    <v-btn color="primary" @click="submit"> Submit </v-btn>
    <v-btn @click="reset" class="mx-3"> Reset </v-btn>

    <v-expansion-panels v-if="started" class="my-3">
      <v-expansion-panel v-for="(result, i) in results" :key="result.name">
        <v-expansion-panel-header
          :color="
            result.pending
              ? undefined
              : result.err
              ? 'red'
              : result.ok
              ? 'green'
              : 'blue'
          "
          :expand-icon="
            result.pending
              ? undefined
              : result.err
              ? 'mdi-alert-circle-outline'
              : result.ok
              ? 'mdi-check'
              : 'mdi-information-outline'
          "
          :disable-icon-rotate="!result.pending"
        >
          {{ i + 1 }}. {{ result.name }}
          <v-progress-circular indeterminate v-if="result.pending" :size="15" />
        </v-expansion-panel-header>
        <v-expansion-panel-content
          :color="
            result.markdown
              ? '#181818'
              : result.pending
              ? undefined
              : result.err
              ? 'red'
              : result.ok
              ? 'green'
              : 'blue'
          "
        >
          <v-progress-circular indeterminate v-if="result.pending" />
          <div v-else>
            <div
              v-if="result.markdown"
              v-html="result.err || result.ok || result.info"
              class="markdown-body"
              style="background: white; padding: 10px"
            ></div>
            <div v-else>{{ result.err || result.ok || result.info }}</div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import executor from "awsome-doctor-core";

export default {
  props: {
    workflow: Object,
  },
  data() {
    return {
      workflowData: {},
      started: false,
      results: [],
    };
  },
  methods: {
    async submit() {
      this.started = true;
      this.results = [];

      // configure aws
      executor.configure({
        accessKeyId: this.$store.state.tempAk,
        secretAccessKey: this.$store.state.tempSk,
        region: this.$store.state.region,
      });

      for (let i = 0; i < this.workflow.steps.length; ++i) {
        let step = this.workflow.steps[i];
        // update result
        this.results.push({
          pending: true,
          name: step.name,
        });

        let output = await executor.run(step.js, this.workflowData);

        // update result
        this.results[i].pending = false;
        this.results[i].markdown = false;
        this.results[i].err = output.err;
        this.results[i].info = output.info;
        this.results[i].ok = output.ok;

        const mdPrefix = "/md\n";
        function parseMarkdown(output, result, field, md) {
          let value = output[field];
          if (typeof value == "string" && value.startsWith(mdPrefix)) {
            result[field] = md.parse(value.slice(mdPrefix.length));
            result.markdown = true;
          }
          return result.markdown;
        }

        if (!parseMarkdown(output, this.results[i], "err", this.$md)) {
          if (!parseMarkdown(output, this.results[i], "info", this.$md)) {
            parseMarkdown(output, this.results[i], "ok", this.$md);
          }
        }

        if (output.err) break;
        if (output.stop) break;
      }
    },
    reset() {
      this.workflowData = { ...this.workflow.data }; // copy
      this.started = false;
      this.results = [];
    },
    renderDescription() {
      return this.$md.parse(this.workflow.description);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.reset(); // fill with default data
    });
  },
};
</script>

<style>
code[class^="language-"] {
  background-color: transparent !important;
}
</style>
