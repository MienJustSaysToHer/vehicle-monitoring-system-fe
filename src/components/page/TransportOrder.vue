<template>
  <baidu-map id="baidu-map" :center="map.center" :zoom="map.zoom" :scroll-wheel-zoom="map.scrollWheelZoom" @ready="handleReady">
    <bm-marker :position="{lng: vehicle.position.longitude, lat: vehicle.position.latitude}" :icon="vehicle.icon" :massClear="false" v-show="vehicle.show"></bm-marker>
    <bm-control id="table-control" anchor="BMAP_ANCHOR_TOP_RIGHT">
      <el-collapse id="collapse">
        <el-collapse-item title="运输订单信息" name="1">
          <el-table id="table" ref="multipleTable" :data="transportorders.slice(pagination.pageSize * (pagination.currentPage - 1), pagination.pageSize * pagination.currentPage)" max-height="300" stripe row-key="id">
            <el-table-column type="selection" width="55" reserve-selection></el-table-column>
            <el-table-column prop="tonumber" label="运输单号" width="100" fixed></el-table-column>
            <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
            <el-table-column prop="province" label="车牌省" width="90"></el-table-column>
            <el-table-column prop="numberPlate" label="车牌号" width="90"></el-table-column>
            <el-table-column prop="fee" label="物流费用" width="100"></el-table-column>
            <el-table-column prop="date" label="运输日期" width="110"></el-table-column>
            <el-table-column prop="state" label="状态" width="100" :formatter="stateFormatter"></el-table-column>
            <el-table-column prop="weight" label="总重量t" width="100"></el-table-column>
            <el-table-column fixed="right" label="历史回放" width="200">
              <template scope="scope">
                <el-button-group>
                  <el-button size="small" @click="handleReplay(scope.row)" icon="view"></el-button>
                  <el-button size="small" @click="handleAccelerate()" type="primary" icon="caret-top"></el-button>
                  <el-button size="small" @click="handleDecelerate()" type="primary" icon="caret-bottom"></el-button>
                  <el-button size="small" @click="handleStop()" type="primary" icon="circle-cross"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :page-size="pagination.pageSize" :total="transportorders.length" :current-page="pagination.currentPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </bm-control>
  </baidu-map>
</template>

<script>
  import axios from 'axios'

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
          },
          position: {
            longitude: 116.404,
            latitude: 39.915
          },
          show: false
        },
        transportorders: [],
        pagination: {
          pageSize: 10,
          currentPage: 1
        },
        timeout: {},
        speed: 10
      }
    },
    methods: {
      handleReady ({BMap, map}) {
        this.map.bmap = BMap
        this.map.map = map
        const that = this

        axios.get('/api/transportorders')
          .then(response => {
            if (response.status === 200) {
              that.transportorders = response.data
            }
          })
          .catch(error => console.log(error))
      },
      stateFormatter (row) {
        if (row.state) {
          return '已接单'
        } else {
          return '未接单'
        }
      },
      handleReplay (row) {
        const that = this

        axios.get('/api/transportorders/positions', {
          params: {
            id: row.id
          }
        }).then(response => {
          if (response.status === 200) {
            const points = response.data.map(p => {
              return new that.map.bmap.Point(p.longitude, p.latitude)
            })

            that.map.map.clearOverlays()
            that.vehicle.show = false

            let promises = []
            for (let i = 0; i < (parseInt((points.length - 2) / 11) + 1); i++) {
              if ((i + 1) * 11 < points.length - 1) {
                promises.push(new Promise(
                  (resolve, reject) => {
                    const driving = new that.map.bmap.DrivingRoute(that.map.map)
                    driving.setSearchCompleteCallback(results => {
                      const plan = results.getPlan(0)
                      const numRoutes = plan.getNumRoutes()
                      let paths = []
                      for (let i = 0; i < numRoutes; i++) {
                        const path = plan.getRoute(i).getPath()
                        paths = paths.concat(path)
                        const polyline = new that.map.bmap.Polyline(path)
                        that.map.map.addOverlay(polyline)
                      }
                      resolve(paths)
                    })
                    driving.search(points[i * 11], points[i * 11 + 11], {waypoints: points.slice(i * 11 + 1, i * 11 + 11)})
                  })
                )
              } else {
                promises.push(new Promise(
                  (resolve, reject) => {
                    const driving = new that.map.bmap.DrivingRoute(that.map.map)
                    driving.setSearchCompleteCallback(results => {
                      const plan = results.getPlan(0)
                      const numRoutes = plan.getNumRoutes()
                      let paths = []
                      for (let i = 0; i < numRoutes; i++) {
                        const path = plan.getRoute(i).getPath()
                        paths = paths.concat(path)
                        const polyline = new that.map.bmap.Polyline(path)
                        that.map.map.addOverlay(polyline)
                      }
                      resolve(paths)
                    })
                    driving.search(points[i * 11], points[points.length - 1], {waypoints: points.slice(i * 11 + 1, points.length - 1)})
                  })
                )
              }
              Promise.all(promises).then(results => {
                const path = results.reduce((x, y) => {
                  return x.concat(y)
                })
                const pathlength = path.length

                function resetMkPoint (i) {
                  if (path[i] === undefined) {
                    return
                  }
                  that.vehicle.position.longitude = path[i].lng
                  that.vehicle.position.latitude = path[i].lat
                  if (i < pathlength) {
                    that.timeout = setTimeout(() => {
                      i++
                      resetMkPoint(i)
                    }, that.speed)
                  }
                }

                that.map.map.setViewport(path)
                that.vehicle.show = true
                that.speed = 5
                clearTimeout(that.timeout)
                that.timeout = setTimeout(() => resetMkPoint(5), 10)
              })
            }
          }
        }).catch(error => console.log(error))
      },
      handleAccelerate () {
        this.speed = this.speed / 10
      },
      handleDecelerate () {
        this.speed = this.speed * 10
      },
      handleStop () {
        clearTimeout(this.timeout)
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
