import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Header from "./Header";
// import Footer from "./Footer";

const UserSignup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { email, password, name } = inputValue;
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left"
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right"
    });

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      handleError("Please enter a valid email address");
      isValid = false;
    }

    if (!name.trim()) {
      handleError("Please enter a username");
      isValid = false;
    }

    if (password.length < 6) {
      handleError("Password must be at least 6 characters");
      isValid = false;
    }

 return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/`,
        {
          ...inputValue
        },
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
      console.error("Signup error:", error);
      handleError("An error occurred during signup");
    }

    setInputValue({
      email: "",
      password: "",
      name: "",
    });
  };

  return (
    <>
      {/* <Header /> */}
      <div className="form_container">
        <h2>Register Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
            {errors.email && (
              <span className="error" style={{ color: "red" }}>
                {errors.email}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={handleOnChange}
            />
            {errors.name && (
              <span className="error" style={{ color: "red" }}>
                {errors.name}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            {errors.password && (
              <span className="error" style={{ color: "red" }}>
                {errors.password}
              </span>
            )}
          </div>
          <button type="submit">Submit</button>
          <span>
            Already have an account? <Link to={"/"}>Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default UserSignup;
