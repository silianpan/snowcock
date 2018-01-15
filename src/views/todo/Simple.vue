<template>
  <Card>
    <p slot="title">
        <Icon type="checkmark"></Icon>
        待办任务
    </p>
    <a href="#" slot="extra" @click.prevent="moreClickAction">
      more>>
    </a>
    <div v-for="(item, index) in todoTaskList" :key="index" class="cart-body cart-font todo-item">
      <span>
          <Row>
              <Col span="3">
                  <span class="card-item-num">{{index+1}}</span> 
              </Col>
              <Col span="10">
                  <span class="card-item-text">{{ getTaskName(item) }}</span>
              </Col>
              <Col span="11">
                  <span class="card-item-text">{{ formartDateTime(item.taskCreateTime) }}</span>
              </Col>
          </Row>
      </span>
    </div>
  </Card>
</template>

<script>
import workflowApi from '@/api/workflow'
import filter from '@/utils/dateTime'
export default {
  data() {
    return {
      todoTaskList: []
    }
  },
  mounted() {
    this.findTodoTask()
  },
  methods: {
    getTaskName(taskItem) {
      if (taskItem.variables.BUS_NAME) {
        return taskItem.taskName + '（' + taskItem.variables.BUS_NAME + '）'
      } else {
        return taskItem.taskName
      }
    },
    formartDateTime(datetime) {
      return filter.formatDate(datetime)
    },
    findTodoTask() {
      const self = this
      workflowApi
        .findTodoTask()
        .then(response => {
          self.todoTaskList = response.data.slice(0, 3)
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    moreClickAction() {
      this.$router.push({ path: '/todo/task' })
    }
  }
}
</script>
