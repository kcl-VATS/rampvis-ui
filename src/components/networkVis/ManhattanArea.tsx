import { useEffect } from "react";
import { Button, Card, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import toImg from "react-svg-to-image";
import { manhattanPlot } from "./plots/manhattan/manhattan";

// function to save svg as png
const savePlot = async () => {
  const plot = await toImg("#manhattan", "manhattan", {
    scale: 1,
    quality: 1,
    download: true,
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
        block_id: `chr${d["snp_chr"]}`,
        position: d["snp_pos"],
        value: d["pval"] == 0 ? 0 : -Math.log10(d["pval"]).toFixed(2),
        label: "snp " + d["snp"],
        size: d["n"],
        beta: d["beta"].toFixed(2),
      };
    });

    console.log(props.data);

    const snpLims = pvalLimits(snpScatterData);
    manhattanPlot(snpScatterData, props.data.lims);
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
