<template>
    <div class="layout">
        <Layout>
            <Sider breakpoint="md" collapsible :collapsed-width="60" v-model="isCollapsed" @on-collapse="collapseClick">
                <div class="logo">
                    <i></i>
                    <div v-if="!isCollapsed">SNOWCOCK</div>
                </div>
                <Menu v-if="!isCollapsed" theme="dark" width="auto" :accordion="true" :class="menuitemClasses">
                    <template v-for="rootMenu in menuList">
                        <MenuItem v-if="rootMenu.children === null" :name="rootMenu.name" :key="'menuitem'+rootMenu.id">
                        <i :class="rootMenu.micon" :key="'menuicon'+rootMenu.id"></i>
                        <span :key="'menutext'+rootMenu.id">{{rootMenu.name}}</span>
                        </MenuItem>
                        <Submenu v-if="rootMenu.children !== null" :name="rootMenu.name" :key="rootMenu.id">
                            <template slot="title">
                                <i :class="rootMenu.micon"></i>
                                {{rootMenu.name}}
                            </template>
                            <MenuItem v-for="menuItem in rootMenu.children" :name="menuItem.name" :key="menuItem.id">{{menuItem.name}}</MenuItem>
                        </Submenu>
                    </template>
                </Menu>
                <template v-if="isCollapsed" v-for="(rootMenu, index) in menuList">
                    <div style="text-align: center;" :key="index">
                        <Dropdown transfer v-if="rootMenu.children !== null" placement="right-start" :key="index">
                            <Button style="width: 65px;margin-left: -5px;padding:10px 0;" type="text">
                                <i :class="rootMenu.micon + ' expend-icon'"></i>
                            </Button>
                            <DropdownMenu style="width: 200px;" slot="list">
                                <template v-for="(menuItem, i) in rootMenu.children">
                                    <DropdownItem :name="menuItem.name" :key="i">
                                        <i :class="menuItem.micon + ' expend-icon'"></i>
                                        <span style="padding-left:10px;">{{ menuItem.name }}</span>
                                    </DropdownItem>
                                </template>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown transfer v-else placement="right-start" :key="index">
                            <Button style="width: 65px;margin-left: -5px;padding:10px 0;" type="text">
                                <i :class="rootMenu.micon + ' expend-icon'"></i>
                            </Button>
                            <DropdownMenu style="width: 200px;" slot="list">
                                <DropdownItem :name="rootMenu.name" :key="'d' + index">
                                    <i :class="rootMenu.micon + ' expend-icon'"></i>
                                    <span style="padding-left:10px;">{{ rootMenu.name }}</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </template>
            </Sider>
            <Layout>
                <Header class="layout-header-bar"></Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '220px'}">
                    <transition name="slide-fade" mode="out-in">
                        <router-view/>
                    </transition>
                </Content>
                <Footer>四川卓信力加信息科技有限责任公司 Copyright 2017 版权所有</Footer>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import menuApi from '@/api/menu'
export default {
  data() {
    return {
      menuList: [],
      isCollapsed: false
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    // 获取菜单列表
    getMenuList() {
      const self = this
      menuApi
        .getMenuTreeByCurrentUser()
        .then(response => {
          if (response.status === 200) {
            self.menuList = response.data
            console.log('menuList', self.menuList)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 收起展开回调
    collapseClick(isExpend) {
      this.isCollapsed = isExpend
    }
  },
  computed: {
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  }
}
</script>

<style lang="less">
@import './home.less';
</style>
