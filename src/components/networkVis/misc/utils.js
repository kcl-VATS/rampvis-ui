import toImg from "react-svg-to-image";

export const getCols = (row) =>
  Object.keys(row).map((key) => {
    return { field: key, headerName: key, width: 100 };
  });

export const listToStr = (chr_lst) => {
  let text = "0";
  chr_lst.map((chr) => (text = text + "-" + chr));
  return text;
};

// function to save svg as png
export const savePlot = async (plotId) => {
  const plot = await toImg("#" + plotId + "Plot", plotId, {
    scale: 1,
    quality: 1,
    download: true,
  });
};
