import { Grid, Card } from "@mui/material";
import { useEffect } from "react";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";
import circular from "graphology-layout/circular";
import { ForceAtlasControl } from "react-sigma-v2";
import { ControlsContainer, ZoomControl } from "react-sigma-v2";
import { CollectionsBookmarkRounded } from "@mui/icons-material";

const cpgColorLevel = {
  0: "#c51b8a",
  1: "#fa9fb5",
  2: "#fde0dd",
};

const snpColorLevel = {
  1: "#3182bd",
  2: "#9ecae1",
  3: "#deebf7",
};

function SubgraphCpg(props) {
  const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
      if (props.graphObj.rows.length) {
        const nodeAttributes = props.graphObj.attr;
        const { snp: snpAttr, cpg: cpgAttr } = nodeAttributes;
        let snpLevelObj = {};
        let cpgLevelObj = {};
        snpAttr.map((snp) => (snpLevelObj[snp.id] = snp.level));
        cpgAttr.map((cpg) => (cpgLevelObj[cpg.id] = cpg.level));
        const networkData = props.graphObj.rows;
        const cpg_nodes = [...new Set(networkData.map((row) => row.cpg))].map(
          (row: string) => ({
            key: row,
            attributes: {
              color: cpgColorLevel[cpgLevelObj[row]],
              size: 5,
              label: row,
            },
          }),
        );
        const snp_nodes = [...new Set(networkData.map((row) => row.snp))].map(
          (row: string) => ({
            key: row,
            attributes: {
              color: snpColorLevel[snpLevelObj[row]],
              size: 5,
              label: row,
            },
          }),
        );
        const nodes = cpg_nodes.concat(snp_nodes);
        const edges = networkData.map((row) => ({
          key: row.cpg + row.snp,
          source: row.cpg,
          target: row.snp,
        }));
        const graphObj = {
          attributes: { name: "networkCpg" },
          nodes: nodes,
          edges: edges,
        };

        const graph = new Graph();

        graph.import(graphObj);

        graph.forEachNode((node, attributes) => {
          console.log(graph.neighbors(node));
        });

        circular.assign(graph);
        loadGraph(graph);
      }
    }, [props.graphObj]);

    return null;
  };

  return (
    <div>
      <SigmaContainer
        id="subgraph"
        initialSettings={{
          renderLabels: true,
          hideLabelsOnMove: false,
        }}
        style={{ height: "400px", width: "800px" }}
      >
        <LoadGraph />
        <ControlsContainer>
          <ForceAtlasControl />
          <ZoomControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
}

export default SubgraphCpg;
