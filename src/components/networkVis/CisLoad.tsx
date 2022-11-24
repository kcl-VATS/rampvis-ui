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
  Grid,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

const chromosomes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "X",
  "Y",
];

const getCols = (row) =>
  Object.keys(row).map((key) => {
    return { field: key, headerName: key, width: 100 };
  });

function CisLoad(props) {
  const [filterPopup, setFilterPopup] = useState<boolean>(false);
  const [minAssociation, setMinAssociation] = useState<number>(1);
  const [minPval, setMinPval] = useState(6);
  const [targetChr, setTargetChr] = useState<number>(6);
  const [startPos, setStartPos] = useState<number>(49879169);
  const [endPos, setEndPos] = useState<number>(50479169);

  const handleMinAssociation = (event) => setMinAssociation(event.target.value);
  const handleMinPval = (event) => setMinPval(event.target.value);
  const handleTargetChr = (event) => setTargetChr(event.target.value);
  const handleStartPos = (event) => setStartPos(event.target.value);
  const handleEndPos = (event) => setEndPos(event.target.value);

  const handleFilterButton = () => setFilterPopup((value) => !value);

  // checks if the network is loaded
  // handler to file selection to load to network
  const onNetworkChange = (event) => {
    props.setFile(event.target.value);
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
        file: props.file,
        targetChr: targetChr,
        startPos: startPos,
        endPos: endPos,
        minAssoc: minAssociation,
        minPval: minPval,
      },
    };

    const dataUrl = "http://127.0.0.1:4010" + "/network/cis";

    const dataResponse = await axios.get(dataUrl, dataParams);

    const gridData = {
      cols: getCols(dataResponse.data[0]),
      rows: dataResponse.data,
      lims: [startPos, endPos],
    };

    props.setCpgData(gridData);
    props.popupClose();
  };

  const createMarks = (min, max, scale = 1) => {
    const step = (max - min) / 10;
    const marks_arr = [];

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
          <Typography>Cis meQTL Search</Typography>

          <h2>
            <TextField
              select
              label="Available meQTL files"
              variant="outlined"
              name="indicator"
              value={props.file}
              onChange={onNetworkChange}
              sx={{ width: 300 }}
            >
              {props.fileList["fileList"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </h2>

          <h2>
            <TextField
              select
              label="Target chromosome"
              variant="outlined"
              name="indicator"
              value={targetChr}
              onChange={handleTargetChr}
              sx={{ width: 300 }}
            >
              {chromosomes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </h2>

          <h2>
            <TextField
              type="number"
              label="Start position"
              variant="outlined"
              name="indicator"
              value={startPos}
              onChange={handleStartPos}
              sx={{ width: 300 }}
            ></TextField>
          </h2>

          <h2>
            <TextField
              type="number"
              label="End position"
              variant="outlined"
              name="indicator"
              value={endPos}
              onChange={handleEndPos}
              sx={{ width: 300 }}
            ></TextField>
          </h2>

          <h2>
            <Button onClick={handleFilterButton} variant="contained">
              Filter options
            </Button>
          </h2>
          <Box
            m={1}
            //margin
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button
              disabled={!props.file}
              onClick={onLoadNetwork}
              variant="outlined"
            >
              View manhattan plot
            </Button>
          </Box>
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
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography noWrap>Minimum p value 1e-</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  type="number"
                  value={minPval}
                  onChange={handleMinPval}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CisLoad;
