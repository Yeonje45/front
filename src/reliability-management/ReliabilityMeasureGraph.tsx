import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { IGraphModelResult } from "./ReliabilityFieldData";
import { AIRAMPAxios } from "models";
import { SRR_RADC_AFactor } from "reliability-management/SrrRadcConstants";

interface IProps {
  data: IGraphModelResult[]
}

const ReliabilityMeasureGraph = ({data}: IProps) => {
  const [targetValue, setTargetValue] = useState<string|undefined>("")

  const getTargetValue = async () => {
		const res = await AIRAMPAxios.get(`radc-srrs/2/`);

    if(res && SRR_RADC_AFactor.field[0].fielddata.find((d) => d.item!.includes(res.data.AFactor))!.question[0]) {
      const fieldData = SRR_RADC_AFactor.field[0].fielddata.find((d) => d.item && d.item.includes(res.data.AFactor));
      if (fieldData && fieldData.question) {
        setTargetValue(`${parseFloat(fieldData.question[0]) * 1000}`);
      }
    }
  }

  const refGraph = useRef<HTMLDivElement>(null)
  const label_key = ["SRR", "PDR", "CDR", "Implementation"]
  const data_key = ["RADC", "Shortcut", "IndustryApplication", "CMMI", "FullScale"]
  const colors = ["rgb(0 122 244)", "rgb(255 108 108)", "rgb(255 172 89)", "rgb(48 195 89)", "rgb(140 10 65)"]

  const GroupData = () => {
    const y_max:number = d3.max(data.map((d) => d3.max(data_key.map((key) => d[key] as number)) as number)) || 0 
    
    // x,y 축 설정
     const width = 750; // 넓이 설정
     const height = 400; // 높이 설정
     const margin = { top: 20, right: 20, bottom: 50, left: 40 }; // 마진 설정
 
     let x0 = d3
       .scaleBand()
       .domain(label_key)
       .rangeRound([0, width])
       .padding(0.4);
 
     let x1 = d3
       .scaleBand()
       .domain(data_key)
       .rangeRound([0, x0.bandwidth()]);
 
     const y = d3
       .scaleLinear()
       .domain([0, Math.ceil(y_max)])
       .rangeRound([height, 0]);
 
     const color = d3
       .scaleOrdinal()
       .domain(data_key)
       .range(colors);
 
     const svg = d3
       .select(refGraph.current)
       .html("") // 기존 요소 삭제
       .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);
 
     svg
       .append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(x0))
       .selectAll("text")
       .style("text-anchor", "middle")
       .style("font-size", "15px");
       
     const yAxis = d3
       .axisLeft(y)
       .tickSize(-width)
       .ticks("8")
       .tickSizeOuter(0)
       
     svg.append('g')
       .style('font-size', '15px')
       .call(yAxis)
       .selectAll('.tick line')
       .attr('stroke-dasharray', '2,2') // y축 눈금선에 점선 효과 추가
       .attr('stroke', (d, i) => {
         // 첫 번째 눈금선(맨 아래)은 검은색으로 설정
         if (i === 0) {
           return '#000';
         }
         return '#ddd'; // 나머지 눈금선은 회색으로 설정
       });

    const getEvent = () => require("d3-selection").event


     const bars = svg
       .append("g")
       .selectAll("g")
       .data(data)
       .enter()
       .append("g")
       .attr("transform", (d) => `translate(${x0(d.label)},0)`)
       .selectAll("rect")
       .data((d) => data_key.map((key) => ({ key, value: d[key] as number })))
       .enter()
       .append("rect")
       .attr("x", (d) => x1(d.key) as number)
       .attr("y", (d) => y(d.value))
       .attr("width", x1.bandwidth())
       .attr("height", (d) => y(0) - y(d.value))
       .attr("fill", (d) => color(d.key) as string)
       .on('mousemove', (d) => {
         const xPos = getEvent().pageX - 60;
         const yPos = getEvent().pageY - 60;         
         d3.select('#tooltip').remove();
 
         d3
         .select("body")
         .append('div')
         .attr('id', 'tooltip')
         .style('position', 'absolute')
         .style('display', 'inline-block')
         .style('background-color', '#fff')
         .style('border', '1px solid #ccc')
         .style('padding', '10px')
         .style('z-index', 10)  
         ;

         d3
          .select('#tooltip')
          .style('left', `${xPos}px`)
          .style('top', `${yPos}px`)
          .style('display', 'inline-block')
          .html(`${d.key} : ${Math.round(d.value * 10000) / 10000}`);
       })
       .on('mouseout', (e, d) => {
        d3.select('#tooltip').remove();
       });

       if(targetValue) {
         svg
          .append("g")
          .append("line")
          .attr("class", "target-value-line")
          .attr("x1", 0)
          .attr("y1", y(Number(targetValue)))
          .attr("x2", width)
          .attr("y2", y(Number(targetValue)))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "5");

        svg
          .append("g")
          .append("text")
          .attr("class", "max-text")
          .attr("x", width)
          .attr("y", y(Number(targetValue)) - 5)
          .text(targetValue)
          .style("font-size", "15px")
          .style("text-anchor", "end")
       }

     // Graph Box Frame width
     svg
       .append("rect")
       .attr("width", width)
       .attr("height", 1)
       .attr("fill", "black")
 
     // Graph Box Frame height
     svg
       .append("rect")
       .attr("width", 1)
       .attr("height", height)
       .attr("fill", "black")
       .attr("transform", `translate(${width}, 0)`)  
  }

  useEffect(() => {
    data.length === 4 && GroupData()
    getTargetValue()
  }, [refGraph.current, data])

  const legendData = [
    {
      label: "목표값",
      color: "black",
      dasharray: 10,
    },
    {
      label: "RADC",
      color: "rgb(0 122 244)",
    },
    {
      label: "Shortcut",
      color: "rgb(255 108 108)",
    },
    {
      label: "IndustryApplication",
      color: "rgb(255 172 89)",
    },
    {
      label: "CMMI",
      color: "rgb(48 195 89)",
    },
    {
      label: "FullScale",
      color: "rgb(140 10 65)",
    },
  ]

  return (
    <div className="flex items-center w-full">
      <div className="flex items-center justify-center w-full p-2">
        <div className="flex flex-col p-3 text-center bg-white border shadow-sm gap-3">
          <div className="text-xl font-bold">범례</div>
          <div className="flex gap-3">
            <ul className="flex flex-col gap-2">
              {
                legendData.map((d, index_st) => (
                  <li key={index_st} className="flex items-center gap-3">
                    <svg width={50} height={20}><line x1={0} x2={50} y1={10} y2={10} strokeWidth={5} stroke={d.color} strokeDasharray={d.dasharray}></line></svg>
                    <div>{d.label}</div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div> 
      </div>
      <div className="w-full h-full p-5" ref={refGraph}></div>
    </div>
  )
}

export default ReliabilityMeasureGraph;
