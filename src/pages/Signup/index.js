import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

function Signup(props) {
  // State for storing new user details
  const [newUserDetails, setNewUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  // State for storing validation errors and messages
  const [errorDetails, setErrorDetails] = useState({
    isValidFirstName: false,
    showFistNameErrorMsg: false,
    isValidLastName: false,
    showLastNameErrorMsg: false,
    isValidRole: false,
    showRoleErrorMsg: false,
    isValidEmail: false,
    showEmailErrorMsg: false,
    isValidPassword: false,
    showPasswordErrorMsg: false,
    SignupErrorMsg: "",
    isSignupErrorMsgVisible: false,
  });

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Signup banner image URL
  const signupBannerImage =
    "https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1722951894~exp=1722955494~hmac=d08b8df2de0592df4568daa5de5dc1e863b78a124a4f06a82d7ddd409b11c2ab&w=740";

  // Validate first name
  const validateFirstName = (firstname) => {
    if (firstname.length > 2) {
      setErrorDetails((prev) => ({
        ...prev,
        showFistNameErrorMsg: false,
        isValidFirstName: true,
      }));
    } else {
      setErrorDetails((prev) => ({
        ...prev,
        showFistNameErrorMsg: true,
        isValidFirstName: false,
      }));
    }
  };

  // Handle changes to the first name input
  const onChangeFirstName = (event) => {
    const firstNameInput = event.target.value.trim();
    setNewUserDetails((prev) => ({
      ...prev,
      firstName: firstNameInput,
    }));
    validateFirstName(firstNameInput);
  };

  // Validate last name
  const validateLastName = (lastname) => {
    if (lastname.length > 2) {
      setErrorDetails((prev) => ({
        ...prev,
        showLastNameErrorMsg: false,
        isValidLastName: true,
      }));
    } else {
      setErrorDetails((prev) => ({
        ...prev,
        showLastNameErrorMsg: true,
        isValidLastName: false,
      }));
    }
  };

  // Handle changes to the last name input
  const onChangeLastName = (event) => {
    const lastNameInput = event.target.value.trim();
    setNewUserDetails((prev) => ({
      ...prev,
      lastName: lastNameInput,
    }));
    validateLastName(lastNameInput);
  };

  // Validate email
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 8 && emailPattern.test(email)) {
      setErrorDetails((prev) => ({
        ...prev,
        showEmailErrorMsg: false,
        isValidEmail: true,
      }));
    } else {
      setErrorDetails((prev) => ({
        ...prev,
        showEmailErrorMsg: true,
        isValidEmail: false,
      }));
    }
  };

  // Validate role selection
  const validateRole = (roleInput) => {
    if (roleInput !== "") {
      setErrorDetails((prev) => ({
        ...prev,
        isValidRole: true,
        showRoleErrorMsg: false,
      }));
    } else {
      setErrorDetails((prev) => ({
        ...prev,
        isValidRole: false,
        showRoleErrorMsg: true,
      }));
    }
  };

  // Handle changes to the role input
  const onChangeRole = (event) => {
    const roleInput = event.target.value;
    setNewUserDetails((prev) => ({ ...prev, role: roleInput }));
    validateRole(roleInput);
  };

  // Handle changes to the email input
  const onChangeEmail = (event) => {
    const emailInput = event.target.value.trim();
    setNewUserDetails((prev) => ({
      ...prev,
      email: emailInput,
    }));
    validateEmail(emailInput);
  };

  // Validate password
  const validatePassword = (password) => {
    if (password.length > 5) {
      setErrorDetails((prev) => ({
        ...prev,
        showPasswordErrorMsg: false,
        isValidPassword: true,
      }));
    } else {
      setErrorDetails((prev) => ({
        ...prev,
        showPasswordErrorMsg: true,
        isValidPassword: false,
      }));
    }
  };

  // Handle changes to the password input
  const onChangePassword = (event) => {
    const passwordInput = event.target.value.trim();
    setNewUserDetails((prev) => ({
      ...prev,
      password: passwordInput,
    }));
    validatePassword(passwordInput);
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Validate all form fields
  const onSignupFormValidation = () => {
    validateFirstName(newUserDetails.firstName);
    validateLastName(newUserDetails.lastName);
    validateEmail(newUserDetails.email);
    validatePassword(newUserDetails.password);
    validateRole(newUserDetails.role);
  };

  // Handle form submission
  const onSignUpForm = async (event) => {
    event.preventDefault();
    onSignupFormValidation();
    const isValidUserData =
      errorDetails.isValidFirstName &&
      errorDetails.isValidLastName &&
      errorDetails.isValidEmail &&
      errorDetails.isValidRole &&
      errorDetails.isValidPassword;
    if (isValidUserData) {
      const signupApiUrl =
        "https://taskify-backend-1-ymjh.onrender.com/signup/";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserDetails),
      };
      try {
        const signUpApiResponse = await fetch(signupApiUrl, options);
        if (signUpApiResponse.status === 200) {
          navigate("/login"); // Redirect to login on successful signup
        } else {
          const signUpApiResponseData = await signUpApiResponse.json();
          setErrorDetails((prev) => ({
            ...prev,
            SignupErrorMsg: signUpApiResponseData.message,
            isSignupErrorMsgVisible: true,
          }));
        }
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  };

  // Render signup banner image
  const renderBannerContainer = () => (
    <div className="signup-banner-img-container">
      <img
        src={signupBannerImage}
        alt="signup form img"
        className="singup-form-poster-image"
      />
    </div>
  );

  // Render first name input field
  const renderFirstNameContainer = () => (
    <div className="signup-input-container">
      <label htmlFor="first-name">First Name:</label>
      <input
        type="text"
        id="first-name"
        value={newUserDetails.firstName}
        className="signup-form-input"
        onChange={onChangeFirstName}
      />
      {errorDetails.showFistNameErrorMsg && (
        <p className="signup-error-msg">* First name cannot be empty</p>
      )}
    </div>
  );

  // Render last name input field
  const renderLastNameContainer = () => (
    <div className="signup-input-container">
      <label htmlFor="last-name">Last Name:</label>
      <input
        type="text"
        id="last-name"
        value={newUserDetails.lastName}
        className="signup-form-input"
        onChange={onChangeLastName}
      />
      {errorDetails.showLastNameErrorMsg && (
        <p className="signup-error-msg">* Last name cannot be empty</p>
      )}
    </div>
  );

  // Render role selection dropdown
  const renderRoleContainer = () => (
    <div className="signup-input-container" onChange={onChangeRole}>
      <label className="loginRole">Role</label>
      <select
        id="loginRole"
        className="signup-form-input"
        onChange={onChangeRole}
        value={newUserDetails.role}
      >
        <option value="" disabled>
          Select a role
        </option>
        <option value="Admin">Admin</option>
        <option value="Member">Member</option>
      </select>
      {errorDetails.showRoleErrorMsg && (
        <p className="signup-error-msg">* Please select a role</p>
      )}
    </div>
  );

  // Render email input field
  const renderEmailContainer = () => (
    <div className="signup-input-container">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={newUserDetails.email}
        className="signup-form-input"
        onChange={onChangeEmail}
      />
      {errorDetails.showEmailErrorMsg && (
        <p className="signup-error-msg">* Enter a Valid email</p>
      )}
    </div>
  );

  // Render password input field with toggle visibility
  const renderPasswordContainer = () => (
    <div className="signup-input-container">
      <label htmlFor="password">Password:</label>
      <div className="password-input-container">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          password={newUserDetails.password}
          onChange={onChangePassword}
        />
        <button type="button" onClick={toggleShowPassword}>
          {showPassword ? (
            <FaEye color="#a3a2a2" size={16} />
          ) : (
            <FaEyeSlash color="#a3a2a2" size={16} />
          )}
        </button>
      </div>
      {errorDetails.showPasswordErrorMsg && (
        <p className="signup-error-msg">
          "Password should be more than 5 characters"
        </p>
      )}
    </div>
  );

  // Render the form container
  const renderFormContainer = () => (
    <form className="signup-form" onSubmit={onSignUpForm}>
      <h1 className="signup-heading">Sign up</h1>
      <div className="signup-input-responsive-container">
        {renderFirstNameContainer()}
        {renderLastNameContainer()}
      </div>
      {renderRoleContainer()}
      {renderEmailContainer()}
      {renderPasswordContainer()}
      {errorDetails.isSignupErrorMsgVisible && (
        <p className="signup-error-msg">{errorDetails.SignupErrorMsg}</p>
      )}
      <button type="submit" className="signup-btn">
        Sign up
      </button>
      <p className="signup-description">
        Already have an account?{" "}
        <Link to="/login" className="login-link">
          Login
        </Link>
      </p>
    </form>
  );

  // Redirect to home if user is already authenticated
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  // Render the signup page layout
  return (
    <div className="signup-form-container">
      <div className="signup-form-responsive-container">
        <div className="signup-img-and-form-container">
          {renderBannerContainer()}
          {renderFormContainer()}
        </div>
      </div>
    </div>
  );
}

export default Signup;
