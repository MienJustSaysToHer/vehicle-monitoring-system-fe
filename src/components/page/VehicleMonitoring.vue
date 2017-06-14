<template>
  <baidu-map id="baidu-map" :center="map.center" :zoom="map.zoom" :scroll-wheel-zoom="map.scrollWheelZoom" @ready="handler">
    <bm-marker v-for="value in vehicles" :key="value.id" :position="{lng: value.longitude, lat: value.latitude}" :icon="vehicle.icon"></bm-marker>
    <bm-control id="table-control" anchor="BMAP_ANCHOR_TOP_RIGHT">
      <el-collapse id="collapse" v-model="collapse.activeNames" @change="handleChange">
        <el-collapse-item title="筛选" name="1">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
        <el-collapse-item title="车辆信息" name="2">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              :formatter="formatter">
            </el-table-column>
            <el-table-column
              prop="tag"
              label="标签"
              width="100"
              :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template scope="scope">
                <el-tag
                  :type="scope.row.tag === '家' ? 'primary' : 'success'"
                  close-transition>{{scope.row.tag}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </bm-control>
  </baidu-map>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'

  export default {
    data () {
      return {
        map: {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          zoom: 16,
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
        vehicles: {},
        collapse: {
          activeNames: ['1']
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司'
        }]
      }
    },
    methods: {
      handler ({BMap, map}) {
        const that = this

        if ('WebSocket' in window) {
          let websocket = new WebSocket('ws://localhost/vehicle-monitoring')
          websocket.onerror = function () {
            console.log('error')
          }
          websocket.onopen = function (event) {
            console.log('open')
          }
          websocket.onmessage = function (event) {
            const newData = JSON.parse(event.data)
            const point1 = new BMap.Point(that.vehicles[newData.id].longitude, that.vehicles[newData.id].latitude)
            const point2 = new BMap.Point(newData.longitude, newData.latitude)

            const myIcon = new BMap.Icon(that.vehicle.icon.url, new BMap.Size(that.vehicle.icon.size.width, that.vehicle.icon.size.height))
            const driving = new BMap.DrivingRoute(map)
            driving.search(point1, point2)
            driving.setSearchCompleteCallback(() => {
              const path = driving.getResults().getPlan(0).getRoute(0).getPath()
              const pathlength = path.length

              Vue.delete(that.vehicles, newData.id)
              const vehicleMarker = new BMap.Marker(path[0], {icon: myIcon})
              map.addOverlay(vehicleMarker)
              function resetMkPoint (i) {
                vehicleMarker.setPosition(path[i])
                if (i < pathlength) {
                  setTimeout(function () {
                    i++
                    resetMkPoint(i)
                  }, 10)
                }
                if (i === pathlength) {
                  map.removeOverlay(vehicleMarker)
                  Vue.set(that.vehicles, newData.id, newData)
                  console.log(that.vehicles)
                }
              }

              setTimeout(function () {
                resetMkPoint(5)
              }, 10)
            })
          }
          websocket.onclose = function () {
            console.log('close')
          }
          window.onbeforeunload = function () {
            websocket.close()
          }
        } else {
          alert('Not support websocket')
        }
      },
      handleChange (activeNames) {
        console.log(activeNames)
      },
      formatter (row, column) {
        return row.address
      },
      filterTag (value, row) {
        return row.tag === value
      }
    },
    beforeCreate () {
      const that = this
      axios.get('/api/vehicle-monitoring/vehicles')
        .then(function (response) {
          if (response.status === 200) {
            that.vehicles = response.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
</script>

<style>
  #baidu-map {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #table-control {
    height: 200px;
    margin-right: 40px;
    margin-top: 40px;
  }

  #collapse {
    width: 500px;
    height: 500px;
  }
</style>
