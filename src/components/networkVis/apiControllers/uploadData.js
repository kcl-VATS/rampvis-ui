import axios from "axios";
const LOCAL_API = "http://127.0.0.1:4010";

export const getFileList = async () => {
  // get endpoint to get list of files
  const apiUrl = LOCAL_API + "/data/check";
  const response = await axios.get(apiUrl);
  return response;
};
