import { useState, ReactElement } from "react";
import { styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import {
  Grid,
  Box,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Typography,
} from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import NetworkDataBlock from "src/components/networkVis/NetworkDataBlock";
import TransLoad from "src/components/networkVis/TransLoad";
import LoadingPopUp from "src/components/networkVis/LoadingPopUp";
import CircosArea from "src/components/networkVis/CircosArea";
import EwasPopUp from "src/components/networkVis/EwasPopUp";
import CpgList from "src/components/networkVis/CpgList";
import TransView from "src/components/networkVis/TransView";
import { listToStr, getCols } from "src/components/networkVis/misc/utils";
import { getFileList } from "src/components/networkVis/apiControllers/uploadData";
import CisLoad from "src/components/networkVis/cisLoad";
import CisView from "src/components/networkVis/CisView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ManhattanArea from "src/components/networkVis/ManhattanArea";

const LOCAL_API = "http://127.0.0.1:4010";
const defaultServerListState = {
  fileList: ["default"],
};
// get request to get list of files

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TimeseriesSim = () => {
  // state functions to manage file uploading to the back-end and checking
  // available files at the back-end
  const [requestLoadPopup, setRequestLoadPopup] = useState(false);
  // state for list of files in the server
  const [filesOnServer, setFilesOnServer] = useState(defaultServerListState);
  // file to be transformed to network format
  const [circosData, setCircosData] = useState({ cols: [], rows: [] });

  const [manhattanData, setManhattanData] = useState({ cols: [], rows: [] });

  const [fileToNetwork, setFileToNetwork] = useState("");

  const [transCpgData, setTransCpgData] = useState({ cols: [], rows: [] });

  const [cisCpgData, setCisCpgData] = useState({
    cols: [],
    rows: [],
    lims: [],
  });

  const [assocPopUp, setAssocPopUp] = useState(false);

  const [ewasResult, setEwasResult] = useState({ cols: [], rows: [] });

  const [subgraphResult, setSubgraphResult] = useState({
    cols: [],
    rows: [],
    attr: [],
  });

  const [godmcResult, setGodmcResult] = useState({ cols: [], rows: [] });

  const [selectedCpgList, setSelectedCpgList] = useState([]);

  const [circosExpanded, setCircosExpanded] = useState(false);

  const handleCircosExpandClick = () => {
    setCircosExpanded(!circosExpanded);
  };

  const [manhattanExpanded, setManhattanExpanded] = useState(false);

  const handleManhattanExpandClick = () => {
    setManhattanExpanded(!manhattanExpanded);
  };

  // open loading circle
  const popUpOpen = () => {
    setRequestLoadPopup(true);
  };
  // close loading circle
  const popUpClose = () => {
    setRequestLoadPopup(false);
  };

  const assocPopUpOpen = () => {
    setAssocPopUp(true);
  };
  // close loading circle
  const assocPopUpClose = () => {
    setAssocPopUp(false);
  };

  const handleCpgList = async () => {
    popUpOpen();

    const ewasUrl = LOCAL_API + "/network/ewas";
    const ewasQuery = listToStr(selectedCpgList).slice(2);

    const response = await axios.get(ewasUrl, {
      params: { cpg: ewasQuery, file: fileToNetwork, level: 1 },
    });

    const ewasResponse = response.data.ewas;
    const ewasFields = ewasResponse.fields;
    const ewasCols = ewasResponse.fields.map((cols) => ({
      field: cols,
      headerName: cols,
      width: 100,
    }));

    let ewasRows = ewasResponse.results.map((values) =>
      Object.fromEntries(ewasFields.map((k, i) => [k, values[i]])),
    );

    ewasRows = ewasRows.map((data, i) => ({ ...data, id: i }));

    const subgraphResponse = response.data.subgraph.edgeAttributes;
    const subgraphAttributes = response.data.subgraph.nodeAttributes;

    let godmcResponse = response.data.godmc;

    setEwasResult({ cols: ewasCols, rows: ewasRows });

    setSubgraphResult({
      cols: getCols(subgraphResponse[0]),
      rows: subgraphResponse,
      attr: subgraphAttributes,
    });

    if (typeof godmcResponse !== "string") {
      godmcResponse = godmcResponse.map((data, i) => ({ ...data, id: i }));
      setGodmcResult({
        cols: getCols(godmcResponse[0]),
        rows: godmcResponse,
      });
    }

    popUpClose();
    assocPopUpOpen();
  };

  // on page-load, get available files on the server, check network status etc..
  useEffect(() => {
    const initialLoad = async () => {
      // get request to get file list
      const response = await getFileList();
      // update file list
      setFilesOnServer(response.data);
    };
    initialLoad();
  }, []);

  return (
    <>
      <title>CpG Network System</title>

      <Box>
        <Grid>
          <Grid container spacing={2} sx={{ margin: "auto" }}>
            <Grid item xs={12}>
              <NetworkDataBlock
                popupOpen={popUpOpen}
                popupClose={popUpClose}
                getFileList={getFileList}
                setFileList={setFilesOnServer}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={{ xs: 1, md: 1 }}>
                <Grid item xs={0} sm={0} md={0}>
                  <CisLoad
                    popupOpen={popUpOpen}
                    popupClose={popUpClose}
                    fileList={filesOnServer}
                    file={fileToNetwork}
                    setFile={setFileToNetwork}
                    setCpgData={setCisCpgData}
                    setCollapse={handleManhattanExpandClick}
                  />
                </Grid>

                <Grid item xs={0} sm={0} md={0}>
                  <TransLoad
                    popupOpen={popUpOpen}
                    popupClose={popUpClose}
                    fileList={filesOnServer}
                    file={fileToNetwork}
                    setFile={setFileToNetwork}
                    setCpgData={setTransCpgData}
                    setCircosData={setCircosData}
                    setCollapse={handleCircosExpandClick}
                  />
                </Grid>

                <Grid item xs={0} sm={0} md={0}>
                  <CpgList
                    selectedCpgList={selectedCpgList}
                    handleCpgList={handleCpgList}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ width: 800 }}>
                <CardHeader
                  action={
                    <ExpandMore
                      expand={manhattanExpanded}
                      onClick={handleManhattanExpandClick}
                      aria-expanded={manhattanExpanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  }
                  title="Manhattan Plot Results"
                />
                <Collapse in={manhattanExpanded} timeout="auto" unmountOnExit>
                  <CisView
                    data={cisCpgData}
                    selectionHandle={setSelectedCpgList}
                    graphData={manhattanData}
                    graphHandle={setManhattanData}
                  />
                  <ManhattanArea data={cisCpgData} graphData={manhattanData} />
                </Collapse>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ width: 800 }}>
                <CardHeader
                  action={
                    <ExpandMore
                      expand={circosExpanded}
                      onClick={handleCircosExpandClick}
                      aria-expanded={circosExpanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  }
                  title="Circos Plot Results"
                />

                <Collapse in={circosExpanded} timeout="auto" unmountOnExit>
                  <TransView
                    data={transCpgData}
                    selectionHandle={setSelectedCpgList}
                    graphData={circosData}
                    graphHandle={setCircosData}
                  />
                  <CircosArea data={circosData} />
                </Collapse>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <EwasPopUp
        ewasData={ewasResult}
        subgraphData={subgraphResult}
        godmcData={godmcResult}
        close={assocPopUpClose}
        state={assocPopUp}
      />
      <LoadingPopUp state={requestLoadPopup} />
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
