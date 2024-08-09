import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./index.css";

function Login() {
  // State for storing login data (email and password)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for managing visibility of error messages
  const [loginErrorData, setLoginErrorData] = useState({
    isEmailIdErrorVisible: false,
    isPasswordErrorVisible: false,
  });

  // State for toggling password visibility
  const [ispPasswordVisible, setPasswordVisibility] = useState(false);

  const navigate = useNavigate();

  // Error messages for email and password
  const userNameErrorMsg =
    loginData.email.length > 0 ? "Invalid email" : "email can't be empty";

  const PasswordErrorMsg =
    loginData.password.length > 0
      ? "Invalid password"
      : "Username can't be empty";

  // URL for the login banner image
  const loginBannerImage =
    "https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?t=st=1722953277~exp=1722956877~hmac=7cacacf5f674a753175e67c503129dab6d5a043e353b5365f670fd64622620d6&w=740";

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisibility((prev) => !prev);
  };

  // Validate email input
  const onValidateEmailId = (emailInput) => {
    if (emailInput.length > 0) {
      setLoginErrorData((prev) => ({
        ...prev,
        isEmailIdErrorVisible: false,
      }));
    } else {
      setLoginErrorData((prev) => ({
        ...prev,
        isEmailIdErrorVisible: true,
      }));
    }
  };

  // Handle changes to the email input field
  const onChangeEmailId = (event) => {
    const emailIdInput = event.target.value.trim();
    setLoginData((prev) => ({
      ...prev,
      email: emailIdInput,
    }));
    onValidateEmailId(emailIdInput);
  };

  // Validate password input
  const onValidatePassword = (password) => {
    if (password.length > 0) {
      setLoginErrorData((prev) => ({
        ...prev,
        isPasswordErrorVisible: false,
      }));
    } else {
      setLoginErrorData((prev) => ({
        ...prev,
        isPasswordErrorVisible: true,
      }));
    }
  };

  // Handle changes to the password input field
  const onChangePassword = (event) => {
    const passwordInput = event.target.value.trim();
    setLoginData((prev) => ({
      ...prev,
      password: passwordInput,
    }));
    onValidatePassword(passwordInput);
  };

  // Handle successful login and set JWT token in cookies
  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    navigate("/", { replace: true }); // Redirect to home page
  };

  // Handle failed login attempt and show appropriate error messages
  const onSubmitFailure = (loginApiResponseData) => {
    if (loginApiResponseData.message === "Invalid email") {
      setLoginErrorData((prev) => ({
        ...prev,
        isEmailIdErrorVisible: true,
      }));
    } else if (loginApiResponseData.message === "Invalid password") {
      setLoginErrorData((prev) => ({
        ...prev,
        isPasswordErrorVisible: true,
      }));
    } else {
      setLoginErrorData((prev) => ({
        ...prev,
        isEmailIdErrorVisible: false,
        isPasswordErrorVisible: false,
      }));
    }
  };

  // Handle form submission
  const onSubmitLoginForm = async (event) => {
    event.preventDefault();
    if (loginData.email === "") {
      onValidateEmailId(loginData.email);
    }
    if (loginData.password === "") {
      onValidatePassword(loginData.password);
    }
    if (loginData.email !== "" && loginData.password !== "") {
      try {
        const loginApiUrl =
          "https://taskify-backend-1-ymjh.onrender.com/login/";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        };
        const loginApiResponse = await fetch(loginApiUrl, options);
        const loginApiResponseData = await loginApiResponse.json();
        if (loginApiResponse.status === 200) {
          onSubmitSuccess(loginApiResponseData.jwtToken);
        } else {
          onSubmitFailure(loginApiResponseData);
        }
      } catch (error) {
        console.error("login failed:", error);
      }
    }
  };

  // Render the login banner image
  const renderBannerContainer = () => (
    <div className="login-banner-image-container">
      <img
        src={loginBannerImage}
        alt="login banner img"
        className="login-banner-img"
      />
    </div>
  );

  // Render the email input field
  const renderUserNameContainer = () => (
    <div className="login-input-container">
      <label htmlFor="loginEmail">email</label>
      <input
        type="text"
        value={loginData.email}
        placeholder="Enter your email"
        id="loginEmail"
        onChange={onChangeEmailId}
      />
      {loginErrorData.isEmailIdErrorVisible && (
        <p className="login-error-msg">{userNameErrorMsg}</p>
      )}
    </div>
  );

  // Render the password input field with visibility toggle
  const renderPasswordContainer = () => (
    <div className="login-input-container">
      <label htmlFor="loginPassword">password</label>
      <div className="login-password-container">
        <input
          type={ispPasswordVisible ? "text" : "password"}
          value={loginData.password}
          placeholder="Enter your password"
          id="loginPassword"
          onChange={onChangePassword}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {ispPasswordVisible ? (
            <FaEye color="#a3a2a2" size={16} />
          ) : (
            <FaEyeSlash color="#a3a2a2" size={16} />
          )}
        </button>
      </div>
      {loginErrorData.isPasswordErrorVisible && (
        <p className="login-error-msg">{PasswordErrorMsg}</p>
      )}
    </div>
  );

  // Render the login form
  const renderFormContainer = () => (
    <form onSubmit={onSubmitLoginForm} className="login-form">
      <h1 className="login-heading">Login</h1>
      {renderUserNameContainer()}
      {renderPasswordContainer()}
      <button type="submit" className="login-btn">
        Login
      </button>
      <p className="login-description">
        Don't Have An Account?{" "}
        <Link to="/signup" className="signup-link">
          Signup
        </Link>
      </p>
    </form>
  );

  // Redirect to home if user is already authenticated
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  // Render the login page layout
  return (
    <div className="login-bg-container">
      <div className="login-responsive-container">
        <div className="login-form-and-image-container">
          {renderBannerContainer()}
          {renderFormContainer()}
        </div>
      </div>
    </div>
  );
}

export default Login;
