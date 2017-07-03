<template>
  <div class="nav-menu">
    <div class="user">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="../../../static/img/user-logo.jpg" class="user-logo">
          <div class="user-name">
            何宇寰
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item divided>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-menu default-active="/" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>角色管理</template>
        <el-menu-item index="/vehicles">车辆</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-message"></i>监控</template>
        <el-menu-item index="/">车辆监控</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-message"></i>统计</template>
        <el-menu-item index="/distribution">车辆分布</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style scoped>
  .nav-menu {
    width: 250px;
    height: 100%;
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
  }

  .nav-menu > ul {
    height: 100%;
    background-color: #ffffff;
  }

  .user {
    text-align: center;
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .user-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .user-name {
    font-size: 16px;
  }
</style>
