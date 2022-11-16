import Track from "./track";
import { parsePositionValueData } from "../data-parser";
import assign from "lodash/assign";
import { radial, axes, common, values } from "../configs";
import {
  symbol,
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolTriangle,
  symbolStar,
  symbolWye,
} from "d3-shape";

import { registerTooltip } from "../tooltip/tooltip";
import * as d3 from "d3";

const defaultConf = assign(
  {
    direction: {
      value: "out",
      iteratee: false,
    },
    color: {
      value: "#fd6a62",
      iteratee: true,
    },
    fill: {
      value: true,
      iteratee: false,
    },
    size: {
      value: 15,
      iteratee: true,
    },
    shape: {
      value: "circle",
      iteratee: false,
    },
    strokeColor: {
      value: "#d3d3d3",
      iteratee: true,
    },
    strokeWidth: {
      value: 2,
      iteratee: true,
    },
    backgrounds: {
      value: [],
      iteratee: false,
    },
  },
  axes,
  radial,
  common,
  values,
);

const getSymbol = (key) => {
  switch (key) {
    case "circle":
      return symbolCircle;
    case "cross":
      return symbolCross;
    case "diamond":
      return symbolDiamond;
    case "square":
      return symbolSquare;
    case "triangle":
      return symbolTriangle;
    case "star":
      return symbolStar;
    case "wye":
      return symbolWye;
    default:
      return symbolCross;
  }
};

export default class Scatter extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf, data, parsePositionValueData);
  }

  renderDatum(parentElement, conf, layout) {
    const point = parentElement
      .selectAll(".point")
      .data((d) => {
        d.values.forEach((item, i) => {
          item.symbol = symbol().type(getSymbol(conf.shape)).size(conf.size);
        });
        return d.values;
      })
      .enter()
      .append("path")
      .attr("class", "point")
      .attr("opacity", conf.opacity)
      .attr("id", (d) => d.id)
      .attr("d", (d, i, j) => d.symbol(d, i, j))
      .attr("transform", (d) => {
        return `
          translate(
            ${this.x(d, layout, conf)},
            ${this.y(d, layout, conf)}
          ) rotate(
            ${
              (this.theta(d.position, layout.blocks[d.block_id]) * 360) /
              (2 * Math.PI)
            }
          )`;
      })
      .attr("stroke", conf.strokeColor)
      .attr("stroke-width", conf.strokeWidth)
      .attr("fill", "none")
      .on("mouseover", (d) => {
        const id = d.id;

        const assoc_points = d3
          .selectAll(".chord")
          .filter((d) => [d.cpgData.id, d.snpData.id].includes(id))
          .data();

        const cpg_ids = assoc_points.map((d) => d.cpgData.id);
        const snp_ids = assoc_points.map((d) => d.snpData.id);
        const valid_points = cpg_ids.concat(snp_ids);

        console.log(valid_points);

        d3.selectAll(".chord")
          .filter((d) => ![d.cpgData.id, d.snpData.id].includes(id))
          .style("visibility", "hidden");

        d3.selectAll(".point")
          .filter((d) => !valid_points.includes(d.id))
          .style("visibility", "hidden");

        this.dispatch.call("mouseover", this, d);
      })

      .on("mouseout", (d) => {
        d3.selectAll(".chord").style("visibility", "visible");
        d3.selectAll(".point").style("visibility", "visible");
        this.dispatch.call("mouseout", this, d);
      });

    if (conf.fill) {
      point.attr("fill", conf.colorValue);
    }

    return point;
  }
}
