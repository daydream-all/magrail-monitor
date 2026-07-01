<template>
  <div class="container">
    <h1>🚄 磁轨智行监控系统（比赛级UI）</h1>
    <div id="chart" style="width:100%;height:400px;"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'

onMounted(() => {
  const chart = echarts.init(document.getElementById('chart'))
  chart.setOption({
    title: { text: '车辆速度实时监控' },
    xAxis: { type: 'category', data: ['1','2','3','4','5'] },
    yAxis: { type: 'value' },
    series: [{
      data: [10, 22, 28, 35, 40],
      type: 'line',
      smooth: true
    }]
  })
})
</script>

<style>
.container {
  padding: 20px;
  font-family: Arial;
}
h1 {
  color: #00c3ff;
}
</style>