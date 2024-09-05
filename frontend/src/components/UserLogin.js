import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
    // Clear the corresponding error when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-right",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
      theme:'dark'

    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // If the form is not valid, return early
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/auth`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );

      const { success, message, role } = data;
      localStorage.setItem("userInfo", JSON.stringify(data));

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          if (role === "admin") {
            // Redirect to the admin panel
            navigate("/admin");
          } 
          else if(role==="user"){
          navigate("/chat")
          }
        
          else  {
            // Redirect to the normal user landing page
            navigate("/login");
          }
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("Invalid email or password."); // Display an error message if there's an exception
    }

    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Implement the logout logic, e.g., clear user session, reset login state
    setIsLoggedIn(false);
    navigate("/"); // Redirect to the login page or another route after logout
  };

  return (
    <>
  
      <div className="form_container">
        {/* {isLoggedIn ? (
          <Profile handleLogout={handleLogout} />
        ) : ( */}
          <>
            <h2>Login Account</h2>
            <form onSubmit={handleSubmit} id="form">
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
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={handleOnChange}
                    onClick={togglePasswordVisibility}
                    
                  />
                  <span onClick={togglePasswordVisibility}>
                    {/* {showPassword ? <FiEyeOff /> : <FiEye />} */}
                  </span>
                </div>
                {errors.password && (
                  <span className="error" style={{ color: "red" }}>
                    {errors.password}
                  </span>
                )}
              </div>
              <button type="submit">Submit</button>
              <span>
                Already don't have an account? <a href="/signup">Register Now</a>
              </span>
            </form>
            <ToastContainer />
          </>
        {/* )} */}
      </div>
    </>
  );
};

export default Login;

