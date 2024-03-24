import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import axios from "axios";
import { REACT_APP_API_URL } from "../../config.js";

const Home = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const axiosInstance=axios.create({baseURL:REACT_APP_API_URL})


  const handleButtonClick = () => {
    if(pdf){
        // Prepare the data to be sent in the request body
    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('selectedPages', JSON.stringify(selectedPages));
    console.log(formData);

    // Send a POST request using Axios
    axiosInstance.post('/uploadPdf', formData)
      .then(response => {
        // Handle success response
        console.log('Upload successful:', response.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error uploading PDF:', error);
      });
    }else{
        console.log("please choose pdf");
    }
    
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleCheckboxChange = (page_no) => {
    const status = selectedPages.includes(page_no);
    if (status) {
      setSelectedPages(
        selectedPages.filter((page) => {
          if (page !== page_no) {
            return page;
          }
        })
      );
    } else {
      setSelectedPages([...selectedPages, page_no]);
    }
  };

  const handleSuccess = (e) => {
    const file = e.target.files[0];
    if (file) {
      // const fileURL = URL.createObjectURL(file);
      setPdf(file);
    }
  };
  useEffect(() => {
    // This code will run after 'pdf' state is updated
    console.log("PDF state updated:", pdf);
  }, [pdf]);
  return (
    <div className="p-4 bg-gray-800 h-full">
      <div className="flex justify-center pb-16">
        <h1 className="text-4xl font-medium text-green-400 my-4 ">Welcome</h1>
      </div>

      <div className="flex flex-col justify-center border-2 border-sky-800 rounded-xl p-4 mx-auto w-3/4 md:w-[800px]">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          onChange={handleSuccess}
          type="file"
          accept="application/pdf"
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          .pdf
        </p>

        <br />
        {pdf && (
          <div className="w-full overflow-hidden">
            <div className="flex justify-center">
            <h2 className="text-2xl font-medium text-white">Preview</h2>
            </div>
            <br />
            <p className="text-white">Choose pages</p>
            <div className="w-full overflow-auto ">
              <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`}>
                    <Page pageNumber={index + 1} />
                    <input
                      type="checkbox"
                      id={`page_${index + 1}`}
                      checked={selectedPages.includes(index + 1)}
                      onChange={() => handleCheckboxChange(index + 1)}
                    />
                    <label className="text-white" htmlFor={`page_${index + 1}`}>
                      Page {index + 1}
                    </label>
                  </div>
                ))}
              </Document>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center pt-16">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleButtonClick}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Home;
