<template>
  <div style="width: 100%; height: 100%;">
    <div style="width: 33%;height: 300px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
      <div v-loading="hotVis" ref="container" style="height: 100%"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import axios from 'axios'

  export default {
    name: "index",
    data() {
      return {
        hotword_max: 100,
        hotword_indicator: [],
        hotVis: true,
        hot_value: []
      }
    },
    methods: {
      hotword() {
        axios.get('/api/reptile/hotword/get')
          .then(response => {
            this.hotVis = false;
            if (response.data.success) {
              var data = response.data.data;
              if (data.length > 0) {
                this.hotword_max = data[0].count;
                data.forEach(hot => {
                  this.hotword_indicator.push({text: hot.keyword, max: this.hotword_max})
                  this.hot_value.push(hot.count);
                  this.$nextTick(function () {
                    this.radar();
                  })
                })
              }
            }
          });
      },
      radar() {
        var dom = this.$refs.container;
        var myChart = echarts.init(dom);
        var option = null;
        option = {
          title: {
            text: '年度热词'
          },
          tooltip: {
            trigger: 'axis'
          },
          radar: [
            {
              indicator: this.hotword_indicator,
              center: ['50%', '50%'],
              radius: 80
            }
          ],
          series: [
            {
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              areaStyle: {},
              data: [
                {
                  value: this.hot_value,
                  name: '年度热词'
                }
              ]
            }
          ]
        };

        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        }
      }
    },
    created() {
      this.$nextTick(function () {
        this.hotword();
      })
    }
  }
</script>

<style scoped>

</style>
