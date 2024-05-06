/* CONSTANTS AND GLOBALS */
const width = 800;
const height = 600;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const radius = 5; // Default radius for dots

/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    console.log(data);

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Length)]) // Adjust the domain based on the length of artworks
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Width)]) // Adjust the domain based on the width of artworks
      .range([height - margin.bottom, margin.top]);

    const lifespanScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Lifespan)]) // Adjust the domain based on the lifespan of artists
      .range([2, 10]); // Adjust the range of dot sizes

    /* SVG ELEMENT */
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    /* PLOT DATA */
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.Length))
      .attr("cy", d => yScale(d.Width))
      .attr("r", d => {
        // Handle 0 values for artist lifespan
        return d.Lifespan === 0 ? radius : lifespanScale(d.Lifespan);
      })
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);

    /* AXIS */
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    /* AXIS LABELS */
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .attr("text-anchor", "middle")
      .text("Length");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 2)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Width");

    /* TITLE */
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "22px")
      .text("MoMA Distributions: Length vs. Width with Artist Lifespan");
  });
