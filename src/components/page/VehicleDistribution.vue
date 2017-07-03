<template>
  <chart id="map" :options="map"></chart>
</template>

<script>
  import axios from 'axios'
  import 'echarts/theme/dark'

  import ECharts from 'vue-echarts/components/ECharts.vue'

  import chinaMap from '../../store/china.json'
  ECharts.registerMap('china', chinaMap)

  export default {
    components: {
      chart: ECharts
    },
    data: function () {
      return {
        map: {
          title: {
            text: '车辆分布',
            subtext: '根据各省进行显示',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['车辆数量']
          },
          visualMap: {
            min: 0,
            max: 100,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true
          },
          series: [
            {
              name: '车辆数量',
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              data: []
            }
          ]
        }
      }
    },
    beforeCreate () {
      const that = this
      axios.get('/api/vehicles/distribution')
        .then(response => {
          if (response.status === 200) {
            that.map.series[0].data = response.data
          }
        })
        .catch(error => console.log(error))
    }
  }
</script>

<style scoped>
  #map {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
