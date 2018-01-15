<template>
<div>
    <!-- <el-row type="flex">
        <el-col :span="24" style="text-align:right">
            <el-button type="text" size="mini" @click="editDashBord">编辑</el-button>
            <el-button v-if="draggable && resizable" type="text" size="mini" @click="addItemToDashBord">新增</el-button>
            <el-button v-if="draggable && resizable" type="text" size="mini" @click="finishEditDashBord">保存</el-button>
        </el-col>
    </el-row> -->
    <grid-layout
            :layout="layout"
            :col-num="12"
            :row-height="rowHeight"
            :is-draggable="draggable"
            :is-resizable="resizable"
            :vertical-compact="true"
            :use-css-transforms="true">
        <grid-item :id="'gridItem'+item.i" v-for="item in layout" :key="item.i"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :min-w="2"
                    :min-h="2"
                    :i="item.i"
                    @resize="resize"
                    @move="move"
                    @resized="resized"
                    @moved="moved">
            <component
                :is="item.component?item.component:null" 
                :realWidth="calcRealWidth(item.i)"
                :realHeight = "calcRealHeight(item.i)"
                transition="fade" transition-mode="out-in" 
                keep-alive ref="chartComp"></component>
        </grid-item>
    </grid-layout>
</div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import TodoSimple from '@/views/todo/Simple.vue'
import ProjectStatus from './ProjectStatus.vue'
import ProjectProcessStatus from './ProjectProcessStatus.vue'
import ProjectType from './ProjectTypeHistogram.vue'

// import GridItem from '@/components/GridLayout/GridItem.vue'
// import GridLayout from '@/components/GridLayout/GridLayout.vue'
const GridLayout = VueGridLayout.GridLayout
const GridItem = VueGridLayout.GridItem

export default {
  name: 'app',
  components: {
    GridLayout,
    GridItem,
    TodoSimple,
    ProjectStatus,
    ProjectProcessStatus,
    ProjectType
  },
  data() {
    return {
      layout: [
        { x: 0, y: 1, w: 6, h: 7, i: '1', component: TodoSimple },
        { x: 0, y: 7, w: 6, h: 10, i: '2', component: ProjectStatus },
        { x: 6, y: 0, w: 6, h: 7, i: '3', component: ProjectProcessStatus },
        { x: 6, y: 7, w: 6, h: 10, i: '4', component: ProjectType }
      ],
      draggable: false,
      resizable: false,
      rowHeight: 30,
      colNum: 0,
      index: 0
    }
  },
  mounted: function() {
    this.index = this.layout.length
    const self = this
    window.onresize = function() {
      self.chartCompResize()
    }
  },
  methods: {
    // 计算真正div的宽度
    calcRealWidth(itemNum) {
      let div = document.getElementById('gridItem' + itemNum)
      if (div == null) {
        return 'auto'
      }
      let width =
        div.style.width || div.clientWidth || div.offsetWidth || div.scrollWidth
      return width + 'px'
    },
    // 计算真正div的高度
    calcRealHeight(itemNum) {
      let div = document.getElementById('gridItem' + itemNum)
      if (div == null) {
        return '400px'
      }
      let height =
        div.style.height ||
        div.clientHeight ||
        div.offsetHeight ||
        div.scrollHeight
      return height + 'px'
    },
    // 编辑面板
    editDashBord() {
      this.draggable = true
      this.resizable = true
    },
    // 保存面板
    finishEditDashBord() {
      this.draggable = false
      this.resizable = false
    },
    // 新增项
    addItemToDashBord() {},
    removeItem: function(item) {
      this.layout.splice(this.layout.indexOf(item), 1)
    },
    addItem: function() {
      var item = { x: 0, y: 0, w: 2, h: 2, i: this.index + '', whatever: 'bbb' }
      this.index++
      this.layout.push(item)
    },
    move: function(i, newX, newY) {
      console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    resize: function(i, newH, newW) {
      console.log('RESIZE i=' + i + ', H=' + newH + ', W=' + newW)
      this.chartCompResize()
    },
    moved: function(i, newX, newY) {
      console.log('### MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    resized: function(i, newH, newW, newHPx, newWPx) {
      console.log(
        '### RESIZED i=' +
          i +
          ', H=' +
          newH +
          ', W=' +
          newW +
          ', H(px)=' +
          newHPx +
          ', W(px)=' +
          newWPx
      )
    },
    chartCompResize() {
      const chartComp = this.$refs.chartComp
      for (let i = 0; i < chartComp.length; i++) {
        const chartItem = chartComp[i]
        if (chartItem.$refs.vchart) {
          chartItem.$refs.vchart.echarts.resize()
        }
      }
    }
  }
}
</script>
<style>
/* .vue-grid-item > .vue-resizable-handle {
        position: absolute!important;
        width: 20px!important;
        height: 20px!important;
        bottom: 0!important;
        right: 0!important;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QkYCzU64RmLYwAAAB9JREFUCNdjZEAD/////8/AwMDAxIADkC7BCDOTaB0AzToIAyjCdiUAAAAASUVORK5CYII=)!important;
        background-position: bottom right!important;
        padding: 0 3px 3px 0!important;
        background-repeat: no-repeat!important;
        background-origin: content-box!important;
        box-sizing: border-box!important;
        cursor: se-resize!important;
    } */
</style>

<style lang="less">
@import './home.less';
</style>
