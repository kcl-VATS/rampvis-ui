import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Card, CardContent, Button, TextField } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import "react-sigma-v2/lib/react-sigma-v2.css";

const defaultFileState = {
  selectedFile: null,
};

const TimeseriesSim = () => {
  const [fileToUpload, setFileToUpload] = useState(defaultFileState);
  const [filesOnServer, setFilesOnServer] = useState([]);

  useEffect(() => {
    const initialLoad = async () => {
      const response = await getFileList();
      console.log("doing stuff");
      setFilesOnServer(response.data);
    };
    initialLoad();
  }, []);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append(
      "file",
      fileToUpload.selectedFile,
      fileToUpload.selectedFile.name,
    );
    const apiUrl = "http://127.0.0.1:8000" + "/data/upload";
    const response = await axios.post(apiUrl, formData);
    return response;
  };

  const getFileList = async () => {
    const apiUrl = "http://127.0.0.1:8000" + "/data/check";
    const response = await axios.get(apiUrl);
    return response;
  };

  const onFileChange = (event) => {
    setFileToUpload({ selectedFile: event.target.files[0] });
  };

  const onFileUpload = async () => {
    const fileUploadResponse = await uploadFile();
    console.log("fileUploadResponse = ", fileUploadResponse.data);

    const fileListFromServerResponse = await getFileList();
    setFilesOnServer(fileListFromServerResponse.data);
    console.log(
      "fileListFromServerResponse = ",
      fileListFromServerResponse.data,
    );
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

  const CheckList = () => {
    console.log(filesOnServer);
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
              <h2> Upload,access data </h2>

              <TextField type="file" onChange={onFileChange} />
              <h2>
                <Button
                  disabled={!fileToUpload.selectedFile}
                  onClick={onFileUpload}
                  variant="outlined"
                >
                  Submit data
                </Button>
              </h2>
              <h2>
                <Button onClick={CheckList} variant="outlined">
                  Check List
                </Button>
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent>Load Network</CardContent>
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
