<template>
<ve-bar ref="vchart" 
    :height="height"
    :data="chartData" 
    :settings="chartSettings" 
    :title="title"
    legend-position="right"></ve-bar>
</template>

<script>
import VeBar from 'v-charts/lib/bar'
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
        columns: ['name', '总数'],
        rows: []
      },
      chartSettings: {},
      title: {
        text: '项目类型',
        left: 'center'
      },
      height: '400px'
    }
  },
  components: {
    VeBar
  },
  created() {
    this.statisticProjectType()
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
    statisticProjectType() {
      const self = this
      projectApi
        .statisticProjectType()
        .then(response => {
          const itemArr = response.data
          for (let i = 0; i < itemArr.length; i++) {
            const item = itemArr[i]
            item.name = resType.getProjectClassifyById(item.name)
            item['总数'] = item.value
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
