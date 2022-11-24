import { useEffect, useState } from "react";
import { SigmaContainer, useLoadGraph, useSigma } from "react-sigma-v2";
import Graph from "graphology";
import "react-sigma-v2/lib/react-sigma-v2.css";
import circular from "graphology-layout/circular";
import { ForceAtlasControl } from "react-sigma-v2";
import {
  ControlsContainer,
  ZoomControl,
  SearchControl,
  useRegisterEvents,
  useSetSettings,
} from "react-sigma-v2";
import DragnDrop from "./networkHelpers/DragnDrop";
import { Attributes } from "graphology-types";

const cpgColorLevel = {
  0: "#c51b8a",
  1: "#fa9fb5",
  2: "#fde0dd",
};

const snpColorLevel = {
  1: "#3182bd",
  2: "#9ecae1",
  3: "#deebf7",
};

function SubgraphCpg(props) {
  const LoadGraph = () => {
    const registerEvents = useRegisterEvents();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const setSettings = useSetSettings();
    const sigma = useSigma();

    const loadGraph = useLoadGraph();
    useEffect(() => {
      if (props.graphObj.rows.length) {
        const nodeAttributes = props.graphObj.attr;
        const { snp: snpAttr, cpg: cpgAttr } = nodeAttributes;
        let snpLevelObj = {};
        let cpgLevelObj = {};
        snpAttr.map((snp) => (snpLevelObj[snp.id] = snp.level));
        cpgAttr.map((cpg) => (cpgLevelObj[cpg.id] = cpg.level));
        const networkData = props.graphObj.rows;
        const cpg_nodes = [...new Set(networkData.map((row) => row.cpg))].map(
          (row: string) => ({
            key: row,
            attributes: {
              color: cpgColorLevel[cpgLevelObj[row]],
              size: 3,
              label: row,
            },
          }),
        );
        const snp_nodes = [...new Set(networkData.map((row) => row.snp))].map(
          (row: string) => ({
            key: row,
            attributes: {
              color: snpColorLevel[snpLevelObj[row]],
              size: 3,
              label: row,
            },
          }),
        );
        const nodes = cpg_nodes.concat(snp_nodes);
        const edges = networkData.map((row) => ({
          key: row.cpg + row.snp,
          source: row.cpg,
          target: row.snp,
        }));
        const graphObj = {
          attributes: { name: "networkCpg" },
          nodes: nodes,
          edges: edges,
        };

        const graph = new Graph();

        graph.import(graphObj);

        circular.assign(graph);
        loadGraph(graph);

        registerEvents({
          enterNode: (event) => setHoveredNode(event.node),
          leaveNode: () => setHoveredNode(null),
        });
      }
    }, [props.graphObj]);

    useEffect(() => {
      setSettings({
        nodeReducer: (node, data) => {
          const graph = sigma.getGraph();
          const newData: Attributes = {
            ...data,
            highlighted: data.highlighted || false,
          };

          if (hoveredNode) {
            if (
              node === hoveredNode ||
              graph.neighbors(hoveredNode).includes(node)
            ) {
              newData.highlighted = true;
            } else {
              newData.color = "#E2E2E2";
              newData.highlighted = false;
            }
          }
          return newData;
        },
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };

          if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [hoveredNode, setSettings, sigma]);

    return null;
  };

  return (
    <div>
      <SigmaContainer
        id="subgraph"
        graphOptions={{ type: "directed" }}
        initialSettings={{
          renderLabels: true,
          hideLabelsOnMove: false,
          maxCameraRatio: 1,
          minCameraRatio: 0.1,
          allowInvalidContainer: true,
        }}
        style={{ height: "800px", width: "800px" }}
      >
        <LoadGraph />
        <DragnDrop />
        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
          <ForceAtlasControl
            settings={{ adjustSizes: true }}
            autoRunFor={2000}
          />
        </ControlsContainer>
        <ControlsContainer position={"top-right"}>
          <SearchControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
}

export default SubgraphCpg;
