import { useEffect } from "react";
import { Button, Card, Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import toImg from "react-svg-to-image";

// default plot configs
const defaultConf = {
  width: 700,
  height: 700,
  container: "circos",
};

// function to save svg as png
const savePlot = async () => {
  const plot = await toImg("#circosPlot", "circos", {
    scale: 1,
    quality: 1,
    download: true,
  });
};

const uniqueGenes = (gene) => [...new Set(gene.split(";"))].join(",");

const pvalLimits = (data) => {
  const pValList = data.map((datum) => datum.value);
  const minPval = Math.min(...pValList);
  const maxPval = Math.max(...pValList);

  return [minPval, maxPval];
};

function CircosArea(props) {
  useEffect(() => {
    const chordData = props.data.rows.map(function (d) {
      return {
        source: {
          id: `chr${d["cpg_chr"]}`,
          start: parseInt(d["cpg_pos"]) - 2000000,
          end: parseInt(d["cpg_pos"]) + 2000000,
        },
        target: {
          id: `chr${d["snp_chr"]}`,
          start: parseInt(d["snp_pos"]) - 2000000,
          end: parseInt(d["snp_pos"]) + 2000000,
        },
        cpgData: {
          id: d["cpg"],
        },
        snpData: {
          id: "snp" + d["snp"].replace(":", "_"),
          label: "snp" + d["snp"],
        },
        stats: {
          beta: d["beta"].toFixed(2),
          pval: d["pval"] == 0 ? 0 : -Math.log10(d["pval"]).toFixed(2),
          size: d["n"],
        },
      };
    });

    let cpgScatterData = props.data.rows.map(function (d) {
      return {
        id: d["cpg"],
        block_id: `chr${d["cpg_chr"]}`,
        position: d["cpg_pos"],
        value: 0,
        label: d["cpg"],
        gene: d["UCSC_RefGene_Name"],
      };
    });
    // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
    cpgScatterData = cpgScatterData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.id === value.id),
    );

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

    snpScatterData = snpScatterData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.id === value.id),
    );

    let cpgUnique = [
      ...new Set(props.data.rows.map((d) => "chr" + d["cpg_chr"])),
    ];
    let snpUnique = [
      ...new Set(props.data.rows.map((d) => "chr" + d["snp_chr"])),
    ];

    const chromUnique = [...new Set(cpgUnique.concat(snpUnique))];
    const cpgLims = pvalLimits(cpgScatterData);
    const snpLims = pvalLimits(snpScatterData);
  }, [props.data]);

  if (props.data.rows.length > 0) {
    console.log("rows", props.data.rows.length);

    return (
      <Card sx={{ height: "100%", width: 800 }}>
        <div align="center" id="circos"></div>
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

export default CircosArea;
