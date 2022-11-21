import { useState } from "react";

import { DataGrid, GridToolbar, GridSelectionModel } from "@mui/x-data-grid";

import { Card } from "@mui/material";

function TransView(props) {
  const [checkboxCpg, setCheckboxCpg] = useState<GridSelectionModel>([]);

  const [selectMemo, setSelectMemo] = useState<GridSelectionModel>([]);

  const multipleSelectionHandle = (select) => {
    if (select.length === 0) {
      // if no checkbox selected
      props.graphHandle(props.data); // draw circos using all data
    } else {
      if (selectMemo) {
        if (select.length > selectMemo.length) {
          // item removed from datagrid

          const selectedCpgRows = props.data.rows.filter(
            (
              row, // other rows with same cpg values
            ) => select.includes(row.id),
          );

          const selectedCpgs = selectedCpgRows.map((row) => row.cpg);
          const cpg = props.data.rows.filter((row) =>
            selectedCpgs.includes(row.cpg),
          );
          console.log(selectedCpgs);

          const cpgIds = cpg.map((row) => row.id);

          const newDataObj = {
            // filter data to supply to circos plot
            cols: props.graphData.cols,
            rows: cpg,
          };

          props.selectionHandle([...new Set(selectedCpgs)]);

          props.graphHandle(newDataObj);

          setCheckboxCpg(cpgIds);

          setSelectMemo(cpgIds);
        } else {
          const removedCpgId = selectMemo.filter(
            (ids) => !select.includes(ids),
          ); // cpg clicked on to remove

          const removedCpg = props.data.rows
            .filter((rows) => rows.id == removedCpgId)
            .map((row) => row.cpg); // removed cpg

          const removedIds = props.data.rows
            .filter((rows) => rows.cpg == removedCpg)
            .map((row) => row.id);

          const remainingIds = selectMemo.filter(
            (ids) => !removedIds.includes(ids),
          );

          const remainingCpgData = props.data.rows.filter(
            (
              row, // other rows with same cpg values
            ) => remainingIds.includes(row.id),
          );

          console.log(remainingCpgData.map((row) => row.cpg));

          const newDataObj = {
            // filter data to supply to circos plot
            cols: props.graphData.cols,
            rows: remainingCpgData,
          };

          props.selectionHandle([
            ...new Set(remainingCpgData.map((row) => row.cpg)),
          ]);

          props.graphHandle(newDataObj);

          setCheckboxCpg(remainingIds);

          setSelectMemo(remainingIds);
        }
      } else {
        const selectedCpgRows = props.data.rows.filter(
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
          cols: props.graphData.cols,
          rows: cpg,
        };

        props.selectionHandle([...new Set(selectedCpgs.map((row) => row.cpg))]);

        props.graphHandle(newDataObj);

        setCheckboxCpg(cpgIds);

        setSelectMemo(cpgIds);
      }
    }
  };

  if (props.data.rows?.length > 1) {
    return (
      <Card sx={{ width: 800 }}>
        <DataGrid
          rows={props.data.rows}
          columns={props.data.cols}
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
          onSelectionModelChange={(select) => multipleSelectionHandle(select)}
          selectionModel={checkboxCpg}
        />
      </Card>
    );
  } else {
    return <div></div>;
  }
}

export default TransView;
