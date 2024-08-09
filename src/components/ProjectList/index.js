import { useState, useContext } from "react";
import { Dropdown, Button, Modal, Form } from "react-bootstrap";
import Cookies from "js-cookie";

import UserContext from "../../context/UserContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function ProjectList(params) {
  // Get user profile data from context
  const { userProfileData } = useContext(UserContext);
  const { projectDetails, getProjectData } = params;

  // Destructure project details from props
  const {
    projectId,
    projectTitle,
    projectDescription,
    userId,
    firstName,
    lastName,
    role,
    emailId,
  } = projectDetails;

  // State to manage updated project data and errors
  const [updatedProjectData, setUpdatedProjectData] = useState({
    updatedProjectTitle: projectTitle,
    updatedProjectDescription: projectDescription,
  });

  const [updatedProjectErrors, setUpdatedProjectErrors] = useState({
    isValidProjectTitle: false,
    showProjectTitleError: false,
    projectTitleErrorMsg: "",
    isValidProjectDescription: false,
    showProjectDescriptionError: false,
    projectDescriptionErrorMsg: "",
    updatedProjectErrorMessage: "",
    showUpdatedProjectErrorMessage: false,
  });

  // State to manage modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get JWT token from cookies
  const jwtToken = Cookies.get("jwt_token");

  // Create a profile name from first and last names
  const profileName = (firstName[0] || "") + (lastName[0] || "");

  // Check if the current user has permission to edit or delete
  const canEditOrDelete =
    userProfileData.user_id === userId || userProfileData.role === "Admin";

  // Show the edit modal
  const handleShowEditModal = () => setShowEditModal(true);

  // Close the edit modal and reset form data
  const handleCloseEditModal = () => {
    setUpdatedProjectData({
      updatedProjectTitle: projectTitle,
      updatedProjectDescription: projectDescription,
    });
    setUpdatedProjectErrors({
      isValidProjectTitle: false,
      showProjectTitleError: false,
      projectTitleErrorMsg: "",
      isValidProjectDescription: false,
      showProjectDescriptionError: false,
      projectDescriptionErrorMsg: "",
      updatedProjectErrorMessage: "",
      showUpdatedProjectErrorMessage: false,
    });
    setShowEditModal(false);
  };

  // Show the delete modal
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  // Close the delete modal
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Handle project deletion
  const handleDelete = async () => {
    const deleteProjectApiUrl = `https://taskify-backend-1-ymjh.onrender.com/projects/${projectId}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const deleteProjectApiResponse = await fetch(
        deleteProjectApiUrl,
        options
      );
      if (deleteProjectApiResponse.ok) {
        console.log(deleteProjectApiResponse);
        handleCloseDeleteModal();
        getProjectData(); // Refresh project data after deletion
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Validate project title
  const onValidateProjectTitle = (titleInput) => {
    if (titleInput === "") {
      setUpdatedProjectErrors((prev) => ({
        ...prev,
        isValidProjectTitle: false,
        showProjectTitleError: true,
        projectTitleErrorMsg: "Title should not be empty",
      }));
    } else if (titleInput.length > 100) {
      setUpdatedProjectErrors((prev) => ({
        ...prev,
        isValidProjectTitle: false,
        showProjectTitleError: true,
        projectTitleErrorMsg: "Title should not be more than 100 characters",
      }));
    } else {
      setUpdatedProjectErrors((prev) => ({
        ...prev,
        isValidProjectTitle: true,
        showProjectTitleError: false,
      }));
    }
  };

  // Handle changes in project title input
  const onChangeProjectTitle = (event) => {
    const titleInput = event.target.value;
    setUpdatedProjectData((prev) => ({
      ...prev,
      updatedProjectTitle: titleInput,
    }));
    onValidateProjectTitle(titleInput);
  };

  // Validate project description
  const onValidateProjectDescription = (descriptionInput) => {
    if (descriptionInput === "") {
      setUpdatedProjectErrors((prev) => ({
        ...prev,
        isValidProjectDescription: false,
        showProjectDescriptionError: true,
        projectDescriptionErrorMsg: "Description should not be empty",
      }));
    } else {
      setUpdatedProjectErrors((prev) => ({
        ...prev,
        isValidProjectDescription: true,
        showProjectDescriptionError: false,
      }));
    }
  };

  // Handle changes in project description input
  const onChangeProjectDescription = (event) => {
    const descriptionInput = event.target.value;
    setUpdatedProjectData((prev) => ({
      ...prev,
      updatedProjectDescription: descriptionInput,
    }));
    onValidateProjectDescription(descriptionInput);
  };

  // Validate all updated project data
  const onValidateUpdatedProjectData = () => {
    onValidateProjectTitle(updatedProjectData.updatedProjectTitle);
    onValidateProjectDescription(updatedProjectData.updatedProjectDescription);
  };

  // Handle form submission to update project
  const onSubmitUpdateData = async (event) => {
    event.preventDefault();
    onValidateUpdatedProjectData();

    const validUpdatedData =
      updatedProjectErrors.isValidProjectTitle &&
      updatedProjectErrors.isValidProjectDescription;

    if (validUpdatedData) {
      const updateProjectApiUrl = `https://taskify-backend-1-ymjh.onrender.com/projects/${projectId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProjectData),
      };
      try {
        const updateProjectApiResponse = await fetch(
          updateProjectApiUrl,
          options
        );
        const updatedProjectApiResponseData =
          await updateProjectApiResponse.json();
        if (updateProjectApiResponse.ok) {
          setUpdatedProjectErrors({
            updatedProjectErrorMessage: updatedProjectApiResponseData.message,
            showUpdatedProjectErrorMessage: true,
          });
          handleCloseEditModal();
          getProjectData(); // Refresh project data after update
        } else {
          setUpdatedProjectErrors({
            updatedProjectErrorMessage: updatedProjectApiResponseData.message,
            showUpdatedProjectErrorMessage: true,
          });
        }
      } catch (error) {
        console.error("Error updating project:", error);
        setUpdatedProjectErrors({
          updatedProjectErrorMessage:
            "An error occurred while updating the project.",
          showUpdatedProjectErrorMessage: true,
        });
      }
    }
  };

  return (
    <>
      <li className="project-item">
        <div className="project-items-heading-container">
          <p className="project-heading">{projectTitle}</p>
          <Dropdown className="profile-dropdown">
            <Dropdown.Toggle
              className="profile-button project-profile-button"
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
              <Dropdown.ItemText className="profile-name">
                {emailId}
              </Dropdown.ItemText>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <p className="project-description">{projectDescription}</p>
        <div className="project-item-button-container">
          <Button
            variant="danger"
            onClick={handleShowDeleteModal}
            disabled={!canEditOrDelete}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            className="project-edit-button"
            onClick={handleShowEditModal}
            disabled={!canEditOrDelete}
          >
            Edit
          </Button>
        </div>
      </li>
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitUpdateData}>
            <Form.Group className="mb-3" controlId="formProjectTitle">
              <Form.Label className="project-edit-label-heading">
                Project Title:
              </Form.Label>
              <Form.Control
                type="text"
                value={updatedProjectData.updatedProjectTitle}
                onChange={onChangeProjectTitle}
                isInvalid={updatedProjectErrors.showProjectTitleError}
              />
              <Form.Control.Feedback type="invalid">
                {updatedProjectErrors.projectTitleErrorMsg}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProjectDescription">
              <Form.Label className="project-edit-label-heading">
                Project Description:
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedProjectData.updatedProjectDescription}
                onChange={onChangeProjectDescription}
                isInvalid={updatedProjectErrors.showProjectDescriptionError}
              />
              <Form.Control.Feedback type="invalid">
                {updatedProjectErrors.projectDescriptionErrorMsg}
              </Form.Control.Feedback>
            </Form.Group>
            {updatedProjectErrors.showUpdatedProjectErrorMessage && (
              <p>{updatedProjectErrors.updatedProjectErrorMessage}</p>
            )}
            <Modal.Footer className="project-footer-container">
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProjectList;
