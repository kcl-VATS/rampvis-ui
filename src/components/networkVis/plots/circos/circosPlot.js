import * as d3 from "d3";
import Layout from "./layout";
import render from "./render/render";
import Chords from "./tracks/chord";
import Scatter from "./tracks/scatter";
import Highlight from "./tracks/highlight";
import defaultsDeep from "lodash/defaultsDeep";

const defaultConf = {
  width: 500,
  height: 500,
  container: "circos",
  defaultTrackWidth: 40,
};

class Core {
  constructor(conf) {
    this.tracks = {};
    this._layout = null;
    this.conf = defaultsDeep(conf, defaultConf);
    d3.select("#" + conf.container).html(null);
    const container = d3
      .select("#" + this.conf.container)
      .append("div")
      .style("position", "relative");
    this.svg = container.append("svg").attr("id", "circosPlot");
    if (d3.select("body").select(".circos-tooltip").empty()) {
      this.tip = d3
        .select("body")
        .append("div")
        .attr("class", "circos-tooltip")
        .style("opacity", 0);
    } else {
      this.tip = d3.select("body").select(".circos-tooltip");
    }
  }

  layout(data, conf) {
    this._layout = new Layout(conf, data);
    return this;
  }

  removeTracks(trackIds) {
    if (typeof trackIds === "undefined") {
      map(this.tracks, (track, id) => {
        this.svg.select("." + id).remove();
      });
      this.tracks = {};
    } else if (typeof trackIds === "string") {
      this.svg.select("." + trackIds).remove();
      delete this.tracks[trackIds];
    } else if (isArray(trackIds)) {
      forEach(trackIds, function (trackId) {
        this.svg.select("." + trackId).remove();
        delete this.tracks[trackId];
      });
    } else {
      console.warn("removeTracks received an unhandled attribute type");
    }

    return this;
  }

  chords(id, data, conf) {
    this.tracks[id] = new Chords(this, conf, data);
    return this;
  }

  scatter(id, data, conf) {
    this.tracks[id] = new Scatter(this, conf, data);
    return this;
  }

  highlight(id, data, conf) {
    this.tracks[id] = new Highlight(this, conf, data);
    return this;
  }

  render(ids, removeTracks) {
    render(ids, removeTracks, this);
  }
}

const Circos = (conf) => {
  const instance = new Core(conf);
  return instance;
};

export default Circos;
