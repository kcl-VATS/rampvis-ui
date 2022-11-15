import { TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { SigmaContainer, useLoadGraph, ZoomControl } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";
import random from "graphology-layout/random";
import { ControlsContainer } from "react-sigma-v2";
import { DataGrid } from "@mui/x-data-grid";

const defaultCpg = "cg27012446";

function EwasData(props) {
  const ewasUrl = "http://127.0.0.1:4010" + "/network/ewas";
  const [ewasQuery, setEwasQuery] = useState(defaultCpg);
  const [ewasResult, setEwasResult] = useState([]);

  const fetchEwas = async () => {
    const cpgData = await axios.get(ewasUrl, { params: { cpg: ewasQuery } });
    setEwasResult(cpgData.data);
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Button onClick={fetchEwas}> Hi</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default EwasData;
