import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import * as Utils from '@utils'

const ChartPieComponent = ({ width, height, dataJira }) => {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null) // Thêm một ref để lưu trữ đối tượng biểu đồ


    const data = {
        labels: ['Todo', 'Doing', 'Done'],
        datasets: [{// eslint-disable-line
            label: 'My First Dataset',
            data: [dataJira && dataJira ? dataJira.totalToDo : 0, dataJira && dataJira ? dataJira.totalInProgress : 0, dataJira && dataJira ? dataJira.totalDone : 0],
            backgroundColor: [// eslint-disable-line
                Utils.CHART_COLORS.blue,
                Utils.CHART_COLORS.red,
                Utils.CHART_COLORS.green
            ],// eslint-disable-line
            hoverOffset: dataJira && dataJira ? dataJira.totalIssues : 0
        }]// eslint-disable-line
    }
    const config = {
        type: 'pie',
        data: data,// eslint-disable-line
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Progress Statistics'
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
    }, [])

    return <canvas ref={chartRef} width={width} height={height} />
}

export default ChartPieComponent
