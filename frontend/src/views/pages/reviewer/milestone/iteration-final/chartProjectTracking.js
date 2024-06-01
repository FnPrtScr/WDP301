import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import * as Utils from '@utils'

const ChartComponent = ({ width, height, dataProjectTracking }) => {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null) // Thêm một ref để lưu trữ đối tượng biểu đồ
  const labels = dataProjectTracking && dataProjectTracking.arrDataStatisticByName ? dataProjectTracking.arrDataStatisticByName?.map(item => item.assignee) : []
  const data = {
    labels,
    datasets: [
      {
        label: 'To do',
        data: dataProjectTracking && dataProjectTracking.arrDataStatisticByName ? dataProjectTracking.arrDataStatisticByName?.map(item => item.toDo) : [],
        borderColor: Utils.CHART_COLORS.blue,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0)
      },
      {
        label: 'Doing',
        data: dataProjectTracking && dataProjectTracking.arrDataStatisticByName ? dataProjectTracking.arrDataStatisticByName?.map(item => item.inProgress) : [],
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0)
      },
      {
        label: 'Done',
        data: dataProjectTracking && dataProjectTracking.arrDataStatisticByName ? dataProjectTracking.arrDataStatisticByName?.map(item => item.done) : [],
        borderColor: Utils.CHART_COLORS.green,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0)
      }
    ]
  }
  const config = {
    type: 'bar',
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Statistics for issues by each member'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: dataProjectTracking && dataProjectTracking ? dataProjectTracking?.totalIssues : 0,
          title: {
            display: true,
            text: 'Total Issues'
          },
          ticks: {
            stepSize: 1,
            precision: 0
          }
        }
      }
    }
  }

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    if (chartInstanceRef.current) {
      // Nếu đã tồn tại một biểu đồ, hủy bỏ nó trước khi tạo một biểu đồ mới
      chartInstanceRef.current.destroy()
    }
    // Tạo một biểu đồ mới và lưu trữ đối tượng biểu đồ
    chartInstanceRef.current = new Chart(ctx, config)
  }, [dataProjectTracking])

  return <canvas ref={chartRef} width={width} height={height} />
}

export default ChartComponent
