import React, {useRef, useEffect, useState} from 'react';
import './App.css';
import {select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleBand} from 'd3';

function App() {
  const svgRef = useRef()
  const [data, setData] = useState([25,35,45,50,20, 40,60])

  useEffect(()=> {
    console.log(svgRef)
    const svg = select(svgRef.current);

    //domain spliting the "bands by the number so 5 bands "
    const xScale = scaleBand()
                    .domain(data.map((value,index)=>index))
                    .range([0, 300])
                    //padding to space the bars
                    .padding(0.5)
    // domain going to 75 as its the largest value(top of chart), range is 150 bc svg height is 150px
    const yScale = scaleLinear()
                    .domain([0,150])
                    .range([150, 0])


    const colorScale = scaleLinear()
                    .domain([75,100,150])
                    .range(["green","orange","red"])
                    //clamp will allow us to still return green or red values for domains outside of the numberlisted
                    .clamp(true)




    const xAxis = axisBottom(xScale).ticks(data.length)



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
    //x is used to place bar over ticks , y is to place them at the difference between chart height and them (aka on the bar line y=0)
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")

      //flip bars upside down, transform are from origin(top right corner of svg)
      .style("transform", "scale(1,-1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -150)
      .attr("width", xScale.bandwidth())
      //
      .on("mouseenter", (event, value) => {
        const index = svg.selectAll(".bar").nodes().indexOf(event.target);
                svg
                  .selectAll(".tooltip")
                  .data([value])
                  .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
                  .attr("class", "tooltip")
                  .text(value)
                  .attr("x", xScale(index) + xScale.bandwidth() / 2)
                  .attr("text-anchor", "middle")
                  .transition()
                  .attr("y", yScale(value) - 8)
                  .attr("opacity", 1);
              })
       .on("mouseleave", () => svg.select(".tooltip").remove())
       .transition()
       .attr("fill", colorScale)
       .attr("height", value=> 150 - yScale(value))
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
    <button onClick={() => setData([...data, Math.round(Math.random() * 100)])}>
    Add data
    </button>
    </React.Fragment>
  );
}

export default App;
