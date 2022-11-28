import { ContactSupportOutlined } from "@mui/icons-material";
import * as d3 from "d3";

export function manhattanPlot(snpData, cpgData, chordData, limit) {
  const betaColor = (beta) => {
    if (beta < 0) {
      return "#fd6a62";
    } else {
      return "#a1d99b";
    }
  };

  const uniqueGenes = (gene) => [...new Set(gene.split(";"))].join(",");

  const tickSize = 5;

  d3.select("#manhattan").html(""); // empty plot area
  const margin = { top: 10, right: 30, bottom: 30, left: 60 }, // values for the plot area
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // snp scatter plot related calculations

  const [min_p, max_p] = [
    // snp min and max pval
    Math.min(...snpData.map((o) => o["value"])),
    Math.max(...snpData.map((o) => o["value"])) * 1.1,
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

  // function to handle tooltip actions and creating tooltip box

  // this is to cooperate both brushing and tooltip selection in one plot
  const _tooltip_snp = function _tooltip_snp(selection) {
    const tooltip_snp = svg.select(".tooltipSnp");
    selection
      .on("mouseover.tooltipSnp", function (d) {
        tooltip_snp.attr(
          "transform",
          `translate(${[d3.mouse(this)[0] + 70, d3.mouse(this)[1] + 30]})`,
        );

        tooltip_snp.style("display", null);

        tooltip_snp.select("tspan#tooltip_l1").text(`snp : ${d.id}`);
        tooltip_snp.select("tspan#tooltip_l2").text(`beta : ${d.beta}`);
        tooltip_snp.select("tspan#tooltip_l3").text(`pval : ${d.value}`);
        tooltip_snp.select("tspan#tooltip_l4").text(`SE : ${d.se}`);
      })

      .on("mouseout.tooltipSnp", function (d) {
        svg.select(".tooltipSnp").style("display", "none");
      });
  };

  const _tooltip_cpg = function _tooltip_cpg(selection) {
    const tooltip_cpg = svg.select(".tooltipCpg");

    selection
      .on("mouseover.tooltipCpg", function (d) {
        console.log("success");
        tooltip_cpg.attr(
          "transform",
          `translate(${[d3.mouse(this)[0] + 70, d3.mouse(this)[1] - 50]})`,
        );

        tooltip_cpg.style("display", null);
        tooltip_cpg.select("tspan#tooltip_l1").text(`cpg : ${d.id}`);
        tooltip_cpg
          .select("tspan#tooltip_l2")
          .text(`gene : ${uniqueGenes(d.gene)}`);
      })

      .on("mouseout.tooltipSnp", function (d) {
        svg.select(".tooltipCpg").style("display", "none");
      });
  };

  // tooltip creation

  const tooltipCpg = svg
    .append("g")
    .attr("class", "tooltipCpg")
    .style("display", "none");

  const tooltipSnp = svg
    .append("g")
    .attr("class", "tooltipSnp")
    .style("display", "none");

  tooltipSnp
    .append("rect")
    .attr("height", 100)
    .attr("width", 200)
    .attr("fill", "#111111")
    .style("opacity", 0.9);

  tooltipCpg
    .append("rect")
    .attr("height", 50)
    .attr("width", 200)
    .attr("fill", "#111111")
    .style("opacity", 0.9);

  let text_zone_cpg = tooltipCpg
    .append("text")
    .attr("x", 0)
    .attr("dy", 20)
    .attr("font-size", "14")
    .style("text-anchor", "start")
    .style("fill", "white");

  text_zone_cpg
    .append("tspan")
    .attr("id", "tooltip_l1")
    .attr("x", 10)
    .attr("dy", 20);

  text_zone_cpg
    .append("tspan")
    .attr("id", "tooltip_l2")
    .attr("x", 10)
    .attr("dy", 20);

  text_zone_cpg
    .append("tspan")
    .attr("id", "tooltip_l3")
    .attr("x", 10)
    .attr("dy", 20);

  text_zone_cpg
    .append("tspan")
    .attr("id", "tooltip_l4")
    .attr("x", 10)
    .attr("dy", 20);

  let text_zone_snp = tooltipSnp
    .append("text")
    .attr("x", 0)
    .attr("dy", 20)
    .attr("font-size", "14")
    .style("text-anchor", "start")
    .style("fill", "white");

  text_zone_snp
    .append("tspan")
    .attr("id", "tooltip_l1")
    .attr("x", 10)
    .attr("dy", 20);

  text_zone_snp
    .append("tspan")
    .attr("id", "tooltip_l2")
    .attr("x", 10)
    .attr("dy", 20);

  text_zone_snp
    .append("tspan")
    .attr("id", "tooltip_l3")
    .attr("x", 10)
    .attr("dy", 20);

  text_zone_snp
    .append("tspan")
    .attr("id", "tooltip_l4")
    .attr("x", 10)
    .attr("dy", 20);

  // make sure that none of area outside the brush extension will be drawn

  const clip = plot
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height * 1.3)
    .attr("x", 0)
    .attr("y", 0);

  // brush to zoom in on area highlight, double click to reset

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  // axis generation for snp manhattan y-axis
  const snp_y = d3
    .scaleLinear()
    .domain([min_p, max_p])
    .range([height / 1.5, 0]);
  const snp_y_gen = d3.axisLeft(snp_y);
  snp_y_gen.ticks(4);
  const snp_yaxis = plot.append("g").call(snp_y_gen);

  // axis generation for snp manhattan x-axis
  const snp_x = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  const snp_x_gen = d3.axisBottom(snp_x);
  snp_x_gen.ticks(0); // remove labels
  const snp_xaxis = plot
    .append("g")
    .attr("transform", "translate(0," + height / 1.5 + ")")
    .call(snp_x_gen);

  // axis generation for cpg manhattan x-axis
  const cpg_x = d3.scaleLinear().domain([min_x, max_x]).range([0, width]);
  const cpg_x_gen = d3.axisBottom(cpg_x);
  cpg_x_gen.ticks(4);
  cpg_x_gen.tickFormat((d) => d / 1e6 + "Mb");
  const cpg_xaxis = plot
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(cpg_x_gen);

  // scatter points for manhattan snp plot

  const scatterSnp = plot.append("g").attr("id", "scatterSnp");

  scatterSnp.append("g").attr("class", "brush").call(brush);

  scatterSnp
    .selectAll("circle")
    .data(snpData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return snp_x(d["position"]);
    })
    .attr("cy", function (d) {
      return snp_y(d["value"]);
    })
    .attr("r", tickSize)
    .attr("fill", (d) => betaColor(d["beta"]))
    .attr("clip-path", "url(#clip)")
    .call(_tooltip_snp);

  // scatter points for cpg

  const scatterCpg = plot.append("g").attr("id", "scatterCpg");

  scatterCpg
    .selectAll(".dot")
    .data(cpgData)
    .enter()
    .append("circle")
    .attr("cx", (d) => cpg_x(d["position"]))
    .attr("cy", (d) => height)
    .attr("r", tickSize)
    .attr("fill", (d) => {
      return "#ff6400";
    })
    .attr("clip-path", "url(#clip)")
    .call(_tooltip_cpg);

  // curve prototype between snp and cpg layer

  let curvePoints = [];

  chordData.map((d, i) => {
    const start_x = d["cpg_pos"];
    const end_x = d["snp_pos"];
    const start_y = height;
    const end_y = height / 1.4;
    curvePoints.push({
      key: i,
      values: [
        { x: start_x, y: start_y },
        {
          x: start_x + (end_x - start_x) / 2,
          y: start_y + (end_y - start_y) / 2,
        },
        { x: end_x, y: end_y },
      ],
    });
  });

  const chordSvg = plot.append("g").attr("id", "chord");

  chordSvg
    .selectAll(".line")
    .data(curvePoints)
    .enter()
    .append("path")
    .attr("stroke", "black")
    .attr("stroke-width", 1.0)
    .attr("opacity", 0.8)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          return snp_x(d.x);
        })
        .y(function (d) {
          return d.y;
        })
        .curve(d3.curveNatural)(d.values);
    });

  // functions to update chart objects when zooming with brushing

  let idleTimeout;

  function idled() {
    idleTimeout = null;
  }

  function updateChart() {
    const extent = d3.event.selection;
    const cpg_lims = extent?.map((lim) => snp_x.invert(lim));

    // if no selection, back to initial coordinate. Otherwise, update X axis domain

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      snp_x.domain([min_x, max_x]);
      cpg_x.domain([min_x, max_x]);
    } else {
      snp_x.domain([snp_x.invert(extent[0]), snp_x.invert(extent[1])]);
      cpg_x.domain([cpg_x.invert(extent[0]), cpg_x.invert(extent[1])]);
      scatterSnp.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // update x axes for snp and cpg

    console.log(cpg_lims);

    snp_xaxis.transition().duration(1000).call(snp_x_gen);
    cpg_xaxis.transition().duration(1000).call(cpg_x_gen);

    // translate circles for cpg and snp

    scatterSnp
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return snp_x(d["position"]);
      })
      .attr("cy", function (d) {
        return snp_y(d["value"]);
      });

    scatterCpg
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return cpg_x(d["position"]);
      })
      .attr("cy", function (d) {
        return height;
      });

    chordSvg
      .selectAll("path")
      .transition()
      .duration(1000)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return snp_x(d.x);
          })
          .y(function (d) {
            return d.y;
          })(d.values);
      });

    if (cpg_lims) {
      const start = Math.round(cpg_lims[0]);
      const end = Math.round(cpg_lims[1]);
      console.log(start, end);
      const a = chordSvg
        .selectAll("path")
        .filter(
          (d) =>
            d.values[0]["x"] < start ||
            d.values[0]["x"] > end ||
            d.values[2]["x"] < start ||
            d.values[2]["x"] > end,
        )
        .style("visibility", "hidden");
      console.log(a);
    } else {
      chordSvg.selectAll("path").style("visibility", "visible");
    }
  }
}
