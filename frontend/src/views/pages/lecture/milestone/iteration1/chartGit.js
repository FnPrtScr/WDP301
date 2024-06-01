import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import * as Utils from '@utils'
const ChartComponent = ({ width, height, formattedDataGit, status }) => {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null) // Thêm một ref để lưu trữ đối tượng biểu đồ
  const labels = formattedDataGit ? formattedDataGit.commitsByDate.map(item => item.date) : []
  const commitsArray = formattedDataGit.commitsByDate.map(item => item.commits)
  const data = {
    labels,
    datasets: [
      {
        label: 'Commits',
        data: formattedDataGit && formattedDataGit.commitsByDate ? formattedDataGit.commitsByDate?.map(item => item.commits) : [],
        borderColor: Utils.CHART_COLORS.blue,
        backgroundColor: status ? Utils.transparentize(Utils.CHART_COLORS.red, 0) : Utils.transparentize(Utils.CHART_COLORS.blue, 0)
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
          text: `Statistics commits by: ${formattedDataGit.author}`
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: commitsArray.reduce((total, commits) => total + commits, 0),
          title: {
            display: true,
            text: 'Total Commits'
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
  }, [formattedDataGit])

  return <canvas ref={chartRef} width={width} height={height} />
}

export default ChartComponent
