import {
  ListItem,
  ListItemText,
  List,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

function CpgList(props) {
  return (
    <div>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography> Selected CpGs </Typography>
          <div
            style={{
              borderStyle: "solid",
              borderColor: "#c4c4c4",
              borderWidth: "1px",
              borderRadius: "12px",
              minHeight: "200px",
            }}
          >
            <List
              sx={{
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {props.selectedCpgList.map(
                (
                  cpgs, // time series bag list creation
                ) => (
                  <ListItem key={cpgs}>
                    <ListItemText primary={cpgs} />
                  </ListItem>
                ),
              )}
            </List>
          </div>

          <Button variant="outlined" onClick={props.handleCpgList}>
            Go to advanced view
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default CpgList;
