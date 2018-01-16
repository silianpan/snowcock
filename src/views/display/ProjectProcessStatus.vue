<template>
    <div style="width:100%;height:100%;" id="domid_project_process_status"></div>
</template>

<script>
import echarts from 'echarts'
import resType from '@/common/resTypeEnum'
import projectApi from '@/api/project'

export default {
  name: 'projectProcessStatus',
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
          text: '项目流程状态',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: []
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    const self = this
    this.$nextTick(() => {
      self.dataSource = echarts.init(
        document.getElementById('domid_project_process_status')
      )
      self.statisticProjectProcessStatus()
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
    statisticProjectProcessStatus() {
      const self = this
      projectApi
        .statisticProjectProcessStatus()
        .then(response => {
          const itemArr = response.data
          let itemNameArr = []
          for (let i = 0; i < itemArr.length; i++) {
            const item = itemArr[i]
            item.name = resType.getProjectProcessStatusById(item.name)
            itemNameArr.push(item.name)
          }
          self.option.legend.data = itemNameArr
          self.option.series[0].data = itemArr

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
