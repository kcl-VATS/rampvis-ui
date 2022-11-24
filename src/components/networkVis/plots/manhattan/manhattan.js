import * as d3 from "d3";

export function manhattanPlot(data, limit) {
  d3.select("#manhattan").html("");
  console.log(data);
  const result = data;
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the SVG object to the body of the page
  const svg = d3
    .select("#manhattan")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "manhattanPlot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x_margin = 10;

  const [min_p, max_p] = [
    Math.min(...result.map((o) => o["value"])) - x_margin,
    Math.max(...result.map((o) => o["value"])) + x_margin,
  ];
  const [min_x, max_x] = [...limit];

  console.log(min_x, max_x);

  // Add X axis
  const x = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(90) translate(30,0)");

  console.log("data", result);

  // Add Y axis
  const y = d3.scaleLinear().domain([min_p, max_p]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y).tickSize(0));

  const scatter = svg.append("g").attr("clip-path", "url(#clip)");
  scatter
    .selectAll("circle")
    .data(result)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d["position"]);
    })
    .attr("cy", function (d) {
      return y(d["value"]);
    })

    .attr("r", 5);
  /*
    .style("fill", function (d) {
      return colorScale(d["-log(pval)"]);
    });
  
    */
}
