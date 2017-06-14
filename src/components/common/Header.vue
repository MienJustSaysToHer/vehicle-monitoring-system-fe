<template>
  <div class="header">
    <div class="logo">
      <img src="../../../static/img/logo.png">
    </div>
    <el-breadcrumb separator=" " class="link">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-menu"></i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="el-icon-star-off"></i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="el-icon-edit"></i>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="el-icon-information"></i>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user">
      <el-dropdown>
        <span class="el-dropdown-link user-name">
          <img src="../../../static/img/user-logo.jpg" class="user-logo">
          何宇寰
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item divided>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
  .header {
    height: 60px;
    background-color: #2f323e;
  }

  .logo {
    width: 250px;
    height: 60px;
    float: left;
    background: #ffffff;
  }

  .link {
    font-size: 20px;
    line-height: 60px;
    padding-left: 40px;
    float: left;
  }

  .user {
    line-height: 60px;
    padding-right: 40px;
    float: right;
  }

  .user-name {
    font-size: 16px;
    color: #ffffff;
  }

  .user-logo {
    width: 36px;
    height: 36px;
    margin-right: 5px;
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
