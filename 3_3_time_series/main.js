/* CONSTANTS AND GLOBALS */
const width = 800,
  height = 400,
  margin = { top: 30, right: 20, bottom: 30, left: 50 };

let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "All",
};

/* LOAD DATA */
d3.csv('../data/temp.csv', d => ({
  Date: new Date(d.Date),
  Temperature: +d["Temperature (Fahrenheit)"]
})).then(raw_data => {
    console.log("data", raw_data);
    state.data = raw_data;
    init();
  })
  .catch(error => console.log(error));

/* INITIALIZING FUNCTION */
function init() {
  xScale = d3.scaleTime()
    .domain(d3.extent(state.data, d => d.Date))
    .range([margin.left, width - margin.right]);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.Temperature)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y-%m-%d"));
  const yAxis = d3.axisLeft(yScale);

  svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  draw();
}

/* DRAW FUNCTION */
function draw() {
  const filteredData = state.data;

  console.log("Filtered Data: ", filteredData);
  filteredData.forEach(d => {
    console.log(`Date: ${d.Date}, Temperature: ${d.Temperature}, x: ${xScale(d.Date)}, y: ${yScale(d.Temperature)}`);
  });

  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Temperature));

  console.log("Line Path Data: ", line(filteredData));

  svg.selectAll(".line")
    .data([filteredData])
    .join("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  const dots = svg.selectAll(".dot")
    .data(filteredData, d => d.Date);

  dots.enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Date))
    .attr("cy", d => yScale(d.Temperature))
    .attr("r", 0)
    .style("fill", "steelblue")
    .merge(dots)
    .transition()
    .duration(1000)
    .attr("cx", d => xScale(d.Date))
    .attr("cy", d => yScale(d.Temperature))
    .attr("r", 5);

  dots.exit()
    .transition()
    .duration(500)
    .attr("r", 0)
    .remove();

  svg.select(".y-axis")
    .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0));
}
