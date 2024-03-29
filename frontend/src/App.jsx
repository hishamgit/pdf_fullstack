import React from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";

const App = () => {
  // Set up worker source for PDF.js to configure react-pdf module
  pdfjs.GlobalWorkerOptions.workerSrc =
    "/node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.js";

  //ToastContainer for displaying notifications
  return (
    <div>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Routing setup using React Router */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
