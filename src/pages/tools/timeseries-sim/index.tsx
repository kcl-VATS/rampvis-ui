import { useState, ReactElement } from "react";
import { Grid, Box } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import NetworkDataBlock from "src/components/networkVis/NetworkDataBlock";
import NetworkLoadBlock from "src/components/networkVis/NetworkLoadBlock";
import LoadingPopUp from "src/components/networkVis/LoadingPopUp";
import CircosArea from "src/components/networkVis/CircosPlot";
import EwasPopUp from "src/components/networkVis/EwasPopUp";
import CpgList from "src/components/networkVis/CpgList";
import TransView from "src/components/networkVis/TransView";
import { listToStr, getCols } from "src/components/networkVis/misc/utils";
import { getFileList } from "src/components/networkVis/apiControllers/uploadData";
const LOCAL_API = "http://127.0.0.1:4010";

const defaultServerListState = {
  fileList: ["default"],
};
// get request to get list of files

const TimeseriesSim = () => {
  // state functions to manage file uploading to the back-end and checking
  // available files at the back-end
  const [requestLoadPopup, setRequestLoadPopup] = useState(false);
  // state for list of files in the server
  const [filesOnServer, setFilesOnServer] = useState(defaultServerListState);
  // file to be transformed to network format
  const [circosData, setCircosData] = useState({ cols: [], rows: [] });

  const [fileToNetwork, setFileToNetwork] = useState("");

  const [cpgData, setCpgData] = useState({ cols: [], rows: [] });

  const [assocPopUp, setAssocPopUp] = useState(false);

  const [ewasResult, setEwasResult] = useState({ cols: [], rows: [] });

  const [subgraphResult, setSubgraphResult] = useState({
    cols: [],
    rows: [],
    attr: [],
  });

  const [godmcResult, setGodmcResult] = useState({ cols: [], rows: [] });

  const [selectedCpgList, setSelectedCpgList] = useState([]);

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
          <Grid container spacing={1} sx={{ margin: "auto" }}>
            <Grid item xs={12}>
              <NetworkDataBlock
                popupOpen={popUpOpen}
                popupClose={popUpClose}
                getFileList={getFileList}
                setFileList={setFilesOnServer}
              />
            </Grid>

            <Grid item xs={12}>
              <NetworkLoadBlock
                popupOpen={popUpOpen}
                popupClose={popUpClose}
                fileList={filesOnServer}
                file={fileToNetwork}
                setFile={setFileToNetwork}
                setCpgData={setCpgData}
                setCircosData={setCircosData}
              />
            </Grid>

            <Grid item xs={12}>
              <CpgList
                selectedCpgList={selectedCpgList}
                handleCpgList={handleCpgList}
              />
            </Grid>

            <Grid item xs={12}>
              <TransView
                data={cpgData}
                selectionHandle={setSelectedCpgList}
                graphData={circosData}
                graphHandle={setCircosData}
              />
            </Grid>

            <Grid item xs={12}>
              <CircosArea data={circosData} />
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
