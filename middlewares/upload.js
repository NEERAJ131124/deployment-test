const multer = require("multer");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

// Initialize Multer with storage engine
const upload = multer({ storage: storage });

exports.uploadCompanyBusinessCard = upload.single(`file`);

exports.uploadApprovalProposalPdf = upload.single(`Approval_Proposal_PDF`);

exports.uploadstoreimages = upload.fields([
  { name: "Thumbnail" },
  { name: "Images0" },
  { name: "Images1" },
  { name: "Images2" },
  { name: "Images3" },
  { name: "Images4" },
  { name: "Images5" },
  { name: "Images6" },
  { name: "Images7" },
  { name: "Images8" },
  { name: "Images9" },
]);

exports.uploadProfilePicture = upload.single(`ProfilePicture`);

exports.uploadUpdateContractImages = upload.fields([
  { name: "Project_Photos_1" },
  { name: "Project_Photos_2" },
  { name: "Project_Photos_3" },
  { name: "Project_Photos_4" },
  { name: "Project_Photos_5" },
  { name: "Project_Photos_6" },
  { name: "Project_Photos_7" },
  { name: "Project_Photos_8" },
  { name: "Project_Photos_9" },
  { name: "Project_Photos_10" },
  { name: "Project_Photos" },
]);

exports.uploadBoardMemberSignature = upload.single(`Signature`);

exports.uploadCompanyCertificate = upload.single(`companyCertificate`);
exports.uploadProposalFile = upload.single(`file`);
exports.uploadContractorProfileImage = upload.single(`file`);
exports.uploadOwnerDocument = upload.fields([
  { name: "Proof_Of_Ownership" },
  { name: "Id_Proof_Document" },
]);

exports.uploadTenantDocument = upload.fields([
  { name: "Lease_Agreement_Document" },
  { name: "Id_Proof_Document" },
]);

// Custom middleware to ensure that file is uploaded before proceeding
exports.ensureFileUploaded = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }
  next();
};
