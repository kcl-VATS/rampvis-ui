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
          id: `chr${d["CpG chr"]}`,
          start: parseInt(d["CpG pos"]) - 3000000,
          end: parseInt(d["CpG pos"]) + 3000000,
        },
        target: {
          id: `chr${d["SNP chr_x"]}`,
          start: parseInt(d["SNP pos"]) - 3000000,
          end: parseInt(d["SNP pos"]) + 3000000,
        },
        cpgData: {
          id: d["CpG"],
        },
        betaValue: {
          value: d["Beta"],
        },
      };
    });

    const scatterData = props.data.rows.map(function (d) {
      return {
        cpgData: d["CpG"],
        block_id: `chr${d["CpG chr"]}`,
        position: d["CpG pos"],
        value: d["Beta"],
      };
    });

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
      .scatter("s1", scatterData, {
        innerRadius: 0.8,
        outerRadius: 0.95,
        strokeColor: "grey",
        strokeWidth: 1,
        shape: "circle",
        size: 14,
        min: -1,
        max: 1,
        color: function (d) {
          if (d.value > 0) {
            return "#4caf50";
          }
          if (d.value < 0) {
            return "#f44336";
          }
          return "#d3d3d3";
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
