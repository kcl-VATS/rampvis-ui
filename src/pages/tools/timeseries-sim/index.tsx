import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Card, CardContent, Button } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { heatmapVats } from "src/components/timeseries-sim/plotfunctions/heatmap";
import { manhattanVats } from "src/components/timeseries-sim/plotfunctions/manhattan";
const API = process.env.NEXT_PUBLIC_API_PY;

const API_PY = API + "/timeseries-sim-search";

const TimeseriesSim = () => {
  //const { settings } = useSettings();

  const sankeyDataClick = async () => {
    await sankeyPost();
  };

  // heatmap summon prototype using user values

  const sankeyPost = async () => {
    const apiUrl =
      "http://0.0.0.0:4010" + "/stat/v1/timeseries-sim-search/sankey_generate/";

    const predictObj = {
      dummy: 10,
    };
    const response = await axios.post(apiUrl, predictObj);
    console.log("response = ", response);
    if (response.data) {
      console.log("response.data = ", response.data);
    }
  };

  return (
    <>
      <Helmet>
        <title>Vats Prototype</title>
      </Helmet>
      <Box>
        <Grid>
          <Card>
            <CardContent>Search Bar</CardContent>
          </Card>
          <Card>
            <h2>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={sankeyDataClick}
              >
                Get manhattan data
              </Button>
            </h2>
          </Card>
          <Card>
            <CardContent>
              <div id="heatmapArea" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div id="manhattanArea" />
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </>
  );
};

TimeseriesSim.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TimeseriesSim;
