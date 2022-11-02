import CircularProgress from "@mui/material/CircularProgress";
import { Box, Dialog, DialogContent } from "@mui/material";
function LoadingPopUp(props) {
  return (
    <Dialog open={props.state}>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
export default LoadingPopUp;
