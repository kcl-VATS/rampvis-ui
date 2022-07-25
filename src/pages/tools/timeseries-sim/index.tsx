import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Dialog, DialogContent } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import NetworkDataBlock from "src/components/networkVis/networkDataBlock";
import NetworkLoadBlock from "src/components/networkVis/NetworkLoadBlock";
import SubgraphCpg from "src/components/networkVis/SubgraphCpg";

const defaultServerListState = {
  fileList: [],
};

const TimeseriesSim = () => {
  // state functions to manage file uploading to the back-end and checking
  // available files at the back-end
  const [requestLoadPopup, setRequestLoadPopup] = useState(false);
  // state for list of files in the server
  const [filesOnServer, setFilesOnServer] = useState(defaultServerListState);
  // file to be transformed to network format
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false);
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

  // get request to get list of files
  const getFileList = async () => {
    // get endpoint to get list of files
    const apiUrl = "http://127.0.0.1:8000" + "/data/check";
    const response = await axios.get(apiUrl);
    return response;
  };

  return (
    <>
      <Helmet>
        <title>CpG Network System</title>
      </Helmet>
      <Box>
        <Grid>
          <NetworkDataBlock
            popupOpen={popUpOpen}
            popupClose={popUpClose}
            getFileList={getFileList}
            setFileList={setFilesOnServer}
          />
          <NetworkLoadBlock
            popupOpen={popUpOpen}
            popupClose={popUpClose}
            fileList={filesOnServer}
            networkStatus={isNetworkLoaded}
            setNetwork={setIsNetworkLoaded}
          />
          <SubgraphCpg
            popupOpen={popUpOpen}
            popupClose={popUpClose}
            networkStatus={isNetworkLoaded}
          />
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
