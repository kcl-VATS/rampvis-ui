import { useEffect } from "react";
import { Button, Card, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import toImg from "react-svg-to-image";
import { manhattanPlot } from "./plots/manhattan/manhattan";

// function to save svg as png
const savePlot = async () => {
  const plot = await toImg("#manhattanPlot", "manhattan", {
    scale: 1,
    quality: 1,
    download: true,
    background: "white",
  });
};

const pvalLimits = (data) => {
  const pValList = data.map((datum) => datum.value);
  const minPval = Math.min(...pValList);
  const maxPval = Math.max(...pValList);

  return [minPval, maxPval];
};

function ManhattanArea(props) {
  useEffect(() => {
    let snpScatterData = props.data.rows.map(function (d) {
      return {
        id: "snp" + d["snp"].replace(":", "_"),
        position: d["snp_pos"],
        value: d["pval"] == 0 ? 0 : -Math.log10(d["pval"]).toFixed(2),
        label: "snp " + d["snp"],
        size: d["n"],
        beta: d["beta"].toFixed(2),
      };
    });

    let cpgScatterData = props.data.rows.map(function (d) {
      return {
        id: "cpg" + d["cpg"],
        position: d["cpg_pos"],
        label: "cpg " + d["cpg"],
      };
    });

    cpgScatterData = cpgScatterData.filter(
      (datum) =>
        datum.position > props.data.lims[0] &&
        datum.position < props.data.lims[1],
    );

    let chordData = props.data.rows.map(function (d) {
      return {
        cpg_pos: d["cpg_pos"],
        snp_pos: d["snp_pos"],
        value: d["pval"] == 0 ? 0 : -Math.log10(d["pval"]).toFixed(2),
      };
    });

    chordData = chordData.filter(
      (datum) =>
        datum.cpg_pos > props.data.lims[0] &&
        datum.cpg_pos < props.data.lims[1],
    );

    manhattanPlot(snpScatterData, cpgScatterData, chordData, props.data.lims);
  }, [props.data]);

  if (props.data.rows.length > 0) {
    return (
      <Card sx={{ height: "100%", width: 800 }}>
        <div id="manhattan"></div>
        <Button
          variant="contained"
          style={{ alignSelf: "right" }}
          onClick={savePlot}
          endIcon={<DownloadIcon />}
        >
          Save
        </Button>
      </Card>
    );
  } else {
    return <div></div>;
  }
}

export default ManhattanArea;
