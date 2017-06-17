<template>
  <baidu-map id="baidu-map" :center="map.center" :zoom="map.zoom" :scroll-wheel-zoom="map.scrollWheelZoom" @ready="handleReady">
    <bm-marker v-for="v in vehicles" :key="v.id" :position="{lng: v.longitude, lat: v.latitude}" :icon="vehicle.icon" @mouseover="handleMouseover (v)" @mouseout="handleMouseout" @click="handleClick (v)"></bm-marker>
    <bm-info-window :show="infoWindow.show" :position="{lng: infoWindow.longitude, lat: infoWindow.latitude}">
      <el-card class="box-card">
        <div slot="header">
          车牌号：{{ infoWindow.province }}{{ infoWindow.numberPlate }}
        </div>
        <div class="info-text">
          经度：{{ infoWindow.longitude }}
        </div>
        <div class="info-text">
          纬度：{{ infoWindow.latitude }}
        </div>
        <div class="info-text">
          温度：{{ infoWindow.temperature }}
        </div>
        <div class="info-text">
          湿度：{{ infoWindow.humidity }}
        </div>
        <div class="info-text">
          载重：{{ infoWindow.loadweight }}
        </div>
        <div class="info-text">
          载方：{{ infoWindow.loadvolume }}
        </div>
      </el-card>
    </bm-info-window>
    <bm-control id="table-control" anchor="BMAP_ANCHOR_TOP_RIGHT">
      <el-collapse id="collapse">
        <el-collapse-item title="筛选" name="1">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="车牌省">
              <el-select v-model="form.province" multiple placeholder="请选择车牌省" filterable default-first-option>
                <el-option v-for="p in provinces" :key="p.value" :value="p.value" :label="p.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号">
              <el-input v-model="form.numberPlate" placeholder="请输入车牌号" class="number-plate"></el-input>
            </el-form-item>
            <el-form-item label="所在地域">
              <el-cascader v-model="form.area" :options="areas" placeholder="请选择所在地域" filterable change-on-select></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">筛选</el-button>
              <el-button @click="resetForm">取消</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="车辆信息" name="2">
          <el-table id="table" ref="multipleTable" :data="vehicles.slice(pagination.pageSize * (pagination.currentPage - 1), pagination.pageSize * pagination.currentPage)" max-height="300" stripe row-key="id" @select="handleSelect" @select-all="handleSelect" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" reserve-selection></el-table-column>
            <el-table-column prop="province" label="车牌省" width="90" fixed></el-table-column>
            <el-table-column prop="numberPlate" label="车牌号" width="90" fixed></el-table-column>
            <el-table-column prop="longitude" label="经度" width="120"></el-table-column>
            <el-table-column prop="latitude" label="纬度" width="120"></el-table-column>
            <el-table-column prop="temperature" label="温度" width="80"></el-table-column>
            <el-table-column prop="humidity" label="湿度" width="80"></el-table-column>
            <el-table-column prop="loadweight" label="载重" width="80"></el-table-column>
            <el-table-column prop="loadvolume" label="载方" width="80"></el-table-column>
          </el-table>
          <el-pagination :page-size="pagination.pageSize" :total="vehicles.length" :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </bm-control>
  </baidu-map>
</template>

