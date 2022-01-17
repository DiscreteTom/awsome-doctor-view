<template>
  <div>
    <h2 class="mx-3">Available workflows:</h2>
    <v-list nav dense>
      <v-list-item
        v-for="(workflow, workflowName) in $store.state.workflows[service]"
        :key="workflowName"
        :to="`/workflow/${service}/${workflowName}`"
      >
        <v-list-item-icon>
          <v-icon> mdi-link </v-icon>
        </v-list-item-icon>
        <v-list-item-title> {{ workflow.title }} </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  async asyncData({ params }) {
    const service = params.service;
    return { service };
  },
};
</script>
