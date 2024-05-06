/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth*0.8,
   height = window.innerHeight*0.8,
   margin = 70,
   radius = 5,
   colorScale = d3.scaleOrdinal(d3.schemeTableau10);


// // since we use our scales in multiple functions, they need global scope
let xScale, yScale, svg;

/* APPLICATION STATE */
let state = {
  data: [],
};

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;

  init();
  console.log(state.data);
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {

  svg = d3.select("#container")
    .append('svg')
    .attr("width", width)
    .attr("height", height);
    
  /* SCALES */

  yScale = d3.scaleBand()
  .domain(state.data.map(d=>d.Nationality))
  .range([0, height-margin])
  .paddingInner(0.1)
  .paddingOuter(0.2);

  xScale = d3.scaleLinear()
  .domain([0, Math.max(...state.data.map(d=>d.Count + height))])
  .range([margin,width]);
  




  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
 
  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
  .attr("transform", `translate(${margin}, 0)`)
  .call(yAxis)
  .style("font-size", "14px");
  
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
  .attr("transform", `translate(0, ${height - margin})`)
  .call(xAxis)
  .style("font-size", "14px");

  svg.selectAll(".bar")
  .data(state.data)
  .join("rect")
  .attr("class", "bar")
  .attr("x", d=>xScale(0))
  .attr("y", d=>yScale(d.Nationality))
  .attr("width", d=> xScale(d.Count) - margin)
  .attr("height", yScale.bandwidth())
  .attr("fill", d=>colorScale(d.Nationality));

  svg.selectAll(".text")
  .data(state.data)
  .join("text")
  .attr("class","text")
  .attr("x", d=>xScale(d.Count))
  .attr("y", d=>yScale(d.Nationality) + yScale.bandwidth()/2)
  .text(d=>d.Count);



}