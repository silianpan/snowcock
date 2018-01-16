<template>
    <div style="width:100%;height:100%;" id="domid_project_type"></div>
</template>

<script>
import echarts from 'echarts'
import resType from '@/common/resTypeEnum'
import projectApi from '@/api/project'

export default {
  name: 'projectType',
  props: {
    realWidth: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      dataSource: null,
      option: {
        title: {
          text: '项目类型',
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      }
    }
  },
  mounted() {
    const self = this
    this.$nextTick(() => {
      self.dataSource = echarts.init(
        document.getElementById('domid_project_type')
      )
      self.statisticProjectType()
    })
  },
  methods: {
    resize() {
      // 自适应设计
      const self = this
      window.addEventListener('resize', function() {
        self.dataSource.resize()
      })
    },
    statisticProjectType() {
      const self = this
      projectApi
        .statisticProjectType()
        .then(response => {
          const itemArr = response.data
          let itemNameArr = []
          let itemValueArr = []
          for (let i = 0; i < itemArr.length; i++) {
            const item = itemArr[i]
            item.name = resType.getProjectClassifyById(item.name)
            itemNameArr.push(item.name)
            itemValueArr.push(item.value)
          }
          self.option.xAxis.data = itemNameArr
          self.option.series[0].data = itemValueArr

          // 设置数据源
          self.dataSource.setOption(self.option)
          // 自适应设计
          self.dataSource.resize()
          self.resize()
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  },
  watch: {
    realWidth: function(newVal, oldVal) {
      // 自适应大小
      if (this.dataSource) {
        this.dataSource.resize()
      }
    }
  }
}
</script>
