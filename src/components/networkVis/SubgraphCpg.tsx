import { TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";
import circular from "graphology-layout/circular";
import { ForceAtlasControl } from "react-sigma-v2";
import { ControlsContainer } from "react-sigma-v2";
const defaultCpg = "cg27012446";

function SubgraphCpg(props) {
  const [targetCpg, setTargetCpg] = useState(defaultCpg);
  const [graphObj, setGraphObj] = useState({});
  const [numJumps, setNumJumps] = useState(2);
  // get subgraph click
  const onGetSubgraph = async () => {
    const subGraphResponse = await getSubgraph();
    setGraphObj(subGraphResponse.data);
    console.log(subGraphResponse);
  };
  // get request to get nodes and edges of network given cpg
  const getSubgraph = async () => {
    props.popupOpen();
    const apiUrl = "http://127.0.0.1:8000" + "/network/subgraph";
    const params = { params: { cpg: targetCpg, numJumps: numJumps } };
    const response = await axios.get(apiUrl, params);
    props.popupClose();
    return response;
  };

  const targetCpgHandle = (event) => {
    setTargetCpg(event.target.value);
  };

  const numJumpsHandle = (event) => {
    setNumJumps(event.target.value);
  };

  const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
      const graph = new Graph();
      graph.import(graphObj);
      circular.assign(graph);
      //forceAtlas2.assign(graph, { iterations: 25 });
      loadGraph(graph);
    }, [graphObj]);

    return null;
  };

  return (
    <div>
      <Card>
        <CardContent>
          Search network by CpG
          <h2>
            <TextField
              id="outlined-basic"
              label="Target CpG"
              onChange={targetCpgHandle}
              value={targetCpg}
              variant="outlined"
            />
          </h2>
          <h2>
            <TextField
              id="outlined-basic"
              type="number"
              label="Maximum distance"
              onChange={numJumpsHandle}
              value={numJumps}
              variant="outlined"
              inputProps={{
                step: "2",
                max: "8",
              }}
            />
          </h2>
          <h2>
            <Button
              disabled={!props.networkStatus}
              onClick={onGetSubgraph}
              variant="outlined"
            >
              Get network
            </Button>
          </h2>
        </CardContent>
      </Card>

      <Card>
        <SigmaContainer
          initialSettings={{
            renderLabels: true,
            hideLabelsOnMove: true,
            labelGridCellSize: 100,
          }}
          style={{ height: "700px", width: "1000px" }}
        >
          <LoadGraph />
          <ControlsContainer>
            <ForceAtlasControl autoRunFor={100000} />
          </ControlsContainer>
        </SigmaContainer>
      </Card>
      <Card>
        <CardContent>Check CpG connectivity</CardContent>
      </Card>
    </div>
  );
}

export default SubgraphCpg;
