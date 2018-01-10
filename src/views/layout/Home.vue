<template>
    <div class="layout">
        <Layout>
            <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
                <div class="logo">
                    <i></i>
                    <div v-if="!isCollapsed">SNOWCOCK</div>
                </div>
                <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="1-1">
                    <Icon type="ios-navigate"></Icon>
                    <span>Option 1</span>
                    </MenuItem>
                    <MenuItem name="1-2">
                    <Icon type="search"></Icon>
                    <span>Option 2</span>
                    </MenuItem>
                    <MenuItem name="1-3">
                    <Icon type="settings"></Icon>
                    <span>Option 3</span>
                    </MenuItem>
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
export default {
  data() {
    return {
      isCollapsed: false
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