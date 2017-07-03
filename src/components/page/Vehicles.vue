<template>
  <div>
    <el-form ref="form" :model="form" inline label-width="80px">
      <el-form-item label="车牌省">
        <el-select v-model="form.province" multiple placeholder="请选择车牌省" filterable default-first-option>
          <el-option v-for="p in provinces" :key="p.value" :value="p.value" :label="p.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="form.numberPlate" placeholder="请输入车牌号" class="number-plate"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">筛选</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
    <el-table id="table" ref="multipleTable" :data="vehicles.slice(pagination.pageSize * (pagination.currentPage - 1), pagination.pageSize * pagination.currentPage)" stripe row-key="id">
      <el-table-column type="selection" width="55" reserve-selection></el-table-column>
      <el-table-column prop="phone" label="手机号" fixed></el-table-column>
      <el-table-column prop="province" label="车牌省" fixed></el-table-column>
      <el-table-column prop="numberPlate" label="车牌号" fixed></el-table-column>
      <el-table-column prop="longitude" label="经度"></el-table-column>
      <el-table-column prop="latitude" label="纬度"></el-table-column>
      <el-table-column prop="temperature" label="温度℃"></el-table-column>
      <el-table-column prop="humidity" label="湿度%"></el-table-column>
      <el-table-column prop="loadweight" label="载重t"></el-table-column>
      <el-table-column prop="loadvolume" label="载方m³"></el-table-column>
    </el-table>
    <el-pagination :page-size="pagination.pageSize" :total="vehicles.length" :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
  import axios from 'axios'
  import provinces from '../../store/provinces'
  import areas from '../../store/areas'

  export default {
    data () {
      return {
        provinces,
        areas,
        form: {
          province: [],
          numberPlate: ''
        },
        vehicles: [],
        pagination: {
          pageSize: 10,
          currentPage: 1
        }
      }
    },
    methods: {
      submitForm () {
        const that = this
        axios.get('/api/vehicles', {
          params: that.form
        })
          .then(response => {
            if (response.status === 200) {
              that.pagination.currentPage = 1
              that.vehicles = response.data
            }
          })
          .catch(error => console.log(error))
      },
      resetForm () {
        this.form = {
          province: [],
          numberPlate: ''
        }
        const that = this
        axios.get('/api/vehicles')
          .then(response => {
            if (response.status === 200) {
              that.pagination.currentPage = 1
              that.vehicles = response.data
            }
          })
          .catch(error => console.log(error))
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
      axios.get('/api/vehicles')
        .then(response => {
          if (response.status === 200) {
            that.vehicles = response.data
          }
        })
        .catch(error => console.log(error))
    }
  }
</script>
