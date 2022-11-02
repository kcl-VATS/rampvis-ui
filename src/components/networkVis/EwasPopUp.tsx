import { Box, Dialog, DialogContent, Typography } from "@mui/material";
function EwasPopUp(props) {
  console.log(props.data);
  return (
    <Dialog open={props.state}>
      <DialogContent>
        <Box sx={{ display: "flex" }}></Box>
      </DialogContent>
    </Dialog>
  );
}
export default EwasPopUp;
