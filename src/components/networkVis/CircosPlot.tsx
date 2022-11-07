import { useEffect } from "react";
import { Button, Card } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Circos from "./plots/circos/circosPlot";
import GRCh37 from "./data/layout/GRCh37.json";
import cytobands from "./data/layout/cytobands.json";
import gieStainColor from "./data/layout/gieStainColor.json";
import toImg from "react-svg-to-image";

// default plot configs
const defaultConf = {
  width: 700,
  height: 700,
  container: "circos",
};

// default plot data for layout
const cytobandData = cytobands.map(function (d) {
  return {
    block_id: d.chrom,
    start: d.chromStart,
    end: d.chromEnd,
    gieStain: d.gieStain,
    name: d.name,
  };
});

// function to save svg as png
const savePlot = async () => {
  const plot = await toImg("#circosPlot", "circos", {
    scale: 1,
    quality: 1,
    download: true,
  });
};

function CircosArea(props) {
  useEffect(() => {
    const chordData = props.data.rows.map(function (d) {
      return {
        source: {
          id: `chr${d["cpg_chr"]}`,
          start: parseInt(d["cpg_pos"]) - 3000000,
          end: parseInt(d["cpg_pos"]) + 3000000,
        },
        target: {
          id: `chr${d["snp_chr"]}`,
          start: parseInt(d["snp_pos"]) - 3000000,
          end: parseInt(d["snp_pos"]) + 3000000,
        },
        cpgData: {
          id: d["cpg"],
        },
        betaValue: {
          value: d["beta"],
        },
      };
    });

    let cpgScatterData = props.data.rows.map(function (d) {
      return {
        cpgData: d["cpg"],
        block_id: `chr${d["cpg_chr"]}`,
        position: d["cpg_pos"],
        value: d["pval"],
      };
    });

    // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
    cpgScatterData = cpgScatterData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.cpgData === value.cpgData),
    );

    let snpScatterData = props.data.rows.map(function (d) {
      return {
        snpData: d["snp"],
        block_id: `chr${d["snp_chr"]}`,
        position: d["snp_pos"],
        value: d["pval"],
      };
    });

    cpgScatterData = cpgScatterData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.cpgData === value.cpgData),
    );

    snpScatterData = snpScatterData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.snpData === value.snpData),
    );

    const circosExample = Circos(defaultConf);

    circosExample
      .layout(GRCh37, {
        inneradius: defaultConf.width / 2 - 70,
        outerRadius: defaultConf.width / 2 - 40,
        labels: {
          radialOffset: 90,
        },
        ticks: {
          display: true,
          labelDenominator: 1000000,
        },
      })
      .highlight("cytobands", cytobandData, {
        innerRadius: defaultConf.width / 2 - 100,
        outerRadius: defaultConf.width / 2 - 40,
        opacity: 0.4,
        color: function (d) {
          return gieStainColor[d.gieStain];
        },
      })
      .chords("c1", chordData, { opacity: 0.5, logScale: false, radius: 0.75 })
      .scatter("s1", cpgScatterData, {
        innerRadius: 0.95,
        outerRadius: 0.95,
        strokeWidth: 1,
        shape: "circle",
        size: 20,
        min: 0,
        max: 0.1,
        color: function (d) {
          return "#ff6400";
        },
      })
      .scatter("s2", snpScatterData, {
        innerRadius: 0.85,
        outerRadius: 0.85,
        strokeWidth: 1,
        shape: "circle",
        size: 20,
        min: 0,
        max: 0.1,
        color: function (d) {
          return "#009cff";
        },
      })
      .render();
  }, [props.data]);

  return (
    <Card sx={{ height: "100%", width: 800 }}>
      <div id="circos"></div>
      <Button
        variant="contained"
        style={{ alignSelf: "right" }}
        onClick={savePlot}
        endIcon={<DownloadIcon />}
      >
        Save Image
      </Button>
    </Card>
  );
}

export default CircosArea;
