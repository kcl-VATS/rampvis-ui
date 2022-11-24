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
  OutlinedInput,
  ListItemText,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
const listToStr = (chr_lst) => {
  let text = "0";
  chr_lst.map((chr) => (text = text + "-" + chr));
  return text;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

function TransLoad(props) {
  const [filterPopup, setFilterPopup] = useState<boolean>(false);
  const [distanceFilter, setDistanceFilter] = useState<number>(1000000);
  const [minAssociation, setMinAssociation] = useState<number>(3);
  const [minPval, setMinPval] = useState(6);
  const [chromosomeList, setChromosomeList] = useState<string[]>(chromosomes);

  const handleChromosome = (
    event: SelectChangeEvent<typeof chromosomeList>,
  ) => {
    const {
      target: { value },
    } = event;
    setChromosomeList(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const handleMinAssociation = (event) => setMinAssociation(event.target.value);
  const handleDistance = (event) => setDistanceFilter(event.target.value);
  const handleMinPval = (event) => setMinPval(event.target.value);

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
        minDistance: distanceFilter,
        minAssoc: minAssociation,
        minPval: minPval,
        chromosomeList: listToStr(chromosomeList),
      },
    };

    const dataUrl = "http://127.0.0.1:4010" + "/network/trans";

    const dataResponse = await axios.get(dataUrl, dataParams);

    const gridData = {
      cols: getCols(dataResponse.data[0]),
      rows: dataResponse.data,
    };

    props.popupClose();
    props.setCpgData(gridData);
    props.setCircosData(gridData);
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
          <Typography>Trans MeQTL Search</Typography>
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
                View circos plot
              </Button>
            </Box>
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
              min={1000000}
              marks={createMarks(5000000, 10000000 * 40, 1e6)}
              max={10000000 * 40}
            />
            <Typography variant="caption" gutterBottom>
              {distanceFilter / 1e6} MB
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

          <Box sx={{ width: 500 }}>
            <Typography noWrap>Chromosomes to include:</Typography>
            <Select
              multiple
              value={chromosomeList}
              onChange={handleChromosome}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{ width: 300 }}
            >
              {chromosomes.map((chr) => (
                <MenuItem key={chr} value={chr}>
                  <Checkbox checked={chromosomeList.indexOf(chr) > -1} />
                  <ListItemText primary={chr} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TransLoad;
