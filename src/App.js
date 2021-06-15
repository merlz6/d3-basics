import React, {useRef, useEffect, useState} from 'react';
import './App.css';
import {select, line, curveCardinal, axisBottom, axisRight, scaleLinear} from 'd3';

function App() {
  const svgRef = useRef()
  const [data, setData] = useState([25,30,45,60,50, 60, 22, 50, 65,76,45])

  useEffect(()=> {
    console.log(svgRef)
    const svg = select(svgRef.current);

    //domain is to scale up or down chart going from 0 to data.length - 1 , the range is going from 0 the starting to point to 300 because the svg is 300 px wide
    const xScale = scaleLinear()
                    .domain([0,data.length-1])
                    .range([0, 300])
    // domain going to 75 as its the largest value(top of chart), range is 150 bc svg height is 150px
    const yScale = scaleLinear()
                    .domain([0,75])
                    .range([150, 0])

    const xAxis = axisBottom(xScale)

    //call the xaxis function with the select - transform moves x axis from top of svg to 150px below or the bottom
    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis)
    //call the yaxis function with the select - transform moves y axis from left of svg to 300 right or the right end of svg
    const yAxis = axisRight(yScale)
    svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis)

    //function to create the line
    const myLine = line()
                      .x((value, index) => xScale(index))
                      .y(value => yScale(value))
                      .curve(curveCardinal);
    //creating / placing the line based on the data array  d attribute it linefunction
    svg.selectAll(".line").data([data]).join("path").attr("class", "line").attr("d", value => myLine(value)).attr("fill", "none").attr("stroke", "blue")

  },[data])

  return (
    <React.Fragment>
    <svg ref={svgRef}>
    <g class="x-axis" />
    <g class="y-axis" />


    </svg>
    < br />
    <br />
    <button onClick={()=> setData(data.map(value => value + 5))}> Update Data
    </button>
    <button onClick={()=> setData(data.filter(value => value < 35))}> Filter Data
    </button>
    </React.Fragment>
  );
}

export default App;
