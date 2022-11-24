import * as d3 from "d3";

export function manhattanPlot(snpData, cpgData, limit) {
  d3.select("#manhattan").html("");

  const result = snpData;
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const x_margin = 10;

  const [min_p, max_p] = [
    Math.min(...result.map((o) => o["value"])) - x_margin,
    Math.max(...result.map((o) => o["value"])) + x_margin,
  ];
  const [min_x, max_x] = [...limit];

  console.log(min_x, max_x);

  // append the SVG object to the body of the page
  const svg = d3
    .select("#manhattan")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "manhattanPlot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const clip = svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height / 1.5)
    .attr("x", 0)
    .attr("y", 0);

  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height / 1.5],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  const y = d3
    .scaleLinear()
    .domain([min_p, max_p])
    .range([height / 1.5, 0]);
  const yAxis = svg.append("g").call(d3.axisLeft(y));

  // Add X axis
  const x = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height / 1.5 + ")")
    .call(d3.axisBottom(x));

  const x_cpg = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  const xAxis_cpg = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x_cpg).tickSize(0));

  // Add Y axis

  const scatterSnp = svg.append("g").attr("id", "scatterSnp");
  scatterSnp
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

    .attr("r", 3);

  const scatterCpg = svg.append("g").attr("id", "scatterCpg");

  scatterCpg
    .selectAll("circle")
    .data(cpgData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x_cpg(d["position"]))
    .attr("cy", (d) => height)
    .attr("r", 3)
    .attr("fill", (d) => {
      return "red";
    });

  scatterSnp.append("g").attr("class", "brush").call(brush);

  let idleTimeout;

  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart() {
    const extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain([min_x, max_x]);
      x_cpg.domain([min_x, max_x]);
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      x_cpg.domain([x_cpg.invert(extent[0]), x_cpg.invert(extent[1])]);
      scatterSnp.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    xAxis_cpg.transition().duration(1000).call(d3.axisBottom(x_cpg));
    scatterSnp
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d["position"]);
      })
      .attr("cy", function (d) {
        return y(d["value"]);
      });
    scatterCpg
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x_cpg(d["position"]);
      })
      .attr("cy", function (d) {
        return height;
      });
  }
}
