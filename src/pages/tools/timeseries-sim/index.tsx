import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
} from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import Graph from "graphology";
import CircularProgress from "@mui/material/CircularProgress";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import "react-sigma-v2/lib/react-sigma-v2.css";

const defaultFileState = {
  selectedFile: null,
};

const defaultServerListState = {
  fileList: [],
};

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

const TimeseriesSim = () => {
  // state functions to manage file uploading to the back-end and checking
  // available files at the back-end
  const [requestLoadPopup, setRequestLoadPopup] = useState(false);
  // state of user uploaded file
  const [fileToUpload, setFileToUpload] = useState(defaultFileState);
  // state for list of files in the server
  const [filesOnServer, setFilesOnServer] = useState(defaultServerListState);
  // file to be transformed to network format
  const [fileToNetwork, setFileToNetwork] = useState("");
  // checks if the network is loaded
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false);
  // state for target CpG to get subgraph for
  const [targetCpg, setTargetCpg] = useState(defaultCpg);
  // open loading circle
  const popUpOpen = () => {
    setRequestLoadPopup(true);
  };
  // close loading circle
  const popUpClose = () => {
    setRequestLoadPopup(false);
  };

  // on page-load, get available files on the server
  useEffect(() => {
    const initialLoad = async () => {
      // get request to get file list
      const response = await getFileList();
      // update file list
      setFilesOnServer(response.data);
    };
    initialLoad();
  }, []);

  // file upload post request
  // uploads the file and returns updated file list
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append(
      "file",
      fileToUpload.selectedFile,
      fileToUpload.selectedFile.name,
    );
    // post endpoint to upload data
    const apiUrl = "http://127.0.0.1:8000" + "/data/upload";
    const response = await axios.post(apiUrl, formData);
    return response;
  };

  // get request to get list of files
  const getFileList = async () => {
    // get endpoint to get list of files
    const apiUrl = "http://127.0.0.1:8000" + "/data/check";
    const response = await axios.get(apiUrl);
    return response;
  };

  // handler for file input field
  const onFileChange = (event) => {
    setFileToUpload({ selectedFile: event.target.files[0] });
  };

  // onClick file upload function which uploads the file and returns updated file list
  const onFileUpload = async () => {
    popUpOpen();
    const fileUploadResponse = await uploadFile();
    console.log("fileUploadResponse = ", fileUploadResponse.data);

    const fileListFromServerResponse = await getFileList();
    setFilesOnServer(fileListFromServerResponse.data);
    console.log(
      "fileListFromServerResponse = ",
      fileListFromServerResponse.data,
    );
    popUpClose();
  };

  // handler to file selection to load to network
  const onNetworkChange = (event) => {
    setFileToNetwork(event.target.value);
  };

  // load network click
  const onLoadNetwork = async () => {
    const loadNetworkResponse = await loadNetwork();
    console.log(loadNetworkResponse);
  };

  // get request to change .txt to network model
  const loadNetwork = async () => {
    // post endpoint to upload data
    popUpOpen();
    const params = { params: { file: fileToNetwork } };
    const apiUrl = "http://127.0.0.1:8000" + "/network/load";
    const response = await axios.get(apiUrl, params);
    setIsNetworkLoaded(true);
    popUpClose();
  };

  // empty network click
  const onEmptyNetwork = async () => {
    const emptyNetworkResponse = await emptyNetwork();
    console.log(emptyNetworkResponse);
  };

  // get request to empty network model
  const emptyNetwork = async () => {
    // post endpoint to upload data
    popUpOpen();
    const apiUrl = "http://127.0.0.1:8000" + "/network/empty_network";
    const response = await axios.get(apiUrl);
    setIsNetworkLoaded(false);
    popUpClose();
    return response;
  };

  // get subgraph click
  const onGetSubgraph = async () => {
    const subGraphResponse = await getSubgraph();
    console.log(subGraphResponse);
  };
  // get request to get nodes and edges of network given cpg
  const getSubgraph = async () => {
    popUpOpen();
    const apiUrl = "http://127.0.0.1:8000" + "/network/subgraph";
    const params = { params: { cpg: targetCpg } };
    const response = await axios.get(apiUrl, params);
    popUpClose();
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

  // dummy button to check states
  const CheckList = () => {
    console.log(fileToNetwork);
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
              Upload,access data
              <h2>
                <TextField type="file" onChange={onFileChange} />
              </h2>
              <h2>
                <Button
                  disabled={!fileToUpload.selectedFile}
                  onClick={onFileUpload}
                  variant="outlined"
                >
                  Upload data
                </Button>
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              Load Network
              <h2>
                <TextField
                  select
                  label="Files on server"
                  variant="outlined"
                  name="indicator"
                  onChange={onNetworkChange}
                >
                  {filesOnServer["fileList"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </h2>
              <h2>
                <Button
                  disabled={!fileToNetwork}
                  onClick={onLoadNetwork}
                  variant="outlined"
                >
                  Load Network
                </Button>
              </h2>
              <h2>
                <Button
                  disabled={!isNetworkLoaded}
                  onClick={onEmptyNetwork}
                  variant="outlined"
                >
                  Empty Network
                </Button>
              </h2>
            </CardContent>
          </Card>

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
                  disabled={!isNetworkLoaded}
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
        </Grid>
      </Box>

      <Dialog open={requestLoadPopup}>
        <DialogContent>
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
