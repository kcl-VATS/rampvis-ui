import { useState, ReactElement } from "react";
import { Card, Grid, Box } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import NetworkDataBlock from "src/components/networkVis/NetworkDataBlock";
import NetworkLoadBlock from "src/components/networkVis/NetworkLoadBlock";
import LoadingPopUp from "src/components/networkVis/LoadingPopUp";
import { DataGrid, GridToolbar, GridEventListener } from "@mui/x-data-grid";
import CircosArea from "src/components/networkVis/CircosPlot";
import EwasPopUp from "src/components/networkVis/EwasPopUp";
import { data } from "jquery";
import { Field } from "formik";

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

  const [cpgPopUp, setCpgPopUp] = useState(false);

  const [ewasResult, setEwasResult] = useState({ cols: [], rows: [] });

  const handleRowClick: GridEventListener<"rowClick"> = async (
    params, // GridRowParams
  ) => {
    const ewasUrl = "http://127.0.0.1:4010" + "/network/ewas";
    const cpgUrl = "http://127.0.0.1:4010" + "/network/subgraph";

    const ewasQuery = params.row.CpG;

    const cpgData = await axios.get(ewasUrl, { params: { cpg: ewasQuery } });

    const cpgResponse = await axios.get(cpgUrl, {
      params: { file: fileToNetwork, targetCpg: ewasQuery },
    });
    const fields = cpgData.data.fields;
    const cols = cpgData.data.fields.map((cols) => ({
      field: cols,
      headerName: cols,
      width: 100,
    }));
    let rows = cpgData.data.results.map((values) =>
      Object.fromEntries(fields.map((k, i) => [k, values[i]])),
    );
    rows = rows.map((data, i) => ({ ...data, id: i }));

    setEwasResult({ cols: cols, rows: rows });
  };

  // open loading circle
  const popUpOpen = () => {
    setRequestLoadPopup(true);
  };
  // close loading circle
  const popUpClose = () => {
    setRequestLoadPopup(false);
  };

  const cpgPopUpOpen = () => {
    setCpgPopUp(true);
  };
  // close loading circle
  const cpgPopUpClose = () => {
    setCpgPopUp(false);
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

          <Grid>
            {ewasResult.rows?.length ? (
              <Grid item xs={12} sx={{ width: 800, height: 800 }}>
                <Card sx={{ width: 800 }}>
                  <DataGrid
                    rows={ewasResult.rows}
                    columns={ewasResult.cols}
                    autoHeight
                    pageSize={10}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Card>
              </Grid>
            ) : (
              <div> No result from E</div>
            )}
          </Grid>
        </Grid>
      </Box>

      <LoadingPopUp state={requestLoadPopup}></LoadingPopUp>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
