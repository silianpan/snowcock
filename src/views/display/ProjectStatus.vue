<template>
<ve-pie ref="vchart" 
    :height="height"
    :data="chartData" 
    :settings="chartSettings" 
    :title="title" 
    legend-position="left"></ve-pie>
</template>

<script>
import VePie from 'v-charts/lib/pie'
import resType from '@/common/resTypeEnum'
import projectApi from '@/api/project'
export default {
  props: {
    realWidth: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      chartData: {
        columns: ['name', 'value'],
        rows: []
      },
      chartSettings: {
        // roseType: 'radius'
        radius: 80,
        offsetY: 140
      },
      title: {
        text: '项目状态',
        left: 'center'
      },
      height: '400px'
    }
  },
  components: {
    VePie
  },
  created() {
    this.statisticProjectStatus()
  },
  mounted() {
    this.windowResizeEventListen()
  },
  methods: {
    windowResizeEventListen() {
      const self = this
      window.onresize = function() {
        if (self.$refs.vchart && self.$refs.vchart.echarts) {
          self.$refs.vchart.echarts.resize()
        }
      }
    },
    statisticProjectStatus() {
      const self = this
      projectApi
        .statisticProjectStatus()
        .then(response => {
          const itemArr = response.data
          for (let i = 0; i < itemArr.length; i++) {
            const item = itemArr[i]
            item.name = resType.getProjectStatusById(item.name)
          }
          self.chartData.rows = itemArr

          // 自适应大小
          if (self.$refs.vchart && self.$refs.vchart.echarts) {
            self.$refs.vchart.echarts.resize()
          }
          self.windowResizeEventListen()
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  },
  watch: {
    realWidth: function(newVal, oldVal) {
      // 自适应大小
      this.$refs.vchart.echarts.resize()
    }
  }
}
</script>
