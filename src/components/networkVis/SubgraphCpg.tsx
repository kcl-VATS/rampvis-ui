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
      const graph = new Graph();
      graph.import(props.graphObj);
      console.log(props.graphObj);
      circular.assign(graph);
      loadGraph(graph);
    }, [props.graphObj]);

    return null;
  };

  return (
    <div>
      <Grid
        container
        sx={{
          marginLeft: 1,
          marginBottom: 5,
        }}
      >
        <Grid item xs={10}>
          <Card>
            <SigmaContainer
              id="subgraph"
              initialSettings={{
                renderLabels: true,
                hideLabelsOnMove: false,
              }}
              style={{ height: "700px", width: "1000px" }}
            >
              <LoadGraph />
              <ControlsContainer>
                <ForceAtlasControl autoRunFor={100000} />
                <ZoomControl />
              </ControlsContainer>
            </SigmaContainer>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default SubgraphCpg;
