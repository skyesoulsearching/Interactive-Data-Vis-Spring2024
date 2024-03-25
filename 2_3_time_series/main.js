
d3.csv("temp.csv").then(function(data) {
  
  data.forEach(function(d) {
      d.Date = new Date(d.Date);
      d.Temperature = +d["Temperature (Fahrenheit)"];
  });

  
  const width = 800;
  const height = 600;
  const margin = { top: 60, right: 20, bottom: 70, left: 70 }; 

  
  const xScale = d3.scaleLinear()
      .domain([1, 15]) 
      .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Temperature)])
      .range([height - margin.bottom, margin.top]);

  
  const area = d3.area()
      .x((d, i) => xScale(i + 1)) 
      .y0(yScale(0))
      .y1(d => yScale(d.Temperature));

  
  const svg = d3.select("#chart")
      .attr("width", width)
      .attr("height", height);

  
  svg.append("text")
    .attr("class", "main-title") 
   .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
  .style("font-size", "22px")
  .text("March 2024 NYC Temperatures");


  
  svg.append("path")
      .datum(data)
      .attr("fill", "green")
      .attr("d", area);

  
  svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickValues(d3.range(1, 16))) 
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.bottom - 10)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Date");

  
  svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("dy", "-1em")
      .attr("text-anchor", "middle")
      .text("Temperature (Fahrenheit)");
});
