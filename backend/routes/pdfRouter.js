import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body.userId;
    // Create a directory with the userId if it doesn't exist
    const userDir = `uploads/${userId}`;
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Callback with null error and original filename
  },
});
const upload = multer({ storage: storage });

// Route for handling PDF upload
router.post("/uploadPdf", upload.single("pdf"), async (req, res) => {
  const pdf = req.file;
  const selectedPages = JSON.parse(req.body.selectedPages);
  const userId = req.body.userId;
  //   console.log(pdf,selectedPages,userId);
  // Process the uploaded PDF to create a new PDF with selected pages
  const newPdf = await processPdf(pdf, selectedPages);
  res.json({ status: true });
});
// Route for downloading the newly created PDF
router.get("/getPdf", async (req, res) => {
  fs.readFile("new.pdf", (err, data) => {
    if (err) {
      console.error("Error reading PDF file:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Set the appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");

    // Send the PDF file data as the response
    res.send(data);
    //deleting pdf after being sent
    fs.unlink("new.pdf", (err) => {
      if (err) {
        console.error("Error deleting PDF file:", err);
      } else {
        console.log("PDF file deleted successfully");
      }
    });
  });
});

async function processPdf(pdf, selectedPages) {
  // Create a new PDF document
  const newPdf = await PDFDocument.create();
  try {
    // Read the PDF file using streams

    const pdfBytes = fs.readFileSync(pdf.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // Iterate over the selected pages and copy them to the new PDF
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNumber - 1]);
      newPdf.addPage(copiedPage);
    }
    // Save the new PDF document to a buffer
    const pdfBytesBuffer = await newPdf.save();
    fs.writeFileSync("new.pdf", pdfBytesBuffer);
    return pdfBytesBuffer;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

// Route for fetching old PDFs associated with a user
router.get("/oldPdfs", (req, res) => {
  const userId = req.query.userId;
  const pdfDir = `uploads/${userId}`;
  // Read directory contents synchronously
  const pdfFiles = fs.readdirSync(pdfDir);
  const pdfs = pdfFiles.map((file) => {
    // Map each file to an object containing filename and path
    const filename = file;
    const pathToFile = path.join(pdfDir, file);
    return { filename, path: pathToFile };
  });
  res.json(pdfs);
});

// Route for downloading old PDFs
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const userid = req.query.userId;
  const filePath = path.join(`uploads/${userid}`, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    console.log("hi");
    // Set the appropriate headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    // Send the file as a response
    res.download(filePath);
  } else {
    // If the file does not exist, return a 404 error
    res.status(404).send("File not found");
  }
});

export default router;
