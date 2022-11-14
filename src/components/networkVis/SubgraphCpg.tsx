import { Grid, Card } from "@mui/material";
import { useEffect } from "react";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";
import circular from "graphology-layout/circular";
import { ForceAtlasControl } from "react-sigma-v2";
import { ControlsContainer, ZoomControl } from "react-sigma-v2";

function SubgraphCpg(props) {
  const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
      if (props.graphObj.rows.length) {
        const networkData = props.graphObj.rows;
        const cpg_nodes = [...new Set(networkData.map((row) => row.cpg))].map(
          (row) => ({
            key: row,
            attributes: { color: "#7fc97f", size: 15, label: row },
          }),
        );
        const snp_nodes = [...new Set(networkData.map((row) => row.snp))].map(
          (row) => ({
            key: row,
            attributes: { color: "#beaed4", size: 15, label: row },
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
        console.log(graphObj);

        const graph = new Graph();
        graph.import(graphObj);
        console.log(graphObj);
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
          <ForceAtlasControl autoRunFor={100000} />
          <ZoomControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
}

export default SubgraphCpg;
