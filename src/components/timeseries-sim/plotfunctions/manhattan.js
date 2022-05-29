import * as d3 from "d3";

export function manhattanVats(res) {
  d3.select("#manhattanArea").html("");

  const result = res;
  const red = "#e41a1c";
  const blue = "#377eb8";

  const x_margin = 1000;
  const y_margin = 2;

  const margin = {
      top: 80,
      right: 25,
      bottom: 80,
      left: 80,
    },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  const [min_MAP, max_MAP] = [
    Math.min(...result.map((o) => o["MAPINFO"])) - x_margin,
    Math.max(...result.map((o) => o["MAPINFO"])) + x_margin,
  ];
  const [min_p, max_p] = [0, 10];

  const colorScale = d3.scaleLinear().domain([min_p, max_p]).range([blue, red]);

  // append the svg object to the body of the page
  const svg = d3
    .select("#manhattanArea")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear().domain([min_MAP, max_MAP]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(90) translate(30,0)");

  // Add Y axis
  var y = d3.scaleLinear().domain([min_p, max_p]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y).tickSize(0));

  svg
    .append("g")
    .selectAll("dot")
    .data(result)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d["MAPINFO"]);
    })
    .attr("cy", function (d) {
      return y(d["-log(pval)"]);
    })
    .attr("r", 5)
    .style("fill", function (d) {
      return colorScale(d["-log(pval)"]);
    });
}
