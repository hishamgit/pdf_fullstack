import express from "express";
import multer from "multer";

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
 const upload = multer({ storage: storage });

router.post("/uploadPdf",upload.single('pdf'), async (req, res) => {
    const pdf = req.file;
    const selectedPages = JSON.parse(req.body.selectedPages);
    console.log(pdf,selectedPages);
    res.status(200).json({ message: 'PDF uploaded successfully' });
});

export default router;
