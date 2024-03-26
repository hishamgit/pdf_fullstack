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
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const { loginStatus, setLoginStatus } = useContext(loginContext);
  const axiosInstance = axios.create({ baseURL: REACT_APP_API_URL });
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const Logout = () => {
    removeCookie("token", { path: "/", domain: "localhost" }); //since httpOnly:false
    setLoginStatus(false);
    navigate("/login");
    console.log("cookie removal");
  };

  useEffect(() => {
    const verifyCookie = async () => {
      const { data } = await axiosInstance.post(
        "",
        {},
        { withCredentials: true }
      );
      // console.log(data);
      const { status, user, message } = data;
      if (status) {
        setUser(user);
        setLoginStatus(true);
        toast(`Hello ${user.username}`);
      } else {
        removeCookie("token", { path: "/" });
        setLoginStatus(false);
        navigate("/login");
        toast(user, { position: "top-left" });
        console.log("cookie not ok", message);
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const handleButtonClick = () => {
    if (pdf) {
      // Prepare the data to be sent in the request body
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
            axiosInstance
              .get("/getPdf", {
                responseType: "arraybuffer",
                headers: { Accept: "application/pdf" },
              })
              .then((response) => {
                const blob = new Blob([response.data], {
                  type: "application/pdf",
                });
                saveAs(blob, `${pdf.name}_processed.pdf`);
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
      setPdf(file);
    }
  };
  return (
    <div className="p-4 bg-gray-800 h-full">
      <div className="flex justify-end items-center gap-x-4">
        <button
          className="bg-red-900 hover:bg-red-800 px-4 py-1 rounded-lg"
          onClick={Logout}
        >
          Sign out
        </button>
        <span></span>
      </div>
      <div className="flex justify-center pb-16">
        <h1 className="text-4xl font-medium text-green-400 my-4 ">
          Welcome {user.username}
        </h1>
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

            <div className="max-h-screen overflow-y-scroll overflow-hidden">
              <Document
                file={pdf}
                onLoadSuccess={onDocumentLoadSuccess}
                className="w-full bg-gray-800"
              >
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
        )}
      </div>
      <div className="flex justify-center pt-16">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleButtonClick}
        >
          Make pdf
        </button>
      </div>
    </div>
  );
};

export default Home;
