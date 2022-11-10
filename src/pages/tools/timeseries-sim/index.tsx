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
  GridSelectionModel,
} from "@mui/x-data-grid";
import CircosArea from "src/components/networkVis/CircosPlot";
import EwasPopUp from "src/components/networkVis/EwasPopUp";
import InfoPopUp from "src/components/timeseries-sim/InfoPopUp";
import { route } from "next/dist/server/router";
import { ro } from "date-fns/locale";
import { remove } from "nprogress";
import { rootShouldForwardProp } from "@mui/material/styles/styled";

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

const getCols = (row) =>
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
  const [circosData, setCircosData] = useState({ cols: [], rows: [] });

  const [fileToNetwork, setFileToNetwork] = useState("");

  const [cpgData, setCpgData] = useState({ cols: [], rows: [] });

  const [assocPopUp, setAssocPopUp] = useState(false);

  const [ewasResult, setEwasResult] = useState({ cols: [], rows: [] });

  const [subgraphResult, setSubgraphResult] = useState({ cols: [], rows: [] });

  const [godmcResult, setGodmcResult] = useState({ cols: [], rows: [] });

  const [checkboxCpg, setCheckboxCpg] = useState<GridSelectionModel>([]);

  const [selectMemo, setSelectMemo] = useState<GridSelectionModel>([]);

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

  const multipleSelectionHandle = (select) => {
    if (select.length === 0) {
      // if no checkbox selected
      setCircosData(cpgData); // draw circos using all data
    } else {
      if (selectMemo) {
        if (select.length > selectMemo.length) {
          // item removed from datagrid

          const selectedCpgRows = cpgData.rows.filter(
            (
              row, // other rows with same cpg values
            ) => select.includes(row.id),
          );

          const selectedCpgs = selectedCpgRows.map((row) => row.cpg);
          const cpg = cpgData.rows.filter((row) =>
            selectedCpgs.includes(row.cpg),
          );
          const cpgIds = cpg.map((row) => row.id);

          const newDataObj = {
            // filter data to supply to circos plot
            cols: circosData.cols,
            rows: cpg,
          };

          setCircosData(newDataObj);

          setCheckboxCpg(cpgIds);

          setSelectMemo(cpgIds);
        } else {
          const removedCpgId = selectMemo.filter(
            (ids) => !select.includes(ids),
          ); // cpg clicked on to remove

          const removedCpg = cpgData.rows
            .filter((rows) => rows.id == removedCpgId)
            .map((row) => row.cpg); // removed cpg

          const removedIds = cpgData.rows
            .filter((rows) => rows.cpg == removedCpg)
            .map((row) => row.id);

          const remainingIds = selectMemo.filter(
            (ids) => !removedIds.includes(ids),
          );

          const remainingCpgData = cpgData.rows.filter(
            (
              row, // other rows with same cpg values
            ) => remainingIds.includes(row.id),
          );

          const newDataObj = {
            // filter data to supply to circos plot
            cols: circosData.cols,
            rows: remainingCpgData,
          };

          setCircosData(newDataObj);

          setCheckboxCpg(remainingIds);

          setSelectMemo(remainingIds);
        }
      } else {
        const selectedCpgRows = cpgData.rows.filter(
          (
            row, // other rows with same cpg values
          ) => select.includes(row.id),
        );

        const selectedCpgs = selectedCpgRows.map((row) => row.cpg);
        const cpg = cpgData.rows.filter((row) =>
          selectedCpgs.includes(row.cpg),
        );
        const cpgIds = cpg.map((row) => row.id);

        const newDataObj = {
          // filter data to supply to circos plot
          cols: circosData.cols,
          rows: cpg,
        };

        setCircosData(newDataObj);

        setCheckboxCpg(cpgIds);

        setSelectMemo(cpgIds);
      }
    }
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

    popUpClose();

    setEwasResult({ cols: ewasCols, rows: ewasRows });
    setSubgraphResult({
      cols: getCols(subgraphResponse[0]),
      rows: subgraphResponse,
    });

    if (typeof godmcResponse !== "string") {
      godmcResponse = godmcResponse.map((data, i) => ({ ...data, id: i }));
      setGodmcResult({
        cols: getCols(godmcResponse[0]),
        rows: godmcResponse,
      });
    }

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
            {cpgData.rows?.length ? (
              <Grid item xs={12}>
                <Card sx={{ width: 800 }}>
                  <DataGrid
                    rows={cpgData.rows}
                    columns={cpgData.cols}
                    onRowClick={handleRowClick}
                    autoHeight
                    pageSize={10}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    onSelectionModelChange={(select) =>
                      multipleSelectionHandle(select)
                    }
                    selectionModel={checkboxCpg}
                  />
                </Card>
              </Grid>
            ) : (
              <div></div>
            )}

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
