import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import "react-sigma-v2/lib/react-sigma-v2.css";

const defaultFileState = {
  selectedFile: null,
};

const API = process.env.NEXT_PUBLIC_API_PY;

const API_PY = API + "/timeseries-sim-search";

const TimeseriesSim = () => {
  const [fileToUpload, setFileToUpload] = useState(defaultFileState);

  const onFileChange = (event) => {
    console.log(event);
    setFileToUpload({ selectedFile: event.target.files[0] });
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    console.log(fileToUpload);
    formData.append(
      "file",
      fileToUpload.selectedFile,
      fileToUpload.selectedFile.name,
    );

    const apiUrl = "http://127.0.0.1:8000" + "/data/upload";

    const response = await axios.post(apiUrl, formData);
    console.log("response = ", response);
    if (response.data) {
      console.log("response.data = ", response.data);
    }
  };

  const checkData = () => {
    console.log(fileToUpload);
  };

  const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    useEffect(() => {
      const graph = new Graph();
      graph.addNode("first", {
        x: 0,
        y: 0,
        size: 15,
        label: "My first node",
        color: "#FA4F40",
      });
      loadGraph(graph);
    }, [loadGraph]);

    return null;
  };

  const sankeyPost = async () => {
    const apiUrl =
      "http://0.0.0.0:4010" + "/stat/v1/timeseries-sim-search/sankey_generate/";

    const predictObj = {
      dummy: 10,
    };
    const response = await axios.post(apiUrl, predictObj);
    console.log("response = ", response);
    if (response.data) {
      console.log("response.data = ", response.data);
    }
  };

  return (
    <>
      <Helmet>
        <title>CpG Network System</title>
      </Helmet>
      <Box>
        <Grid>
          <Card>
            <CardContent>
              <h2> File handling </h2>

              <TextField type="file" onChange={onFileChange} />
              <h2>
                <Button onClick={onFileUpload} variant="outlined">
                  Submit data
                </Button>
              </h2>

              <h2>
                <Button onClick={checkData} variant="outlined">
                  Check file
                </Button>
              </h2>

              <Grid>
                <List dense={true}>
                  <ListItem>
                    <ListItemText primary="Single-line item" />
                  </ListItem>
                  ,
                </List>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>Search by CpG</CardContent>
          </Card>

          <Card>
            <h2>Network Graph</h2>
            <SigmaContainer style={{ height: "500px", width: "100%" }}>
              <LoadGraph />
            </SigmaContainer>
          </Card>
          <Card>
            <CardContent>Check CpG connectivity</CardContent>
          </Card>
        </Grid>
      </Box>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
