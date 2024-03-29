// Importing necessary modules
import express from "express";
import { PORT, mongoDBUrl } from "./config.js";
import { connect } from "./helpers/connection.js";
import pdfRouter from "./routes/pdfRouter.js";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import { userAuthMiddleware } from "./helpers/authMiddleware.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// Creating an Express application
const app = express();

// Configuring CORS
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

//middleware for cookie
app.use(cookieParser());
//middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing for PDF functionalities
app.use("/api", pdfRouter);
// Routing for authentication
app.use("/api", authRouter);

app.get("/", (req, res) => {
  res.send("welcome user");
});
//token authentication
app.post("/api", userAuthMiddleware);

// Connecting to MongoDB
connect((err, data) => {
  if (err) {
    console.log("connection error occurred: ", err);
  } else {
    console.log("connected to atlas");
    // Start listening to requests
    app.listen(PORT, () => {
      console.log(`app is listening at port ${PORT}`);
    });
  }
});
