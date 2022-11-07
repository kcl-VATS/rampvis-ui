import Track from "./track";
import { parseChordData } from "../data-parser";
import * as d3 from "d3";
import assign from "lodash/assign";
import isFunction from "lodash/isFunction";
import { common, values } from "../configs";
import { CollectionsBookmarkRounded } from "@mui/icons-material";

const defaultConf = assign(
  {
    color: {
      value: "#fd6a62",
      iteratee: true,
    },
    radius: {
      value: null,
      iteratee: false,
    },
  },
  common,
  values,
);

const normalizeRadius = (radius, layoutRadius) => {
  if (radius >= 1) return radius;
  return radius * layoutRadius;
};

const betaColor = (beta) => {
  if (beta < 0) {
    return "#fd6a62";
  } else {
    return "#a1d99b";
  }
};

export default class Chords extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf, data, parseChordData);
  }

  getCoordinates(d, layout, conf, datum) {
    const block = layout.blocks[d.id];
    const startAngle =
      block.start + (d.start / block.len) * (block.end - block.start);
    const endAngle =
      block.start + (d.end / block.len) * (block.end - block.start);

    let radius;
    if (isFunction(conf.radius)) {
      radius = normalizeRadius(conf.radius(datum), layout.conf.innerRadius);
    } else if (conf.radius) {
      radius = normalizeRadius(conf.radius, layout.conf.innerRadius);
    }

    if (!radius) {
      radius = layout.conf.innerRadius;
    }

    return {
      radius,
      startAngle,
      endAngle,
    };
  }

  renderChords(parentElement, name, conf, data, instance, getCoordinates) {
    const track = parentElement.append("g");
    const link = track
      .selectAll(".chord")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "chord")
      .attr("fill", (d) => betaColor(d.betaValue.value))
      .attr("id", (d) => d.cpgData.id + "-" + d.snpData.id)
      .attr(
        "d",
        d3
          .ribbon()
          .source((d) =>
            getCoordinates(d.source, instance._layout, this.conf, d),
          )
          .target((d) =>
            getCoordinates(d.target, instance._layout, this.conf, d),
          ),
      )
      .attr("opacity", conf.opacity)
      .on("mouseover", (d) => {
        const selected_id_cpg = d3.selectAll("#" + d.cpgData.id).attr("id");
        const selected_id_snp = d3.selectAll("#" + d.snpData.id).attr("id");

        d3.selectAll(".chord")
          .filter(
            (d) =>
              d.cpgData.id + "-" + d.snpData.id !=
              selected_id_cpg + "-" + selected_id_snp,
          )
          .style("visibility", "hidden");
        d3.selectAll(".point")
          .filter((d) => ![selected_id_snp, selected_id_cpg].includes(d.id))
          .style("visibility", "hidden");
      })
      .on("mouseout", (d) => {
        d3.selectAll(".chord").style("visibility", "visible");
        d3.selectAll(".point").style("visibility", "visible");
      });

    return link;
  }

  render(instance, parentElement, name) {
    parentElement.select("." + name).remove();

    const track = parentElement
      .append("g")
      .attr("class", name)
      .attr("z-index", this.conf.zIndex);

    const selection = this.renderChords(
      track,
      name,
      this.conf,
      this.data,
      instance,
      this.getCoordinates,
    );

    /*
    if (this.conf.tooltipContent) {
      registerTooltip(this, instance, selection, this.conf)
    }
    */

    return this;
  }
}
