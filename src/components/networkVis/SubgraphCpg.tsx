import { TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";

const cpgList = [
  "cg16423305",
  "cg00128506",
  "cg25014118",
  "cg13212186",
  "cg00020172",
  "cg26858414",
  "cg19034770",
  "cg17096289",
  "cg12182649",
  "cg16553272",
  "cg14704780",
  "cg20636526",
  "cg19675496",
  "cg18111489",
  "cg05545351",
  "cg20802826",
  "cg13808979",
  "cg16958594",
  "cg22110654",
  "cg27258561",
];

const defaultCpg = "cg27258561";

function SubgraphCpg(props) {
  const [targetCpg, setTargetCpg] = useState(defaultCpg);

  // get subgraph click
  const onGetSubgraph = async () => {
    const subGraphResponse = await getSubgraph();
    console.log(subGraphResponse);
  };
  // get request to get nodes and edges of network given cpg
  const getSubgraph = async () => {
    props.popupOpen();
    const apiUrl = "http://127.0.0.1:8000" + "/network/subgraph";
    const params = { params: { cpg: targetCpg } };
    const response = await axios.get(apiUrl, params);
    props.popupClose();
    return response;
  };

  const targetCpgHandle = (event) => {
    setTargetCpg(event.target.value);
  };

  const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
      const graph = new Graph();
      graph.addNode("first", {
        x: 0,
        y: 0,
        size: 15,
        color: "#FA4F40",
      });
      graph.addNode("second", {
        x: 5,
        y: 5,
        size: 15,
        color: "black",
      });
      loadGraph(graph);
    }, [loadGraph]);

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
        <h2>Network Graph</h2>
        <SigmaContainer style={{ height: "500px", width: "500px" }}>
          <LoadGraph />
        </SigmaContainer>
      </Card>
      <Card>
        <CardContent>Check CpG connectivity</CardContent>
      </Card>
    </div>
  );
}

export default SubgraphCpg;
