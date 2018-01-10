import axios from 'axios'
import semver from 'semver'
import packjson from '../../package.json'

export default {
  title(title) {
    title = title || 'iView admin'
    window.document.title = title
  },

  inOf(arr, targetArr) {
    let res = true
    arr.forEach(item => {
      if (targetArr.indexOf(item) < 0) {
        res = false
      }
    })
    return res
  },

  oneOf(ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
      return true
    } else {
      return false
    }
  },

  showThisRoute(itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
      return this.oneOf(currentAccess, itAccess)
    } else {
      return itAccess === currentAccess
    }
  },

  getRouterObjByName(routers, name) {
    if (!name || !routers || !routers.length) {
      return null
    }
    // debugger
    let routerObj = null
    for (let item of routers) {
      if (item.name === name) {
        return item
      }
      routerObj = this.getRouterObjByName(item.children, name)
      if (routerObj) {
        return routerObj
      }
    }
    return null
  },

  handleTitle(vm, item) {
    if (typeof item.title === 'object') {
      return vm.$t(item.title.i18n)
    } else {
      return item.title
    }
  },

  setCurrentPath(vm, name) {
    let title = ''
    let isOtherRouter = false
    vm.$store.state.app.routers.forEach(item => {
      if (item.children.length === 1) {
        if (item.children[0].name === name) {
          title = this.handleTitle(vm, item)
          if (item.name === 'otherRouter') {
            isOtherRouter = true
          }
        }
      } else {
        item.children.forEach(child => {
          if (child.name === name) {
            title = this.handleTitle(vm, child)
            if (item.name === 'otherRouter') {
              isOtherRouter = true
            }
          }
        })
      }
    })
    let currentPathArr = []
    if (name === 'home_index') {
      currentPathArr = [
        {
          title: this.handleTitle(
            vm,
            this.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
          ),
          path: '',
          name: 'home_index'
        }
      ]
    } else if (
      (name.indexOf('_index') >= 0 || isOtherRouter) &&
      name !== 'home_index'
    ) {
      currentPathArr = [
        {
          title: this.handleTitle(
            vm,
            this.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
          ),
          path: '/home',
          name: 'home_index'
        },
        {
          title: title,
          path: '',
          name: name
        }
      ]
    } else {
      let currentPathObj = vm.$store.state.app.routers.filter(item => {
        if (item.children.length <= 1) {
          return item.children[0].name === name
        } else {
          let i = 0
          let childArr = item.children
          let len = childArr.length
          while (i < len) {
            if (childArr[i].name === name) {
              return true
            }
            i++
          }
          return false
        }
      })[0]
      if (
        currentPathObj.children.length <= 1 &&
        currentPathObj.name === 'home'
      ) {
        currentPathArr = [
          {
            title: '首页',
            path: '',
            name: 'home_index'
          }
        ]
      } else if (
        currentPathObj.children.length <= 1 &&
        currentPathObj.name !== 'home'
      ) {
        currentPathArr = [
          {
            title: '首页',
            path: '/home',
            name: 'home_index'
          },
          {
            title: currentPathObj.title,
            path: '',
            name: name
          }
        ]
      } else {
        let childObj = currentPathObj.children.filter(child => {
          return child.name === name
        })[0]
        currentPathArr = [
          {
            title: '首页',
            path: '/home',
            name: 'home_index'
          },
          {
            title: currentPathObj.title,
            path: '',
            name: currentPathObj.name
          },
          {
            title: childObj.title,
            path: currentPathObj.path + '/' + childObj.path,
            name: name
          }
        ]
      }
    }
    vm.$store.commit('setCurrentPath', currentPathArr)

    return currentPathArr
  },

  openNewPage(vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList
    let openedPageLen = pageOpenedList.length
    let i = 0
    let tagHasOpened = false
    while (i < openedPageLen) {
      if (name === pageOpenedList[i].name) {
        // 页面已经打开
        vm.$store.commit('pageOpenedList', {
          index: i,
          argu: argu,
          query: query
        })
        tagHasOpened = true
        break
      }
      i++
    }
    if (!tagHasOpened) {
      let tag = vm.$store.state.app.tagsList.filter(item => {
        if (item.children) {
          return name === item.children[0].name
        } else {
          return name === item.name
        }
      })
      tag = tag[0]
      if (tag) {
        tag = tag.children ? tag.children[0] : tag
        if (argu) {
          tag.argu = argu
        }
        if (query) {
          tag.query = query
        }
        vm.$store.commit('increateTag', tag)
      }
    }
    vm.$store.commit('setCurrentPageName', name)
  },

  toDefaultPage(routers, name, route, next) {
    let len = routers.length
    let i = 0
    let notHandle = true
    while (i < len) {
      if (
        routers[i].name === name &&
        routers[i].children &&
        routers[i].redirect === undefined
      ) {
        route.replace({
          name: routers[i].children[0].name
        })
        notHandle = false
        next()
        break
      }
      i++
    }
    if (notHandle) {
      next()
    }
  },

  fullscreenEvent(vm) {
    vm.$store.commit('initCachepage')
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist')
    // 全屏相关
  },

  checkUpdate(vm) {
    axios
      .get('https://api.github.com/repos/iview/iview-admin/releases/latest')
      .then(res => {
        let version = res.data.tag_name
        vm.$Notice.config({
          duration: 0
        })
        if (semver.lt(packjson.version, version)) {
          vm.$Notice.info({
            title: 'iview-admin更新啦',
            desc:
              '<p>iView-admin更新到了' +
              version +
              '了，去看看有哪些变化吧</p><a style="font-size:13px" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
          })
        }
      })
  }

  // onWheel (ele, callback) {
  //     ele.addEventListener('mousewheel', function (e) {
  //         callback(e, e.wheelDelta)
  //     })
  //     ele.addEventListener('DOMMouseScroll', function (e) {
  //         callback(e, e.detail * 40)
  //     })
  // }

  // offWheel (ele, callback) {
  //     ele.removeEventListener('mousewheel', callback)
  // }
}
