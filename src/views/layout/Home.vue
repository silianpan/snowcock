<template>
    <div class="layout">
        <Layout>
            <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
                <div class="logo">
                    <i></i>
                    <div v-if="!isCollapsed">SNOWCOCK</div>
                </div>
                <Menu theme="dark" width="auto" :class="menuitemClasses">
                    <template v-for="rootMenu in menuList">
                        <MenuItem v-if="rootMenu.children === null" :name="rootMenu.name" :key="'menuitem'+rootMenu.id">
                            <!-- <Icon :type="rootMenu.micon"></Icon> -->
                            <i :class="rootMenu.micon" :key="'menuicon'+rootMenu.id"></i>
                            <span :key="'menutext'+rootMenu.id">{{rootMenu.name}}</span>
                        </MenuItem>
                        <Submenu v-else :name="rootMenu.name" :key="rootMenu.id">
                            <template slot="title">
                                <!-- <Icon :type="rootMenu.micon"></Icon> -->
                                <i :class="rootMenu.micon"></i>
                                {{rootMenu.name}}
                            </template>
                            <MenuItem v-for="menuItem in rootMenu.children" :name="menuItem.name" :key="menuItem.id">{{menuItem.name}}</MenuItem>
                        </Submenu>
                    </template>
                </Menu>
            </Sider>
            <Layout>
                <Header class="layout-header-bar"></Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '220px'}">
                    Content
                </Content>
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