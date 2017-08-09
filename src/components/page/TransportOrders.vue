<template>
  <div>
    <el-table id="table" ref="multipleTable" :data="transportorders.slice(pagination.pageSize * (pagination.currentPage - 1), pagination.pageSize * pagination.currentPage)" max-height="300" stripe row-key="id">
      <el-table-column type="selection" width="55" reserve-selection></el-table-column>
      <el-table-column prop="tonumber" label="运输单号"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="province" label="车牌省"></el-table-column>
      <el-table-column prop="numberPlate" label="车牌号"></el-table-column>
      <el-table-column prop="fee" label="物流费用"></el-table-column>
      <el-table-column prop="date" label="运输日期"></el-table-column>
      <el-table-column prop="state" label="状态" :formatter="stateFormatter"></el-table-column>
      <el-table-column prop="weight" label="总重量t"></el-table-column>
    </el-table>
    <el-pagination :page-size="pagination.pageSize" :total="transportorders.length" :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        transportorders: [],
        pagination: {
          pageSize: 10,
          currentPage: 1
        }
      }
    },
    methods: {
      stateFormatter (row) {
        if (row.state) {
          return '已接单'
        } else {
          return '未接单'
        }
      },
      handleSizeChange (pageSize) {
        this.pagination.pageSize = pageSize
      },
      handleCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
      }
    },
    beforeCreate () {
      const that = this

      axios.get('/api/transportorders')
        .then(response => {
          if (response.status === 200) {
            that.transportorders = response.data
          }
        })
        .catch(error => console.log(error))
    }
  }
</script>
