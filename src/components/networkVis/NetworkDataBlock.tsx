import { TextField, Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const defaultFileState = {
  selectedFile: null,
};

function NetworkDataBlock(props) {
  // available files at the back-end
  // state of user uploaded file
  const [fileToUpload, setFileToUpload] = useState(defaultFileState);

  // file upload post request
  // uploads the file and returns updated file list
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append(
      "file",
      fileToUpload.selectedFile,
      fileToUpload.selectedFile.name,
    );
    // post endpoint to upload data
    const apiUrl = "http://127.0.0.1:4010" + "/data/upload";
    const response = await axios.post(apiUrl, formData);
    return response;
  };

  // handler for file input field
  const onFileChange = (event) => {
    setFileToUpload({ selectedFile: event.target.files[0] });
  };

  // onClick file upload function which uploads the file and returns updated file list
  const onFileUpload = async () => {
    props.popupOpen();
    const fileUploadResponse = await uploadFile();
    console.log("fileUploadResponse = ", fileUploadResponse.data);

    const fileListFromServerResponse = await props.getFileList();
    props.setFileList(fileListFromServerResponse.data);
    console.log(
      "fileListFromServerResponse = ",
      fileListFromServerResponse.data,
    );
    props.popupClose();
  };

  return (
    <div>
      <Card sx={{ width: 400 }}>
        <CardContent>
          Upload meQTL data
          <h2>
            <TextField type="file" onChange={onFileChange} />
          </h2>
          <Button
            disabled={!fileToUpload.selectedFile}
            onClick={onFileUpload}
            variant="outlined"
          >
            Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default NetworkDataBlock;
