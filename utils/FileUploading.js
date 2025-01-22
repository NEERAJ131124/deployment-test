const fs = require("fs");


const { BlobServiceClient } = require("@azure/storage-blob");

// Initialize Azure Blob Service Client
const connectionString = process.env.S_CONNECTION_STRING;
const containerName = process.env.S_CONTAINER_NAME;
const accountName = process.env.S_ACCOUNT_NAME;
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

exports.uploadAzureFile = async (req, res) => {
  try {
    if (!req.file.path) {
      throw new Error(400, "File Not Uploaded");
    }
    const filePath = req.file.path;
    const fileName = req.file.filename;

    const url = await uploadfileAzureFile(fileName, filePath, 'coldstorage');
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      data: url,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadAzureFile:", error);
    fs.unlinkSync(req.file.path);

    res.status(500).json({ message: "Internal Server Error", data: error });
  }
};

exports.uploadAzureFileInController = async (file, folderType) => {
  try {
    if (!file.path) {
      throw new Error(400, "File Not Uploaded");
    }
    const filePath = file.path;
    const fileName = file.filename;

    const url = await uploadfileAzureFile(fileName, filePath, folderType);
    console.log(file.path);
    
    fs.unlinkSync(file.path);
    return url.url;
  } catch (error) {
    console.error("Error in uploadAzureFileInController:", error);
    fs.unlinkSync(file.path);
    return error;
  }
};

exports.deleteAzureFile = async (fileUrl) => {
  try {
    const parts = fileUrl.split("/");
    // Blob name is the last part
    const fileName = parts.slice(4).join("/");
    const blockBlobClient = await containerClient.getBlockBlobClient(
      `${fileName}`
    );
    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new Error("Blob not found");
    }
    const blobDeleteResponse = await blockBlobClient.delete();
    console.log((await blobDeleteResponse).clientRequestId);
    return "file deleted successfully";
  } catch (error) {
    return error;
  }
};

exports.viewAzureFile = async (req, res) => {
  try {
    let fileName = `${req.params.location}/${req.params.fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const downloadBlockBlobResponse = await blockBlobClient.download();
    const buffer = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );
    fileName = fileName.split("/").pop();
    const extension = fileName.split(".").pop().toLowerCase();
    let contentType;
    if (extension === "pdf") {
      contentType = "application/pdf";
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png"
    ) {
      contentType = "image/jpeg";
    } else {
      contentType = "application/octet-stream"; // default to binary data
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${req.params.fileName}"`
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error in viewAzureFile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to convert readable stream to buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

const uploadfileAzureFile = async (fileName, filePath, location) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(
      `${location}/${fileName}`
    );
    const imageuploadresponse = await blockBlobClient.uploadFile(filePath);
    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${location}/${fileName}`;
    return { ...imageuploadresponse, url };
  } catch (error) {
    return error;
  }
};
