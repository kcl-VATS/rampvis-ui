import { Grid, Card, Box, Dialog, DialogContent } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
function EwasPopUp(props) {
  return (
    <Dialog onClose={props.close} open={props.state}>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          {props.data.rows?.length ? (
            <Grid item xs={12} sx={{ width: 800, height: 800 }}>
              <Card sx={{ width: 800 }}>
                <DataGrid
                  rows={props.data.rows}
                  columns={props.data.cols}
                  autoHeight
                  pageSize={10}
                  components={{ Toolbar: GridToolbar }}
                />
              </Card>
            </Grid>
          ) : (
            <div></div>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
export default EwasPopUp;
