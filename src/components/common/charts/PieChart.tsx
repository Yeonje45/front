import { useState, useEffect, useRef } from 'react'
import { ArcElement, Chart, ChartData, Legend, Tooltip } from 'chart.js'
import { getElementAtEvent, Pie } from 'react-chartjs-2'

import { IProjectStepsModel } from 'models/Layout'
import { GetStepName } from 'models/Layout'

Chart.register(ArcElement, Tooltip, Legend);

interface IProps {
  setPieClickData: (data: number) => void
	step: IProjectStepsModel | null
}

export function PieChart({ setPieClickData, step }: IProps) {
  const chartRef = useRef(null)

  const [rederData, setRenderData] = useState<ChartData<"pie"> | null>(null)
  const [clickData, setClickData] = useState<number>(0)

	useEffect(() => {
		if (!step) return
    
    const dataList: number[] = []
    Object.keys(step).map((stepItem, index) => (
      // stepItem 의 value가 0이면 Label이 보이지 않도록 하기 위해 0.1을 더해줌 ( 이를 통해 0.1이하의 값은 보이지 않음 )
      dataList.push(step[stepItem] )
    ))    
  
    let data: ChartData<"pie"> = {

      labels: Object.keys(step).map((stepItem) => GetStepName(stepItem)),
      datasets: [
        {
          data: dataList,
          backgroundColor: [
            '#1F2B6C',
            '#415AA6',
            '#6389DF',
            '#83ABEA',
            '#A3CCF4',
            '#C5B6DE',
            '#E79FC7',
            '#EEB8D4',
            '#F5D0E1'
          ],
          borderWidth: 1,
          offset: Object.keys(step).map((key, index) => index === clickData ? 150 : 0),
        },
      ],
    };

    setRenderData(data)
	}, [step, clickData])

  const PieClickHandler = (e: React.MouseEvent<HTMLCanvasElement, any>) => {
    const chart = chartRef.current
    if(!chart) return
    const click_result = getElementAtEvent(chart, e)
    if(!click_result[0]) return
    const index = click_result[0].index
    if (rederData && rederData.labels) {
      setClickData(index)
      setPieClickData(index)
    }
  } 

  const options = {
    responsive: false,
    // animation: false,
    plugins: {
      // datalabels: {
      //   color: "white",
      //   display: "auto",
      //   anchor: (context: any) => {          
      //     if(context.dataIndex === clickData) {
      //       return "end"
      //     } 
      //     return "center"
      //   },
      //   clamp: true,
      //   // formatter: (value: any, context: any) => {
      //   //   return context.chart.data.labels[context.dataIndex]
      //   // }
      // }
    }
  }

  return (
  rederData ? <Pie
    ref={chartRef}
    options={options}
    width={650}
    height={650}
    data={rederData}
    onClick={PieClickHandler}
  />
  : <></>
  )
}

export default PieChart