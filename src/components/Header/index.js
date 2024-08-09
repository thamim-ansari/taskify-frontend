import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdError } from "react-icons/md";
import { ThreeCircles } from "react-loader-spinner";
import Cookies from "js-cookie";

import UserContext from "../../context/UserContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const navbarProfileApiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  in_progress: "IN_PROGRESS",
  failure: "FAILURE",
};

function Header() {
  const { userProfileData, setUserProfileData } = useContext(UserContext);
  const [navprofileApiStatus, setNavProfileApiStatus] = useState(
    navbarProfileApiStatusConstants.initial
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const firstName = userProfileData?.first_name || "";
  const lastName = userProfileData?.last_name || "";
  const role = userProfileData?.role || "";
  const profileName = (firstName[0] || "") + (lastName[0] || "");

  const getUserProfileData = async () => {
    setNavProfileApiStatus(navbarProfileApiStatusConstants.in_progress);
    const jwtToken = Cookies.get("jwt_token");
    const profileApiUrl =
      "https://taskify-backend-1-ymjh.onrender.com/profile/";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const profileDataResponse = await fetch(profileApiUrl, options);
      const profileResponseData = await profileDataResponse.json();
      if (profileDataResponse.ok) {
        setUserProfileData(profileResponseData);
        setNavProfileApiStatus(navbarProfileApiStatusConstants.success);
      } else {
        setNavProfileApiStatus(navbarProfileApiStatusConstants.failure);
        console.log("invalid jwt token");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserProfileData();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
    setShowLogoutModal(false);
  };

  const handleLogoutModalShow = () => setShowLogoutModal(true);
  const handleLogoutModalClose = () => setShowLogoutModal(false);

  const renderLogoContainer = () => (
    <Link to="/" className="link-remove-style">
      <div className="logo-container">
        <IoMdCheckmarkCircleOutline className="header-logo-icon" />
        <h1 className="nav-heading-text">Taskify</h1>
      </div>
    </Link>
  );

  const renderProfileContainer = () => (
    <>
      <Dropdown className="profile-dropdown">
        <Dropdown.Toggle
          className="profile-button"
          id="dropdown-custom-components"
        >
          {profileName.toUpperCase()}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.ItemText className="profile-name">
            {firstName + " " + lastName}
          </Dropdown.ItemText>
          <Dropdown.Item>
            Role:
            <span className="profile-role-text">{role}</span>
          </Dropdown.Item>
          <Dropdown.Item>
            <button
              type="button"
              onClick={handleLogoutModalShow}
              className="nav-logout-button"
            >
              Logout
            </button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Modal show={showLogoutModal} onHide={handleLogoutModalClose} centered>
        <Modal.Header
          closeButton
          className="logout-confirmation-header-container"
        >
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center logout-confirmation-description">
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center algin-items-center logout-confirmation-footer-container">
          <Button
            className="logout-cancel-button"
            onClick={handleLogoutModalClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="logout-confirm-button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

  const navProfileLoaderContainer = () => (
    <div>
      <ThreeCircles
        visible={true}
        height="45"
        width="45"
        color="#0c66e4"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );

  const renderNavProfileFailureView = () => (
    <div className="profile-button nav-profile-failure-container">
      <MdError color="#fc100d" size={25} />
    </div>
  );

  const renderProfileView = () => {
    switch (navprofileApiStatus) {
      case navbarProfileApiStatusConstants.success:
        return renderProfileContainer();
      case navbarProfileApiStatusConstants.in_progress:
        return navProfileLoaderContainer();
      case navbarProfileApiStatusConstants.failure:
        return renderNavProfileFailureView();
      default:
        return null;
    }
  };

  return (
    <header className="nav-container">
      <nav className="nav-responsive-container">
        {renderLogoContainer()}
        {renderProfileView()}
      </nav>
    </header>
  );
}

export default Header;
