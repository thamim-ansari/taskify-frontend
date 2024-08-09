import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";

import Header from "../../components/Header";
import SideNavBar from "../../components/SideNavBar";
import ProjectList from "../../components/ProjectList";
import Loader from "../../components/Loader";
import FailureResponse from "../../components/FailureResponse";
import EmptyResponse from "../../components/EmptyResponse";

import UserContext from "../../context/UserContext";

import "./index.css";

const projectsApiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  in_progress: "IN_PROGRESS",
  failure: "FAILURE",
};

function Home() {
  // Context for user profile data
  const { userProfileData } = useContext(UserContext);
  const [projectApiStatus, setProjectApiStatus] = useState(
    projectsApiStatusConstants.initial
  );
  const userId = userProfileData?.user_id || ""; // User ID for creating new projects

  // State for new project form data
  const [newProjectData, setNewProjectData] = useState({
    projectTitle: "",
    projectDescription: "",
  });

  // State for search input
  const [searchInput, setSearchInput] = useState("");

  // State for managing validation errors in new project form
  const [newProjectErrors, setNewProjectErrors] = useState({
    isValidProjectTitle: false,
    showProjectTitleError: false,
    projectTitleErrorMsg: "",
    isValidProjectDescription: false,
    showProjectDescriptionError: false,
    projectDescriptionErrorMsg: "",
    newProjectErrorMessage: "",
    showNewProjectErrorMessage: false,
  });

  // State for showing or hiding the create project modal
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false);

  // State for storing fetched project data
  const [projectData, setProjectData] = useState([]);

  // Get JWT token from cookies
  const jwtToken = Cookies.get("jwt_token");

  // Handle closing of the create project modal
  const handleCreateProjectPopupClose = () => {
    setNewProjectErrors({
      isValidProjectTitle: false,
      showProjectTitleError: false,
      projectTitleErrorMsg: "",
      isValidProjectDescription: false,
      showProjectDescriptionError: false,
      projectDescriptionErrorMsg: "",
      newProjectErrorMessage: "",
      showNewProjectErrorMessage: false,
    });
    setShowCreateProjectPopup(false);
  };

  // Handle showing of the create project modal
  const handleCreateProjectPopupShow = () => setShowCreateProjectPopup(true);

  // Validate project title
  const onValidateProjectTitle = (titleInput) => {
    if (titleInput === "") {
      setNewProjectErrors((prev) => ({
        ...prev,
        isValidProjectTitle: false,
        showProjectTitleError: true,
        projectTitleErrorMsg: "Title should not be empty",
      }));
    } else if (titleInput.length > 100) {
      setNewProjectErrors((prev) => ({
        ...prev,
        isValidProjectTitle: false,
        showProjectTitleError: true,
        projectTitleErrorMsg: "Title should not be more than 100 characters",
      }));
    } else {
      setNewProjectErrors((prev) => ({
        ...prev,
        isValidProjectTitle: true,
        showProjectTitleError: false,
      }));
    }
  };

  // Handle changes in project title input field
  const onChangeProjectTitle = (event) => {
    const titleInput = event.target.value;
    setNewProjectData((prev) => ({ ...prev, projectTitle: titleInput }));
    onValidateProjectTitle(titleInput);
  };

  // Validate project description
  const onValidateProjectDescription = (descriptionInput) => {
    if (descriptionInput === "") {
      setNewProjectErrors((prev) => ({
        ...prev,
        isValidProjectDescription: false,
        showProjectDescriptionError: true,
        projectDescriptionErrorMsg: "Description should not be empty",
      }));
    } else {
      setNewProjectErrors((prev) => ({
        ...prev,
        isValidProjectDescription: true,
        showProjectDescriptionError: false,
      }));
    }
  };

  // Handle changes in project description input field
  const onChangeProjectDescription = (event) => {
    const descriptionInput = event.target.value;
    setNewProjectData((prev) => ({
      ...prev,
      projectDescription: descriptionInput,
    }));
    onValidateProjectDescription(descriptionInput);
  };

  // Handle changes in search input field
  const onChangeSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  // Validate new project data
  const onValidateNewProjectData = () => {
    onValidateProjectTitle(newProjectData.projectTitle);
    onValidateProjectDescription(newProjectData.projectDescription);
  };

  // Handle form submission for creating a new project
  const onSubmitNewProject = async (event) => {
    event.preventDefault();

    onValidateNewProjectData();

    const isValidNewProjectData =
      newProjectErrors.isValidProjectTitle &&
      newProjectErrors.isValidProjectDescription;
    if (isValidNewProjectData) {
      const newProjectDetails = { ...newProjectData, userId: userId };
      const createProjectApiUrl =
        "https://taskify-backend-1-ymjh.onrender.com/projects/";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newProjectDetails),
      };
      try {
        const addProjectResponse = await fetch(createProjectApiUrl, options);
        const addProjectResponseData = await addProjectResponse.json();
        if (addProjectResponse.ok) {
          // Reset form and show success message
          setNewProjectData((prev) => ({
            ...prev,
            projectTitle: "",
            projectDescription: "",
          }));
          setNewProjectErrors((prev) => ({
            newProjectErrorMessage: addProjectResponseData.message,
            showNewProjectErrorMessage: true,
          }));
          await getProjectData(); // Refresh project data
        } else {
          // Show error message
          setNewProjectErrors((prev) => ({
            newProjectErrorMessage: addProjectResponseData.message,
            showNewProjectErrorMessage: true,
          }));
        }
      } catch (error) {
        console.error("Error creating project:", error);
        setNewProjectErrors((prev) => ({
          newProjectErrorMessage:
            "An error occurred while creating the project.",
          showNewProjectErrorMessage: true,
        }));
      }
    }
  };

  // Fetch project data
  const getProjectData = async () => {
    setProjectApiStatus(projectsApiStatusConstants.in_progress);
    const getProjectsApiUrl = `https://taskify-backend-1-ymjh.onrender.com/projects/?search_q=${searchInput}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const getProjectsApiResponse = await fetch(getProjectsApiUrl, options);

      if (getProjectsApiResponse.ok) {
        const getProjectsApiResponseData = await getProjectsApiResponse.json();
        const formattedProjectData = getProjectsApiResponseData.map(
          (eachProject) => ({
            projectId: eachProject.project_id,
            projectTitle: eachProject.project_title,
            projectDescription: eachProject.project_description,
            userId: eachProject.user_id,
            firstName: eachProject.first_name,
            lastName: eachProject.last_name,
            role: eachProject.role,
            emailId: eachProject.email_id,
          })
        );
        setProjectData(formattedProjectData);
        setProjectApiStatus(projectsApiStatusConstants.success);
      } else {
        setProjectApiStatus(projectsApiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      setProjectApiStatus(projectsApiStatusConstants.failure);
    }
  };

  // Fetch project data when search input changes
  useEffect(() => {
    getProjectData();
  }, [searchInput]);

  // Render the create project modal
  const renderCreateProjectPopup = () => (
    <Modal show={showCreateProjectPopup} onHide={handleCreateProjectPopupClose}>
      <Modal.Header closeButton className="project-form-border">
        <Modal.Title>New project</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-left">
        <Form onSubmit={onSubmitNewProject}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="new-project-label">
              Project Title:
            </Form.Label>
            <Form.Control
              type="text"
              value={newProjectData.projectTitle}
              placeholder="Enter your Project name"
              autoFocus
              onChange={onChangeProjectTitle}
            />
            {newProjectErrors.showProjectTitleError && (
              <p className="text-danger">
                {newProjectErrors.projectTitleErrorMsg}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="new-project-label">
              Project Description:
            </Form.Label>
            <Form.Control
              as="textarea"
              value={newProjectData.projectDescription}
              rows={3}
              placeholder="Enter project description"
              onChange={onChangeProjectDescription}
            />
            {newProjectErrors.showProjectDescriptionError && (
              <p className="text-danger">
                {newProjectErrors.projectDescriptionErrorMsg}
              </p>
            )}
          </Form.Group>
          {newProjectErrors.showNewProjectErrorMessage && (
            <p className="text-danger text-center">
              {newProjectErrors.newProjectErrorMessage}
            </p>
          )}
          <Modal.Footer className="project-form-border">
            <Button variant="secondary" onClick={handleCreateProjectPopupClose}>
              Exit
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );

  // Retry fetching project data on failure
  const onClickRetry = () => {
    getProjectData();
  };

  // Render the create project button and modal
  const renderCreateProjectContainer = () => (
    <>
      <Button
        variant="primary"
        onClick={handleCreateProjectPopupShow}
        className="create-project-button"
      >
        Create Project
      </Button>
      {renderCreateProjectPopup()}
    </>
  );

  // Render the list of projects or an empty response if no projects are found
  const renderProjectListContainer = () => {
    if (projectData.length > 0) {
      return (
        <div>
          <ul className="project-list">
            {projectData.map((eachProject) => (
              <ProjectList
                key={eachProject.projectId}
                projectDetails={eachProject}
                getProjectData={getProjectData}
              />
            ))}
          </ul>
        </div>
      );
    } else {
      return <EmptyResponse />;
    }
  };

  // Render the view based on API status
  const renderProjectsView = () => {
    switch (projectApiStatus) {
      case projectsApiStatusConstants.success:
        return renderProjectListContainer();
      case projectsApiStatusConstants.in_progress:
        return <Loader />;
      case projectsApiStatusConstants.failure:
        return <FailureResponse onClickRetry={onClickRetry} />;
    }
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <SideNavBar />
        <div className="project-main-container">
          <div className="project-create-and-filter-container">
            {renderCreateProjectContainer()}
            <input
              type="text"
              placeholder="search"
              value={searchInput}
              className="project-search-container"
              onChange={onChangeSearchInput}
            />
          </div>
          {renderProjectsView()}
        </div>
      </div>
    </>
  );
}

export default Home;
