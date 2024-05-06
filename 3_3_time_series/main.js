/* CONSTANTS AND GLOBALS */
const width = 800,
  height = 400,
  margin = { top: 30, right: 20, bottom: 30, left: 50 };

// these variables allow us to access anything we manipulate in init() but need access to in draw().
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "All", // You can update this to reflect your filter selection if needed
};


/* LOAD DATA */
d3.csv('../data/temp.csv', d3.autoType)
  .then(raw_data => {
    console.log("data", raw_data);
    // Check for NaN or undefined Temperature values
    const invalidTemperature = raw_data.some(d => isNaN(d.Temperature) || typeof d.Temperature === 'undefined');
    if (invalidTemperature) {
      console.error('Invalid Temperature values in the data.');
      return;
    }
    // save our data to application state
    state.data = raw_data;
    init(); // Call init() inside the then() function
  })
  .catch(error => console.log(error)); // Error handling for data loading failure

/* INITIALIZING FUNCTION */
function init() {
  // SCALES
  xScale = d3.scaleTime()
    .domain(d3.extent(state.data, d => d.Date))
    .range([margin.left, width - margin.right]);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.Temperature)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y-%m-%d")); // Format the dates as desired

  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP (if any)

  // CREATE SVG ELEMENT
  svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

  // CALL AXES
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Create and call y-axis
  svg.append("g")
    .attr("class", "y-axis")  // This class is used to select the y-axis for updating
    .attr("transform", `translate(${margin.left},0)`)  // Move it to the appropriate position
    .call(yAxis);

  draw(); // calls the draw function
}


/* DRAW FUNCTION */
function draw() {
  // FILTER DATA BASED ON STATE (if any)
  const filteredData = state.data;

  // UPDATE LINE GENERATOR FUNCTION
  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d.Temperature));

  // DRAW LINE
  svg.selectAll(".line")
    .data([filteredData]) // Bind data as an array for single line
    .join("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // DRAW DOTS
  const dots = svg.selectAll(".dot")
    .data(filteredData, d => d.Date); // Key function to properly identify data points

  dots.enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Date))
    .attr("cy", d => yScale(d.Temperature))
    .attr("r", 0) // Start with zero radius for enter transition
    .style("fill", "steelblue") // Example color for the dots
    .merge(dots) // Merge enter and update selections
    .transition()
    .duration(1000) // Transition duration
    .attr("cx", d => xScale(d.Date))
    .attr("cy", d => yScale(d.Temperature))
    .attr("r", 5); // Final radius after transition

  dots.exit()
    .transition()
    .duration(500)
    .attr("r", 0)
    .remove();

   // UPDATE Y-AXIS LABELS
   svg.select(".y-axis")
   .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0)); // Adjust tick count as needed
}



