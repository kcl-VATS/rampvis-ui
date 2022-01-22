import { useEffect, useState } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { blue } from "@mui/material/colors";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import {
  processDataAndGetRegions,
  segmentData,
  onSelectRegion,
  onClickAnimate,
  createTimeSeriesSVG,
} from "src/components/story-boards/utils-story-1";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
}));

const Story = () => {
  const classes = useStyles();

  const [segment, setSegment] = useState<number>(3);
  const [regions, setRegions] = useState<string[]>([]);
  const [region, setRegion] = useState<string>("");
  const [animationCounter, setAnimationCounter] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const _regions = await processDataAndGetRegions();
      setRegions(_regions.map((d) => d));
      segmentData(segment);
    };

    fetchData().catch(console.error);
  }, []);

  const handleChangeSlider = (event) => {
    const selectedSegment = event.target.value;
    console.log("selectedSegment = ", selectedSegment);
    if (selectedSegment && selectedSegment !== segment) {
      setSegment(selectedSegment);
      segmentData(selectedSegment);
    }
  };

  // slider formatted value
  const valuetext = (value) => `${value}`;

  const handleChangeSelect = (event: SelectChangeEvent) => {
    const selectedRegion = event.target.value;
    console.log("selectedRegion = ", selectedRegion);
    if (selectedRegion) {
      onSelectRegion(selectedRegion);
      createTimeSeriesSVG("#chart1");
      setRegion(selectedRegion);
      setAnimationCounter(0);
    }
  };

  const handleClickButton = () => {
    let count = animationCounter + 1;
    setAnimationCounter(count);
    console.log(count);
    onClickAnimate(count, "#chart1");
  };

  return (
    <>
      <Head>
        <title>Story</title>
      </Head>
      <DashboardLayout>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 8,
          }}
        >
          <Container>
            <Card sx={{ minWidth: 1200 }}>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    <AutoStoriesIcon />
                  </Avatar>
                }
                title="Story-1"
                subheader="This page is untested and might have some  bugs!"
              />
              <CardContent sx={{ pt: "8px" }}>
                <FormGroup>
                  <InputLabel id="segment-slider-label">Segments</InputLabel>
                  <FormControl sx={{ m: 1, width: 300, mt: 0 }}>
                    <Slider
                      // labelId="segment-slider"
                      aria-label="Segments"
                      // defaultValue={3}
                      getAriaValueText={valuetext}
                      step={1}
                      marks
                      min={0}
                      max={5}
                      value={segment}
                      valueLabelDisplay="auto"
                      onChange={handleChangeSlider}
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <InputLabel id="select-region-label">
                      Select region
                    </InputLabel>
                    <Select
                      labelId="select-region-label"
                      id="select-region-label"
                      displayEmpty
                      onChange={handleChangeSelect}
                      value={region}
                    >
                      {regions.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <Button
                      variant="contained"
                      disabled={!region}
                      onClick={handleClickButton}
                    >
                      Click to proceed animation
                    </Button>
                  </FormControl>
                </FormGroup>

                <div id="chart1" />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Story;