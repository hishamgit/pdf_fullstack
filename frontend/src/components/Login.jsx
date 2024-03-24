import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Zoom, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginContext } from "../../loginContext";
import { REACT_APP_API_URL } from "../../config";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { loginStatus } = useContext(loginContext);
  const [remember,setRemember]=useState(false);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: ""
  });
  const axiosInstance=axios.create({baseURL:REACT_APP_API_URL})

  useEffect(() => {
    if (loginStatus) {
      navigate("/");
    }
  }, [loginStatus]);

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value }); //[name]
  };
  const handleSuccess = (msg) => {
    toast.success(msg, {
      transition: Zoom,
    });
  };
  const handleError = (msg) => {
    toast.error(msg, {
      transition: Flip,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        "/login",
        { ...inputValue,remember },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="p-4 bg-gray-800 h-full">
      <div className="flex justify-center">
        <h1 className="text-3xl my-4 text-green-400">Login</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col border-2 border-sky-800 rounded-xl p-4 mx-auto w-[600px]">
          <div className="my-4">
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
            <input
              id="default-checkbox"
              type="checkbox"
              name="remember"
              value={remember}
              onChange={(e)=>{
                  setRemember(e.target.checked)
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
            Login
          </button>
          <span className="flex justify-center text-white">
            Don't have an account..?{" "}
            <Link className="text-green-400" to={"/signup"}>
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
