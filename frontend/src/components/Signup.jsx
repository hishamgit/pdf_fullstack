import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { REACT_APP_API_URL } from "../../config.js";
import { useNavigate, Link } from "react-router-dom";
import { toast, Zoom, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginContext } from "../../loginContext.jsx";

const Signup = () => {
  const navigate = useNavigate(); // Using useNavigate hook for navigation
  const { loginStatus } = useContext(loginContext); // Using useContext hook to get login status
  const [remember, setRemember] = useState(false);
  const [inputValue, setInputValue] = useState({
    // State for input values
    email: "",
    username: "",
    password: "",
  });
  const axiosInstance = axios.create({ baseURL: REACT_APP_API_URL }); // Creating axios instance with API URL

  useEffect(() => {
    // Redirecting to home page if already logged in
    if (loginStatus) {
      navigate("/");
    }
  }, [loginStatus]);

  const { email, username, password } = inputValue;
  // Handling changes in input fields
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  // Handling success toast
  const handleSuccess = (msg) => {
    toast.success(msg, { transition: Zoom });
  };
  // Handling error toast
  const handleError = (msg) => {
    toast.error(msg, {
      transition: Flip,
    });
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        "/signup",
        { ...inputValue, remember },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          // Redirecting to home page after signup
          navigate("/");
        }, 3000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    // Resetting input values after submission
    setInputValue({
      ...inputValue,
      email: "",
      username: "",
      password: "",
    });
  };

  return (
    <div className="p-4 bg-gray-800 h-full">
      {/* Main container */}
      <div className="flex justify-center">
        <h1 className="text-3xl my-4 text-green-400">Signup</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {" "}
        {/* Form */}
        <div className="flex flex-col justify-center border-2 border-sky-800 rounded-xl p-4 mx-auto w-2/3 md:w-[600px]">
          <div className="my-4">
            {" "}
            {/* Email input */}
            <label htmlFor="email" className="text-xl mr-4 text-gray-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <div className="my-4">
            {" "}
            {/* Username input */}
            <label className="text-xl mr-4 text-gray-500">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleOnChange}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <div className="my-4">
            {" "}
            {/* Password input */}
            <label className="text-xl mr-4 text-gray-500">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleOnChange}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <div className="flex items-center mb-4">
            {" "}
            {/* Remember me checkbox */}
            <input
              id="default-checkbox"
              type="checkbox"
              name="remember"
              value={remember}
              onChange={(e) => {
                setRemember(e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me..
            </label>
          </div>
          <button className="p-2 bg-sky-300" type="submit">
            {" "}
            {/* Submit button */}
            Sign up
          </button>
          <span className="flex justify-center text-white">
            Already have an account..?{" "}
            <Link className="text-green-400" to={"/login"}>
              {" "}
              {/* Link to login page */}
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
