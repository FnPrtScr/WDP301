import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import * as Utils from '@utils'

const ChartPieComponent = ({ width, height, dataPie }) => {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null) // Thêm một ref để lưu trữ đối tượng biểu đồ

    const data = {
        labels: ['PASS', 'NOT PASSED'],
        datasets: [{// eslint-disable-line
            label: 'My First Dataset',
            data: [dataPie ? dataPie?.aboveFivePercentage : 0, dataPie ? dataPie?.belowFivePercentage : 0],
            backgroundColor: [// eslint-disable-line
                Utils.CHART_COLORS.green,
                Utils.CHART_COLORS.red
            ],// eslint-disable-line
            //hoverOffset: data && data ? data.totalIssues : 0
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
                    text: 'Pass/Not Pass Statistics'
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