<script>
  import axios from 'axios'
  import provinces from '../../store/provinces'
  import areas from '../../store/areas'

  export default {
    data () {
      return {
        map: {
          bmap: {},
          map: {},
          center: {
            lng: 116.404,
            lat: 39.915
          },
          zoom: 14,
          scrollWheelZoom: true
        },
        vehicle: {
          icon: {
            url: '../../../static/img/vehicle.png',
            size: {
              width: 80,
              height: 51
            }
          }
        },
        vehicles: [],
        infoWindow: {
          show: false,
          province: '',
          numberPlate: '',
          longitude: '',
          latitude: '',
          temperature: '',
          humidity: '',
          loadweight: '',
          loadvolume: ''
        },
        form: {
          province: [],
          numberPlate: '',
          area: []
        },
        provinces,
        areas,
        pagination: {
          pageSize: 10,
          currentPage: 1
        },
        timeouts: {}
      }
    },
    methods: {
      handleReady ({BMap, map}) {
        this.map.bmap = BMap
        this.map.map = map
        const that = this

        axios.get('/api/vehicle-monitoring/vehicles')
          .then(response => {
            if (response.status === 200) {
              that.vehicles = response.data
              that.map.map.setViewport(that.vehicles.map(v => {
                return new that.map.bmap.Point(v.longitude, v.latitude)
              }))
            }
          })
          .catch(error => console.log(error))

        if ('WebSocket' in window) {
          let websocket = new WebSocket('ws://localhost/vehicle-monitoring')
          websocket.onmessage = event => {
            const newVehicle = JSON.parse(event.data)
            const vehicles = that.vehicles.filter(v => {
              return v.id === newVehicle.id
            })
            if (vehicles.length === 0) {
              return
            }
            const vehicle = vehicles[0]
            if (vehicle.longitude === newVehicle.longitude && vehicle.latitude === newVehicle.latitude) {
              return
            }

            const point1 = new BMap.Point(vehicle.longitude, vehicle.latitude)
            const point2 = new BMap.Point(newVehicle.longitude, newVehicle.latitude)
            const driving = new BMap.DrivingRoute(map)
            driving.search(point1, point2)
            driving.setSearchCompleteCallback(() => {
              const path = driving.getResults().getPlan(0).getRoute(0).getPath()
              const pathlength = path.length

              function resetMkPoint (i) {
                if (path[i] === undefined) {
                  return
                }
                vehicle.longitude = path[i].lng
                vehicle.latitude = path[i].lat
                if (i < pathlength) {
                  that.timeouts[vehicle.id] = setTimeout(() => {
                    i++
                    resetMkPoint(i)
                  }, 10)
                }
              }

              that.timeouts[vehicle.id] = setTimeout(() => resetMkPoint(5), 10)
            })
          }
        } else {
          alert('Not support websocket')
        }
      },
      handleMouseover ({province, numberPlate, longitude, latitude, temperature, humidity, loadweight, loadvolume}) {
        this.infoWindow.show = true
        this.infoWindow.province = province
        this.infoWindow.numberPlate = numberPlate
        this.infoWindow.longitude = longitude
        this.infoWindow.latitude = latitude
        this.infoWindow.temperature = temperature
        this.infoWindow.humidity = humidity
        this.infoWindow.loadweight = loadweight
        this.infoWindow.loadvolume = loadvolume
      },
      handleMouseout () {
        this.infoWindow.show = false
      },
      handleClick (v) {
        this.$refs.multipleTable.toggleRowSelection(v)
        this.pagination.currentPage = this.vehicles.indexOf(v) / this.pagination.pageSize + 1
      },
      submitForm () {
        const that = this
        axios.get('/api/vehicle-monitoring/vehicles/filter', {
          params: that.form
        })
          .then(response => {
            if (response.status === 200) {
              for (const timeout in that.timeouts) {
                if (that.timeouts.hasOwnProperty(timeout)) {
                  clearTimeout(that.timeouts[timeout])
                }
              }
              that.pagination.currentPage = 1
              that.vehicles = response.data
              that.map.map.setViewport(that.vehicles.map(v => {
                return new that.map.bmap.Point(v.longitude, v.latitude)
              }))
            }
          })
          .catch(error => console.log(error))
      },
      resetForm () {
        this.$refs.form.resetFields()
        this.form = {
          province: [],
          numberPlate: '',
          area: []
        }
        const that = this
        axios.get('/api/vehicle-monitoring/vehicles')
          .then(response => {
            if (response.status === 200) {
              for (const timeout in that.timeouts) {
                if (that.timeouts.hasOwnProperty(timeout)) {
                  clearTimeout(that.timeouts[timeout])
                }
              }
              that.pagination.currentPage = 1
              that.vehicles = response.data
              that.map.map.setViewport(that.vehicles.map(v => {
                return new that.map.bmap.Point(v.longitude, v.latitude)
              }))
            }
          })
          .catch(error => console.log(error))
      },
      handleSelect (selection) {
        this.map.map.setViewport(selection.map(v => {
          return new this.map.bmap.Point(v.longitude, v.latitude)
        }))
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

<style>
  #baidu-map {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .info-text {
    font-size: 14px;
    padding: 5px 0;
  }

  .number-plate {
    width: 40%;
  }

  #table-control {
    height: 200px;
    margin-right: 40px;
    margin-top: 40px;
  }

  #collapse {
    width: 650px;
  }

  #table {
    width: 100%;
  }
</style>
