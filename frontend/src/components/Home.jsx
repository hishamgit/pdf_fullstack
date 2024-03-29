import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Document, Page } from "react-pdf";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REACT_APP_API_URL } from "../../config.js";
import { loginContext } from "../../loginContext.jsx";
import { saveAs } from "file-saver";

const Home = () => {
  const [pdf, setPdf] = useState(null); // State for uploaded PDF file
  const [numPages, setNumPages] = useState(null); // State for number of pages in PDF
  const [selectedPages, setSelectedPages] = useState([]); // State for selected pages for pdf making
  const [user, setUser] = useState("");
  const navigate = useNavigate(); // Hook for navigation
  const { loginStatus, setLoginStatus } = useContext(loginContext); // Using login context for authentication status
  const axiosInstance = axios.create({ baseURL: REACT_APP_API_URL }); // Creating axios instance with base URL
  const [cookies, setCookie, removeCookie] = useCookies([]); // Using cookies for authentication
  const [pdfs, setPdfs] = useState([]); // State for previous PDFs

  const Logout = () => {
    // Function to log out
    removeCookie("token", { path: "/", domain: "localhost" }); // Removing cookie
    setLoginStatus(false);
    navigate("/login"); // Navigating to login page
    console.log("cookie removal");
  };

  useEffect(() => {
    //Effect to authenticate users using JWT token from cookies
    const verifyCookie = async () => {
      const { data } = await axiosInstance.post(
        "",
        {},
        { withCredentials: true } // for sending cookies
      );
      // console.log(data);
      const { status, user, message } = data;
      if (status) {
        //after successful authentication
        setUser(user);
        setLoginStatus(true);
        toast(`Hello ${user.username}`);
      } else {
        //if authentication fails
        removeCookie("token", { path: "/" });
        setLoginStatus(false);
        navigate("/login");
        toast(user, { position: "top-left" });
        console.log("cookie not ok", message);
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  // Function to fetch previous PDFs of a user
  const fetchPdfs = () => {
    axiosInstance
      .get(`/oldPdfs?userId=${user._id}`)
      .then((res) => {
        setPdfs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to handle button click to process PDF
  const handleButtonClick = () => {
    //if PDF file is selected
    if (pdf) {
      // Prepare the data to be sent in the request body,Creating form data and appending selectedPages,userId
      const formData = new FormData();
      formData.append("selectedPages", JSON.stringify(selectedPages));
      formData.append("userId", user._id);
      formData.append("pdf", pdf);

      // Send a POST request using Axios
      axiosInstance
        .post("/uploadPdf", formData)
        .then((response) => {
          // Handle success response
          console.log("Upload successful:", response);

          if (response.status) {
            //getting processed pdf saved in server
            axiosInstance
              .get("/getPdf", {
                responseType: "arraybuffer",
                headers: { Accept: "application/pdf" },
              })
              .then((response) => {
                const blob = new Blob([response.data], {
                  // Creating a Blob object from the response data
                  type: "application/pdf",
                });
                saveAs(blob, `${pdf.name}_processed.pdf`); // Triggering file download with the processed PDF
              });
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error occurred:", error);
        });
    } else {
      console.log("please choose pdf");
    }
  };

  //Function to set number of pages after successful loading of PDF
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Function to handle checkbox change for page selection
  const handleCheckboxChange = (page_no) => {
    // Checking if the page is already selected
    const status = selectedPages.includes(page_no);
    // if  page is already selected remove,else include
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

  //to handle successful pdf input
  const handleSuccess = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdf(file);
    }
  };

  // JSX rendering
  return (
    <div className="p-4 bg-gray-800 h-full">
      <div className="flex justify-end items-center gap-x-4">
        {/* Logout button */}
        <button
          className="bg-red-900 hover:bg-red-800 px-4 py-1 rounded-lg"
          onClick={Logout}
        >
          Sign out
        </button>
        <span></span>
      </div>
      {/* Welcome message */}
      <div className="flex justify-center pb-16">
        <h1 className="text-4xl font-medium text-green-400 my-4 ">
          Welcome {user.username}
        </h1>
      </div>
      {/* File upload section */}
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
        {/* PDF preview section */}
        {pdf && (
          <div className="w-full overflow-hidden">
            <div className="flex justify-center">
              <h2 className="text-2xl font-medium text-white">Preview</h2>
            </div>
            <br />
            <p className="text-white">Choose pages</p>

            {/* PDF viewer */}
            <div className="max-h-screen overflow-y-scroll overflow-x-hidden">
              <div className="max-w-full overflow-x-scroll overflow-y-hidden">
                <Document
                  file={pdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="w-full bg-gray-800"
                >
                  {/* Rendering each page of the PDF and checkboxes */}
                  {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="mb-4">
                      <Page pageNumber={index + 1} />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`page_${index + 1}`}
                          checked={selectedPages.includes(index + 1)}
                          onChange={() => handleCheckboxChange(index + 1)}
                        />
                        <label
                          className="text-white ml-2 cursor-pointer"
                          htmlFor={`page_${index + 1}`}
                        >
                          Page {index + 1}
                        </label>
                      </div>
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center pt-16">
        {/* Button to process PDF */}
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleButtonClick}
        >
          Make pdf
        </button>
      </div>
      <div className="flex justify-center pt-16">
        {/* Button to fetch previous PDFs */}
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={fetchPdfs}
        >
          previos pdfs
        </button>
      </div>
      <div>
        {/* List of previous PDFs */}
        <ul>
          {pdfs.map((pdf, index) => (
            <li key={index}>
              <a
                href={`http://localhost:3333/api/download/${pdf.filename}?userId=${user._id}`}
                download
                className="text-white"
              >
                {pdf.filename}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
