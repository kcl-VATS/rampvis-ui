import { SimpleBarChart } from "./simple-bar-chart";
import { SimpleLineChart } from "./simple-line-chart";
import { ChordDiagram } from "./chord-diagram";
import { Matrix } from "./matrix";
import { SuperimposedPercentiles } from "./superimposed-percentiles";
import { StackedBarChartWith6Places } from "./stacked-bar-chart-6-places";
import { StackedAreaChart } from "./stacked-area-chart";
import { StackedBarChart } from "./stacked-bar-chart";
import { MirroredStackedAreaChart } from "./mirrored-stacked-area-chart";
import { MirroredStackedBarChart } from "./mirrored-stacked-bar-chart";
import { SensitivityStackedBarChart } from "./sensitivity-stacked-bar-chart";
import { DashboardRiskMonitoring } from "./dashboards/dashboard-riskMonitoring";
import { UncertaintySampleAndMean } from "./uncertainty-sample-and-mean";
import { UncertaintyClusterSampleAndMean } from "./uncertainty-cluster-sample-and-mean";

// Dashboards
import { DashboardScotlandCouncil } from "./dashboards/dashboard-scotlandCouncil";
import { DashboardScotland } from "./dashboards/dashboard-scotland";
import { DashboardScotlandNHSBoard } from "./dashboards/dashboard-scotlandNHSBoard";
import { DashboardScotlandNew } from "./dashboards/dashboard-scotlandNew";
import { DashboardScotlandVaccination } from "./dashboards/dashboard-scotlandVaccination";
import { DashboardUK } from "./dashboards/dashboard-UK";
import { DashboardTian } from "./dashboards/dashboard-tian";
import { DashboardLowerTierLocalAuthority } from "./dashboards/dashboard-lowerTierLocalAuthority";
import { DashboardMSOA } from "./dashboards/dashboard-msoa";
import { DashboardNHSEnglandRegion } from "./dashboards/dashboard-nhsEnglandRegion"

export const visFactory = (type, args) => {
  if (type === "SimpleBarChart") return new SimpleBarChart(args);
  if (type === "SimpleLineChart") return new SimpleLineChart(args);
  if (type === "ChordDiagram") return new ChordDiagram(args);
  if (type === "Matrix") return new Matrix(args);
  if (type === "SuperimposedPercentiles")
    return new SuperimposedPercentiles(args);
  if (type === "StackedBarChartWith6Places")
    return new StackedBarChartWith6Places(args);
  if (type === "StackedAreaChart") return new StackedAreaChart(args);
  if (type === "StackedBarChart") return new StackedBarChart(args);
  if (type === "MirroredStackedAreaChart")
    return new MirroredStackedAreaChart(args);
  if (type === "MirroredStackedBarChart")
    return new MirroredStackedBarChart(args);
  if (type === "SensitivityStackedBarChart")
    return new SensitivityStackedBarChart(args);
  if (type == "UncertaintySampleAndMean")
    return new UncertaintySampleAndMean(args);
  if (type == "UncertaintyClusterSampleAndMean")
    return new UncertaintyClusterSampleAndMean(args);
    
  // Dashboards
  if (type === "CouncilOverview") return new DashboardScotlandCouncil(args);
  if (type === "HealthBoardOverview") return new DashboardScotlandNHSBoard(args);
  if (type === "CountryOverview") return new DashboardScotland(args);
  //if (type === "CountryOverviewNew") return new DashboardScotlandNew(args);
  if (type === "CountryOverviewNew") return new DashboardTian(args);
  if (type === "VaccineOverview") return new DashboardScotlandVaccination(args);
  if (type === "DashboardUK") return new DashboardUK(args);
  if (type === "DashboardLTLA") return new DashboardLowerTierLocalAuthority(args);
  // if (type === "VaccineOverview") return new DashboardMSOA(args);
  // if (type === "VaccineOverview") return new DashboardNHSEnglandRegion(args);
  if (type === "RiskMonitoring") return new DashboardRiskMonitoring(args);

  return null;
};
