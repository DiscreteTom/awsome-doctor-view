<template>
  <div>
    <workflow-executor
      :workflow="$store.state.workflows[service][workflowName]"
    />
  </div>
</template>

<script>
import WorkflowExecutor from "../../../components/WorkflowExecutor.vue";

export default {
  components: { WorkflowExecutor },
  async asyncData({ params }) {
    const service = params.service;
    const workflowName = params.workflow;
    return { service, workflowName };
  },
};
</script>
