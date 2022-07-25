import { TextField, Button, Card, CardContent, MenuItem } from "@mui/material";
import axios from "axios";
import { useState } from "react";

function NetworkLoadBlock(props) {
  const [fileToNetwork, setFileToNetwork] = useState("");
  // checks if the network is loaded

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
    props.popupOpen();
    const params = { params: { file: fileToNetwork } };
    const apiUrl = "http://127.0.0.1:8000" + "/network/load";
    const response = await axios.get(apiUrl, params);
    props.setNetwork(true);
    props.popupClose();
    return response;
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
    const apiUrl = "http://127.0.0.1:8000" + "/network/empty_network";
    const response = await axios.get(apiUrl);
    props.setNetwork(false);
    props.popupClose();
    return response;
  };

  return (
    <div>
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
              {props.fileList["fileList"].map((option) => (
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
              disabled={!props.networkStatus}
              onClick={onEmptyNetwork}
              variant="outlined"
            >
              Empty Network
            </Button>
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default NetworkLoadBlock;
