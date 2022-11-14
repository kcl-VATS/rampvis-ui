import { useState } from "react";
import {
  Grid,
  Card,
  Box,
  Dialog,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SubgraphCpg from "./SubgraphCpg";

function EwasPopUp(props) {
  return (
    <Dialog fullScreen={true} onClose={props.close} open={props.state}>
      <DialogContent>
        <Box>
          <Typography>Ewas Data</Typography>
          {props.ewasData.rows?.length ? (
            <Grid item xs={12} sx={{ width: 800 }}>
              <Card sx={{ width: 800 }}>
                <DataGrid
                  rows={props.ewasData.rows}
                  columns={props.ewasData.cols}
                  autoHeight
                  pageSize={10}
                  components={{ Toolbar: GridToolbar }}
                />
              </Card>
            </Grid>
          ) : (
            <div> No result </div>
          )}
          <h2></h2>
          <Typography> Network Data and Graph</Typography>
          {props.subgraphData.rows?.length ? (
            <Grid item xs={12} sx={{ width: 800 }}>
              <Card sx={{ width: 800 }}>
                <DataGrid
                  rows={props.subgraphData.rows}
                  columns={props.subgraphData.cols}
                  autoHeight
                  pageSize={10}
                  components={{ Toolbar: GridToolbar }}
                />

                <SubgraphCpg graphObj={props.subgraphData}></SubgraphCpg>
              </Card>
            </Grid>
          ) : (
            <div> No result </div>
          )}

          {props.godmcData.rows?.length ? (
            <Grid item xs={12} sx={{ width: 800 }}>
              <Card sx={{ width: 800 }}>
                <DataGrid
                  rows={props.godmcData.rows}
                  columns={props.godmcData.cols}
                  autoHeight
                  pageSize={10}
                  components={{ Toolbar: GridToolbar }}
                />
              </Card>
            </Grid>
          ) : (
            <div> No result </div>
          )}

          <Button onClick={props.close}>Close</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
export default EwasPopUp;
