import * as d3 from "d3";

export function manhattanPlot(snpData, cpgData, chordData, limit) {
  d3.select("#manhattan").html(""); // empty manhattan plot

  const margin = { top: 10, right: 30, bottom: 30, left: 60 }, // values for the plot area
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // snp scatter plot related calculations

  const [min_p, max_p] = [
    // snp min and max pval
    Math.min(...snpData.map((o) => o["value"])),
    Math.max(...snpData.map((o) => o["value"])),
  ];
  const [min_x, max_x] = [...limit]; // region to plot

  // append the SVG object to the body of the page
  const svg = d3
    .select("#manhattan")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "manhattanPlot");
  const plot = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // function to handle tooltip actions

  const _tooltip = function _tooltip(selection) {
    const tooltip_select = plot.select(".tooltipSnp");

    selection
      .on("mouseover.tooltipSnp", function (d) {
        tooltip_select.attr(
          "transform",
          `translate(${[d3.mouse(this)[0] - 5, d3.mouse(this)[1] - 35]})`,
        );
        tooltip_select.style("display", null);
        const tooltip_title = tooltip_select
          .select("tspan#tooltip_title")
          .text(`${d.id}`);
        tooltip_select.select("tspan#tooltip_l2").text(`${d.position}`);
        tooltip_select.select("tspan#tooltip_l3").text(`${d.value}`);
      })
      .on("mouseout.tooltipSnp", function (d) {
        svg.select(".tooltipSnp").style("display", "none");
      });
  };

  const tooltip = plot
    .append("g")
    .attr("class", "tooltipSnp")
    .style("display", "none");

  tooltip
    .append("rect")
    .attr("height", 80)
    .attr("fill", "beige")
    .style("opacity", 0.65);

  let text_zone = tooltip
    .append("text")
    .attr("x", 10)
    .attr("dy", "0")
    .style("font-family", "sans-serif")
    .attr("font-size", "11px")
    .style("text-anchor", "start")
    .style("fill", "black");

  text_zone
    .append("tspan")
    .attr("id", "tooltip_l2")
    .attr("x", 10)
    .attr("dy", "14");

  text_zone
    .append("tspan")
    .attr("id", "tooltip_l3")
    .attr("x", 10)
    .attr("dy", "14");

  text_zone
    .append("tspan")
    .attr("id", "tooltip_l4")
    .attr("x", 10)
    .attr("dy", "14");

  // make sure that none of area outside the brush will be drawn
  const clip = plot
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height * 1.3)
    .attr("x", 0)
    .attr("y", 0);

  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  const y = d3
    .scaleLinear()
    .domain([min_p, max_p])
    .range([height / 1.5, 0]);
  const yAxis = plot.append("g").call(d3.axisLeft(y));

  // Add X axis
  const x = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  const xAxis = plot
    .append("g")
    .attr("transform", "translate(0," + height / 1.5 + ")")
    .call(d3.axisBottom(x));

  const x_cpg = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  const xAxis_cpg = plot
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x_cpg).tickSize(0));

  // Add Y axis

  const scatterSnp = plot.append("g").attr("id", "scatterSnp");

  scatterSnp.append("g").attr("class", "brush").call(brush);

  scatterSnp
    .selectAll("circle")
    .data(snpData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d["position"]);
    })
    .attr("cy", function (d) {
      return y(d["value"]);
    })
    .attr("r", 3)
    .attr("clip-path", "url(#clip)")
    .call(_tooltip);

  const scatterCpg = plot.append("g").attr("id", "scatterCpg");

  scatterCpg
    .selectAll(".dot")
    .data(cpgData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x_cpg(d["position"]))
    .attr("cy", (d) => height)
    .attr("r", 3)
    .attr("fill", (d) => {
      return "red";
    })
    .attr("clip-path", "url(#clip)");

  let curvePoints = [];

  chordData.map((d, i) => {
    const start_x = x_cpg(d["cpg_pos"]);
    const end_x = x(d["snp_pos"]);
    const start_y = height;
    const end_y = y(d["value"]);
    curvePoints.push({
      key: i,
      values: [
        { x: start_x, y: start_y },
        { x: end_x, y: end_y },
      ],
    });
  });

  /*
  const chordSvg = svg.append("g").attr("id","chord");

  chordSvg.selectAll(".line")
  .data(curvePoints)
  .enter()
  .append("path")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
      return d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        (d.values)
    })

  */

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
