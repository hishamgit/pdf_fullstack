import React from "react";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";

const App = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.js';
  return <div>
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
    </div>;
};

export default App;
