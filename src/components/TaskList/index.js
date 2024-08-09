import { useState, useContext } from "react";
import { Dropdown, Button, Modal, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import UserContext from "../../context/UserContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function TaskList({ taskDetails, getTasksData }) {
  // Destructure task details from props
  const {
    taskId,
    taskTitle,
    taskDescription,
    taskStatus,
    userId,
    firstName,
    lastName,
    role,
    emailId,
    projectTitle,
  } = taskDetails;

  // State for managing updated task data
  const [updatedTaskData, setUpdatedTaskData] = useState({
    updatedTaskTitle: taskTitle,
    updatedTaskDescription: taskDescription,
  });

  // State for managing validation errors
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

  // State for managing modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // JWT token for authentication
  const jwtToken = Cookies.get("jwt_token");

  // Profile initials for dropdown
  const profileName = (firstName[0] || "") + (lastName[0] || "");

  // User context to determine edit/delete permissions
  const { userProfileData } = useContext(UserContext);
  const canEditOrDelete =
    userProfileData.user_id === userId || userProfileData.role === "Admin";

  // Task status styling
  const todoClass =
    taskStatus === "To Do"
      ? "todo-style"
      : taskStatus === "In Progress"
      ? "in-progress-style"
      : "success-style";

  // Show edit modal
  const handleShowEditModal = () => setShowEditModal(true);

  // Close edit modal and reset errors and data
  const handleCloseEditModal = () => {
    setUpdatedTaskData({
      updatedTaskTitle: taskTitle,
      updatedTaskDescription: taskDescription,
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

  // Show delete modal
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  // Close delete modal
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // State for task status value
  const [taskStatusValue, setTaskStatus] = useState(taskDetails.taskStatus);

  // Handle task deletion
  const handleDelete = async () => {
    const deleteTaskApiUrl = `https://taskify-backend-1-ymjh.onrender.com/tasks/${taskId}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const deleteTaskApiResponse = await fetch(deleteTaskApiUrl, options);
      if (deleteTaskApiResponse.ok) {
        handleCloseDeleteModal();
        getTasksData(); // Refresh tasks data
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Validate task title input
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

  // Handle change in task title input
  const onChangeProjectTitle = (event) => {
    const titleInput = event.target.value;
    setUpdatedTaskData((prev) => ({
      ...prev,
      updatedTaskTitle: titleInput,
    }));
    onValidateProjectTitle(titleInput);
  };

  // Validate task description input
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

  // Handle change in task description input
  const onChangeProjectDescription = (event) => {
    const descriptionInput = event.target.value;
    setUpdatedTaskData((prev) => ({
      ...prev,
      updatedTaskDescription: descriptionInput,
    }));
    onValidateProjectDescription(descriptionInput);
  };

  // Validate updated task data before submission
  const onValidateUpdatedProjectData = () => {
    onValidateProjectTitle(updatedTaskData.updatedTaskTitle);
    onValidateProjectDescription(updatedTaskData.updatedTaskDescription);
  };

  // Handle task update submission
  const onSubmitUpdateData = async (event) => {
    event.preventDefault();
    onValidateUpdatedProjectData();

    const validUpdatedData =
      updatedProjectErrors.isValidProjectTitle &&
      updatedProjectErrors.isValidProjectDescription;

    if (validUpdatedData) {
      const validUpdatedTask = {
        ...updatedTaskData,
        taskStatus: taskStatusValue,
      };
      const updateProjectApiUrl = `https://taskify-backend-1-ymjh.onrender.com/tasks/${taskId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(validUpdatedTask),
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
          getTasksData(); // Refresh tasks data
        } else {
          setUpdatedProjectErrors({
            updatedProjectErrorMessage: updatedProjectApiResponseData.message,
            showUpdatedProjectErrorMessage: true,
          });
        }
      } catch (error) {
        console.error("Error updating task:", error);
        setUpdatedProjectErrors({
          updatedProjectErrorMessage:
            "An error occurred while updating the task.",
          showUpdatedProjectErrorMessage: true,
        });
      }
    }
  };

  return (
    <>
      <li className="project-item">
        <div className="project-items-heading-container">
          <p className="task-project-title">{projectTitle}</p>

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
        <div className="task-title-status-container">
          <p className="task-title">{taskTitle}</p>
          <span className={todoClass}>{taskStatus}</span>
        </div>
        <p className="task-description">{taskDescription}</p>
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
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitUpdateData}>
            <Form.Group className="mb-3" controlId="formProjectTitle">
              <Form.Label className="edit-task-label-heading">
                Task Title:
              </Form.Label>
              <Form.Control
                type="text"
                value={updatedTaskData.updatedTaskTitle}
                onChange={onChangeProjectTitle}
                isInvalid={updatedProjectErrors.showProjectTitleError}
              />
              <Form.Control.Feedback type="invalid">
                {updatedProjectErrors.projectTitleErrorMsg}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTaskStatus">
              <Form.Label className="edit-task-label-heading">
                Task Status:
              </Form.Label>
              <Form.Control
                as="select"
                value={taskStatusValue}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProjectDescription">
              <Form.Label className="edit-task-label-heading">
                Task Description:
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedTaskData.updatedTaskDescription}
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
            <Modal.Footer className="edit-task-footer-container">
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

export default TaskList;
