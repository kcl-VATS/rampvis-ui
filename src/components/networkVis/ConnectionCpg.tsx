import { TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { SigmaContainer, useLoadGraph, ZoomControl } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";
import random from "graphology-layout/random";
import { ControlsContainer } from "react-sigma-v2";
const defaultCpg = "cg27012446";

function ConnectionCpg(props) {
  const [graphObj, setGraphObj] = useState({});

  const [startCpg, setStartCpg] = useState("cg27012446");
  const [endCpg, setEndCpg] = useState("cg21195638");

  // get subgraph click
  const onGetSubgraph = async () => {
    const subGraphResponse = await getSubgraph();
    setGraphObj(subGraphResponse.data);
  };
  // get request to get nodes and edges of network given cpg
  const getSubgraph = async () => {
    props.popupOpen();
    const apiUrl = "http://127.0.0.1:8000" + "/network/path";
    const params = { params: { source: startCpg, target: endCpg } };
    const response = await axios.get(apiUrl, params);
    props.popupClose();
    return response;
  };

  const startCpgHandle = (event) => {
    setStartCpg(event.target.value);
  };

  const endCpgHandle = (event) => {
    setEndCpg(event.target.value);
  };

  const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
      const graph = new Graph();
      graph.import(graphObj);
      random.assign(graph);
      loadGraph(graph);
    }, [graphObj]);

    return null;
  };

  return (
    <div>
      <Card>
        <CardContent>
          Path Finder
          <h2>
            <TextField
              id="outlined-basic"
              label="Source CpG"
              onChange={startCpgHandle}
              value={startCpg}
              variant="outlined"
            />
          </h2>
          <h2>
            <TextField
              id="outlined-basic"
              type="text"
              label="Target Cpg"
              onChange={endCpgHandle}
              value={endCpg}
              variant="outlined"
            />
          </h2>
          <h2>
            <Button
              disabled={!props.networkStatus}
              onClick={onGetSubgraph}
              variant="outlined"
            >
              Get path
            </Button>
          </h2>
        </CardContent>
      </Card>

      <Card>
        <SigmaContainer
          id="connection"
          initialSettings={{ renderLabels: true, hideLabelsOnMove: true }}
          style={{ height: "700px", width: "1000px" }}
        >
          <LoadGraph />
          <ControlsContainer>
            <ZoomControl></ZoomControl>
          </ControlsContainer>
        </SigmaContainer>
      </Card>
    </div>
  );
}

export default ConnectionCpg;
