import { CheckBox, TransgenderTwoTone } from "@mui/icons-material";
import {
  Typography,
  Box,
  Slider,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Graph from "graphology";

const getCols = (row: {}) =>
  Object.keys(row).map((key) => {
    return { field: key, headerName: key, width: 100 };
  });

const cisTransOpts = ["cis-only", "trans-only", "cis/trans", "all"];

function NetworkLoadBlock(props) {
  const [fileToNetwork, setFileToNetwork] = useState("");
  const [filterPopup, setFilterPopup] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(5000000);
  const [minAssociation, setMinAssociation] = useState(3);
  const [minUniqueChr, setMinUniqueChr] = useState(1);

  const handleMinAssociation = (event) => setMinAssociation(event.target.value);
  const handleDistance = (event) => setDistanceFilter(event.target.value);
  const handleMinUniqueChr = (event) => setMinUniqueChr(event.target.value);
  const handleFilterButton = () => setFilterPopup((value) => !value);

  const graph = new Graph();

  // checks if the network is loaded
  // handler to file selection to load to network
  const onNetworkChange = (event) => {
    setFileToNetwork(event.target.value);
  };

  // load network click
  const onLoadNetwork = async () => {
    await loadNetwork();
  };

  // get request to change .txt to network model
  const loadNetwork = async () => {
    // post endpoint to upload data
    props.popupOpen();
    const dataParams = {
      params: {
        file: fileToNetwork,
        minDistance: distanceFilter,
        minAssoc: minAssociation,
        minChrom: minUniqueChr,
      },
    };
    const dataUrl = "http://127.0.0.1:4010" + "/network/process";
    const dataResponse = await axios.get(dataUrl, dataParams);

    const cpgParams = {
      params: { file: fileToNetwork, targetCpg: "cg06097659" },
    };

    const cpgUrl = "http://127.0.0.1:4010" + "/network/subgraph";
    const cpgResponse = await axios.get(cpgUrl, cpgParams);

    console.log("Cpg Response", cpgResponse);
    props.setNetwork(true);

    props.popupClose();
    props.setCpgData({
      cols: getCols(dataResponse.data[0]),
      rows: dataResponse.data,
    });

    /*
    let cpgSet = new Set()
    let snpSet = new Set()
    let edges = []

    data_response.data.map((data)=>{
      cpgSet.add(data['CpG'])
      snpSet.add(data['Top SNP'])
      edges.push({'source':data['CpG'],'target':data['Top SNP']})
    })
    */

    //props.setGraphObj(network_response.data)
  };

  // empty network click
  const onEmptyNetwork = async () => {
    const emptyNetworkResponse = await emptyNetwork();
    console.log(emptyNetworkResponse);
  };

  // get request to empty network model
  const emptyNetwork = async () => {
    // post endpoint to upload data
    props.popupOpen();
    const apiUrl = "http://127.0.0.1:4010" + "/network/empty_network";
    const response = await axios.get(apiUrl);
    props.setNetwork(false);
    props.popupClose();
    return response;
  };

  const createMarks = (min, max, scale = 1) => {
    const step = (max - min) / 10;
    let marks_arr = [];

    for (let i = min; i <= max; i += step) {
      marks_arr.push({
        value: i,
        label: (i / scale).toString(),
      });
    }

    return marks_arr;
  };

  return (
    <div>
      <Card sx={{ width: 400 }}>
        <CardContent>
          meQTL Filtering
          <h2>
            <TextField
              select
              label="Available meQTL files"
              variant="outlined"
              name="indicator"
              value={fileToNetwork}
              onChange={onNetworkChange}
              sx={{ width: 300 }}
            >
              {props.fileList["fileList"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Button
              disabled={!fileToNetwork}
              onClick={onLoadNetwork}
              variant="outlined"
            >
              Get Filtered Data
            </Button>
          </h2>
          <h2>
            <Button onClick={handleFilterButton} variant="outlined">
              Filter options
            </Button>
          </h2>
        </CardContent>
      </Card>

      <Dialog
        open={filterPopup}
        onClose={handleFilterButton}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Filter Options</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 500 }}>
            <Typography noWrap>Minimum association number per CpG</Typography>
            <Slider
              sx={{ width: 500 }}
              value={minAssociation}
              onChange={handleMinAssociation}
              step={1}
              min={0}
              marks={createMarks(0, 20)}
              max={20}
            />
            <Typography variant="caption" gutterBottom>
              {minAssociation}
            </Typography>
          </Box>

          <Box sx={{ width: 500 }}>
            <Typography noWrap>
              Minimum distance between CpG-SNP pair
            </Typography>
            <Slider
              sx={{ width: 500 }}
              value={distanceFilter}
              onChange={handleDistance}
              step={125000 * 40}
              min={0}
              marks={createMarks(0, 10000000 * 40, 1e6)}
              max={10000000 * 40}
            />
            <Typography variant="caption" gutterBottom>
              {distanceFilter / 1e6} MB
            </Typography>
          </Box>

          <Box sx={{ width: 500 }}>
            <Typography noWrap>
              Minimum number of chromosomes per Cpg
            </Typography>
            <Slider
              sx={{ width: 500 }}
              value={minUniqueChr}
              onChange={handleMinUniqueChr}
              step={1}
              min={0}
              marks={createMarks(0, 10)}
              max={10}
            />
            <Typography variant="caption" gutterBottom>
              {minUniqueChr}
            </Typography>
          </Box>

          <Box sx={{ width: 500 }}>
            <Typography gutterBottom>Cis/Trans Options</Typography>
            <TextField
              select
              variant="outlined"
              name="indicator"
              sx={{ width: 500 }}
            >
              {cisTransOpts.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NetworkLoadBlock;
