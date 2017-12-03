<template>
  <div>
    <el-table id="table" ref="multipleTable" :data="roles.slice(pagination.pageSize * (pagination.currentPage - 1), pagination.pageSize * pagination.currentPage)" stripe row-key="id">
      <el-table-column type="selection" width="55" reserve-selection></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="system" label="系统角色"></el-table-column>
      <el-table-column prop="description" label="角色描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleAuthorize(scope.row)">角色授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="pagination.pageSize" :total="roles.length" :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    <el-dialog title="角色授权" :visible.sync="dialogFormVisible">
      <el-tree :data="data2" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        roles: [{
          name: 'admin',
          system: 'true',
          description: '管理员'
        }],
        pagination: {
          pageSize: 10,
          currentPage: 1
        },
        dialogFormVisible: false,
        data2: [{
          id: 1,
          label: '获取菜单'
        }, {
          id: 2,
          label: '文件操作'
        }, {
          id: 3,
          label: '角色管理',
          children: [{
            id: 31,
            label: '系统角色管理'
          }, {
            id: 32,
            label: '用户管理'
          }, {
            id: 33,
            label: '车辆'
          }]
        }, {
          id: 4,
          label: '订单管理',
          children: [{
            id: 41,
            label: '运输订单'
          }]
        }, {
          id: 5,
          label: '监控',
          children: [{
            id: 51,
            label: '车辆监控'
          }, {
            id: 52,
            label: '历史回放'
          }]
        }, {
          id: 6,
          label: '统计',
          children: [{
            id: 51,
            label: '车辆分布'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      handleAuthorize () {
        this.dialogFormVisible = true
      },
      handleSizeChange (pageSize) {
        this.pagination.pageSize = pageSize
      },
      handleCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
      }
    }
  }
</script>
