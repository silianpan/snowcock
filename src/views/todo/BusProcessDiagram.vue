<template>
<!-- 业务流程图 -->
<processDiagramComp v-if="processInstanceId!=''" :processInstanceId="processInstanceId"></processDiagramComp>
</template>

<script>
import processDiagramComp from 'views/workflow/processDiagram.vue'
export default {
  props: {
    processInstanceId: {
      type: String,
      default: ''
    }
  },
  components: {
    processDiagramComp
  }
}
</script>
