import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Box,
  Dialog,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar, GridSelectionModel } from "@mui/x-data-grid";
import SubgraphCpg from "./SubgraphCpg";

function EwasPopUp(props) {
  const [networkData, setNetworkData] = useState({
    cols: [],
    rows: [],
    attr: [],
  });

  useEffect(() => {
    setNetworkData(props.subgraphData);
  }, [props.subgraphData]);

  const ids = props.subgraphData.rows.map((row) => row.id);

  const [checkboxCpg, setCheckboxCpg] = useState<GridSelectionModel>(ids);

  const [selectMemo, setSelectMemo] = useState<GridSelectionModel>([]);

  const multipleSelectionHandle = (select) => {
    if (selectMemo) {
      if (select.length > selectMemo.length) {
        // item removed from datagrid

        const selectedCpgRows = props.subgraphData.rows.filter(
          (
            row, // other rows with same cpg values
          ) => select.includes(row.id),
        );

        const selectedCpgs = selectedCpgRows.map((row) => row.cpg);
        const cpg = props.subgraphData.rows.filter((row) =>
          selectedCpgs.includes(row.cpg),
        );

        const cpgIds = cpg.map((row) => row.id);

        const newDataObj = {
          // filter data to supply to circos plot
          cols: props.subgraphData.cols,
          rows: cpg,
          attr: props.subgraphData.attr,
        };

        setNetworkData(newDataObj);

        setCheckboxCpg(cpgIds);

        setSelectMemo(cpgIds);
      } else {
        const removedCpgId = selectMemo.filter((ids) => !select.includes(ids)); // cpg clicked on to remove

        const removedCpg = props.subgraphData.rows
          .filter((rows) => rows.id == removedCpgId)
          .map((row) => row.cpg); // removed cpg

        const removedIds = props.subgraphData.rows
          .filter((rows) => rows.cpg == removedCpg)
          .map((row) => row.id);

        const remainingIds = selectMemo.filter(
          (ids) => !removedIds.includes(ids),
        );

        const remainingCpgData = props.subgraphData.rows.filter(
          (
            row, // other rows with same cpg values
          ) => remainingIds.includes(row.id),
        );

        const newDataObj = {
          // filter data to supply to circos plot
          cols: props.subgraphData.cols,
          rows: remainingCpgData,
          attr: props.subgraphData.attr,
        };

        setNetworkData(newDataObj);

        setCheckboxCpg(remainingIds);

        setSelectMemo(remainingIds);
      }
    } else {
      const selectedCpgRows = props.subgraphData.rows.filter(
        (
          row, // other rows with same cpg values
        ) => select.includes(row.id),
      );

      const selectedCpgs = selectedCpgRows.map((row) => row.cpg);
      console.log(selectedCpgs);
      const cpg = props.data.rows.filter((row) =>
        selectedCpgs.includes(row.cpg),
      );
      const cpgIds = cpg.map((row) => row.id);

      const newDataObj = {
        // filter data to supply to circos plot
        cols: props.subgraphData.cols,
        rows: cpg,
        attr: props.subgraphData.attr,
      };

      setNetworkData(newDataObj);

      setCheckboxCpg(cpgIds);

      setSelectMemo(cpgIds);
    }
  };

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
                  checkboxSelection
                  onSelectionModelChange={(select) =>
                    multipleSelectionHandle(select)
                  }
                  selectionModel={checkboxCpg}
                />

                <SubgraphCpg graphObj={networkData}></SubgraphCpg>
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
