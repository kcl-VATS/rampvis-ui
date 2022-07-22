import { useState, ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Grid, Box, Card, CardContent, Button } from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import axios from "axios";
import { useEffect } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "react-sigma-v2";
import "react-sigma-v2/lib/react-sigma-v2.css";

const API = process.env.NEXT_PUBLIC_API_PY;

const API_PY = API + "/timeseries-sim-search";

const TimeseriesSim = () => {
  //const { settings } = useSettings();

  const LoadGraph = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
      const graph = new Graph();
      graph.addNode("first", {
        x: 0,
        y: 0,
        size: 15,
        label: "My first node",
        color: "#FA4F40",
      });
      loadGraph(graph);
    }, [loadGraph]);

    return null;
  };

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
              <SigmaContainer style={{ height: "500px", width: "100%" }}>
                <LoadGraph />
              </SigmaContainer>
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
