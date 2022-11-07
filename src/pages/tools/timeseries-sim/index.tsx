import { useState, ReactElement } from "react";
import { Card, Grid, Box } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import NetworkDataBlock from "src/components/networkVis/NetworkDataBlock";
import NetworkLoadBlock from "src/components/networkVis/NetworkLoadBlock";
import LoadingPopUp from "src/components/networkVis/LoadingPopUp";
import {
  DataGrid,
  GridToolbar,
  GridEventListener,
  gridColumnsTotalWidthSelector,
} from "@mui/x-data-grid";
import CircosArea from "src/components/networkVis/CircosPlot";
import EwasPopUp from "src/components/networkVis/EwasPopUp";

const defaultServerListState = {
  fileList: ["default"],
};
// get request to get list of files
const getFileList = async () => {
  // get endpoint to get list of files
  const apiUrl = "http://127.0.0.1:4010" + "/data/check";
  const response = await axios.get(apiUrl);
  return response;
};

const getCols = (row: {}) =>
  Object.keys(row).map((key) => {
    return { field: key, headerName: key, width: 100 };
  });

const localApi = "http://127.0.0.1:4010";

const TimeseriesSim = () => {
  // state functions to manage file uploading to the back-end and checking
  // available files at the back-end
  const [requestLoadPopup, setRequestLoadPopup] = useState(false);
  // state for list of files in the server
  const [filesOnServer, setFilesOnServer] = useState(defaultServerListState);
  // file to be transformed to network format
  const [forceDirectedObj, setForceDirectedObj] = useState({});

  const [fileToNetwork, setFileToNetwork] = useState("");

  const [cpgData, setCpgData] = useState({ cols: [], rows: [] });

  const [assocPopUp, setAssocPopUp] = useState(false);

  const [ewasResult, setEwasResult] = useState({ cols: [], rows: [] });

  const [subgraphResult, setSubgraphResult] = useState({ cols: [], rows: [] });

  const [godmcResult, setGodmcResult] = useState({ cols: [], rows: [] });

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

  const handleRowClick: GridEventListener<"rowClick"> = async (
    params, // GridRowParams
  ) => {
    const ewasUrl = localApi + "/network/ewas";

    const ewasQuery = params.row.cpg;

    popUpOpen();

    const response = await axios.get(ewasUrl, {
      params: { cpg: ewasQuery, file: fileToNetwork, targetCpg: ewasQuery },
    });
    console.log(response);
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

    const subgraphResponse = response.data.subgraph;

    let godmcResponse = response.data.godmc;

    godmcResponse = godmcResponse.map((data, i) => ({ ...data, id: i }));

    popUpClose();

    setEwasResult({ cols: ewasCols, rows: ewasRows });
    setSubgraphResult({
      cols: getCols(subgraphResponse[0]),
      rows: subgraphResponse,
    });

    setGodmcResult({
      cols: getCols(godmcResponse[0]),
      rows: godmcResponse,
    });

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
                graphObj={forceDirectedObj}
                setGraphObj={setForceDirectedObj}
              />
            </Grid>
            {cpgData.rows?.length ? (
              <Grid item xs={12}>
                <Card sx={{ width: 800 }}>
                  <DataGrid
                    rows={cpgData.rows}
                    columns={cpgData.cols}
                    onRowClick={handleRowClick}
                    autoHeight
                    pageSize={10}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                  />
                </Card>
              </Grid>
            ) : (
              <div></div>
            )}

            <Grid item xs={12}>
              <CircosArea data={cpgData} />
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
