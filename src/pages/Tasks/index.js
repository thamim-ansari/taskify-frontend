import { useState, useEffect, useContext } from "react";
import { Dropdown, Button, Modal, Form } from "react-bootstrap";
import Cookies from "js-cookie";

import Header from "../../components/Header";
import SideNavBar from "../../components/SideNavBar";
import TaskList from "../../components/TaskList";
import EmptyResponse from "../../components/EmptyResponse";

import UserContext from "../../context/UserContext";

import "./index.css";
import Loader from "../../components/Loader";
import FailureResponse from "../../components/FailureResponse";

// Constants for task list API status
const taskListApiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  in_progress: "IN_PROGRESS",
  failure: "FAILURE",
};

function Tasks() {
  // Context to get user profile data
  const { userProfileData } = useContext(UserContext);
  const userId = userProfileData?.user_id || ""; // User ID from context

  // State to handle new task form data
  const [newTaskData, setNewTaskData] = useState({
    taskTitle: "",
    taskDescription: "",
  });

  // State to handle task API status
  const [tasksApiStatus, setTaskApiStatus] = useState(
    taskListApiStatusConstants.initial
  );

  // State for selected project ID and status
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // State to hold existing projects data
  const [existingProjectData, setExitingProjectData] = useState([]);

  // State to handle search input
  const [searchInput, setSearchInput] = useState("");

  // State to handle form validation errors
  const [newTaskErrors, setNewTaskErrors] = useState({
    isValidTaskTitle: false,
    showTaskTitleError: false,
    taskTitleErrorMsg: "",
    isValidTaskDescription: false,
    showTaskDescriptionError: false,
    taskDescriptionErrorMsg: "",
    isValidProjectId: false,
    showProjectIdError: false,
    isValidStatus: false,
    showStatusError: false,
  });

  // State to handle modal visibility for creating a new task
  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);

  // State to hold task data fetched from API
  const [taskData, setTaskData] = useState([]);

  // Options for task status dropdown
  const statusOptions = ["To Do", "In Progress", "Done"];

  // State to handle filter status value
  const [filterStatusValue, setFilterStatusValue] = useState("");

  // Function to handle filter status selection
  const selectFilterStatus = (eventKey) => {
    setFilterStatusValue(eventKey);
  };

  // Retrieve JWT token from cookies
  const jwtToken = Cookies.get("jwt_token");

  // Function to close the create task popup and reset form
  const handleCreateTaskPopupClose = () => {
    setNewTaskData({
      taskTitle: "",
      taskDescription: "",
    });
    setNewTaskErrors({
      isValidTaskTitle: false,
      showTaskTitleError: false,
      taskTitleErrorMsg: "",
      isValidTaskDescription: false,
      showTaskDescriptionError: false,
      taskDescriptionErrorMsg: "",
    });
    setShowCreateTaskPopup(false);
    setSelectedProjectId("");
    setSelectedStatus("");
  };

  // Function to show the create task popup
  const handleCreateTaskPopupShow = () => setShowCreateTaskPopup(true);

  // Validation functions
  const onValidateProjectId = (projectInput) => {
    if (projectInput === "") {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidProjectId: false,
        showProjectIdError: true,
      }));
    } else {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidProjectId: true,
        showProjectIdError: false,
      }));
    }
  };

  const onChangeProjectId = (projectIdInput) => {
    setSelectedProjectId(projectIdInput);
    onValidateProjectId(projectIdInput);
  };

  const onValidateTaskStatus = (status) => {
    if (status === "") {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidStatus: false,
        showStatusError: true,
      }));
    } else {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidStatus: true,
        showStatusError: false,
      }));
    }
  };

  const onChangeTaskStatus = (status) => {
    setSelectedStatus(status);
    onValidateTaskStatus(status);
  };

  const onValidateTaskTitle = (titleInput) => {
    if (titleInput === "") {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidTaskTitle: false,
        showTaskTitleError: true,
        taskTitleErrorMsg: "Title should not be empty",
      }));
    } else if (titleInput.length > 100) {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidTaskTitle: false,
        showTaskTitleError: true,
        taskTitleErrorMsg: "Title should not be more than 100 characters",
      }));
    } else {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidTaskTitle: true,
        showTaskTitleError: false,
      }));
    }
  };

  const onChangeTaskTitle = (event) => {
    const titleInput = event.target.value;
    setNewTaskData((prev) => ({ ...prev, taskTitle: titleInput }));
    onValidateTaskTitle(titleInput);
  };

  const onValidateTaskDescription = (descriptionInput) => {
    if (descriptionInput === "") {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidTaskDescription: false,
        showTaskDescriptionError: true,
        taskDescriptionErrorMsg: "Description should not be empty",
      }));
    } else {
      setNewTaskErrors((prev) => ({
        ...prev,
        isValidTaskDescription: true,
        showTaskDescriptionError: false,
      }));
    }
  };

  const onChangeTaskDescription = (event) => {
    const descriptionInput = event.target.value;
    setNewTaskData((prev) => ({
      ...prev,
      taskDescription: descriptionInput,
    }));
    onValidateTaskDescription(descriptionInput);
  };

  const onChangeSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  // Function to fetch existing projects data
  const getExistingProjectData = async () => {
    const exitingProjectApiUrl =
      "https://taskify-backend-1-ymjh.onrender.com/projects/";
    const options = {
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const existingProjectResponse = await fetch(
        exitingProjectApiUrl,
        options
      );
      if (existingProjectResponse.ok) {
        const existingProjectResponseData =
          await existingProjectResponse.json();
        const formattedExistingProjectData = existingProjectResponseData.map(
          (eachProject) => ({
            emailId: eachProject.email_id,
            firstName: eachProject.first_name,
            lastName: eachProject.last_name,
            projectDescription: eachProject.project_description,
            projectId: eachProject.project_id,
            projectTitle: eachProject.project_title,
            role: eachProject.role,
            ProjectUserId: eachProject.user_id,
          })
        );
        setExitingProjectData(formattedExistingProjectData);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Fetch existing project data on component mount
  useEffect(() => {
    getExistingProjectData();
    // eslint-disable-next-line
  }, []);

  // Validate new task data before submission
  const onValidateNewProjectData = () => {
    onValidateTaskTitle(newTaskData.taskTitle);
    onValidateTaskDescription(newTaskData.taskDescription);
    onValidateProjectId(selectedProjectId);
    onValidateTaskStatus(selectedStatus);
  };

  // Function to submit new task data
  const onSubmitNewProject = async (event) => {
    event.preventDefault();

    onValidateNewProjectData();

    const isValidNewProjectData =
      newTaskErrors.isValidTaskTitle &&
      newTaskErrors.isValidTaskDescription &&
      newTaskErrors.isValidProjectId &&
      newTaskErrors.isValidStatus;

    if (isValidNewProjectData) {
      const validNewTaskData = {
        ...newTaskData,
        projectId: selectedProjectId,
        taskStatus: selectedStatus,
        taskUserId: userId,
      };
      const createTaskApiUrl =
        "https://taskify-backend-1-ymjh.onrender.com/tasks/";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(validNewTaskData),
      };
      try {
        const createTaskApiResponse = await fetch(createTaskApiUrl, options);
        const createTaskApiResponseData = await createTaskApiResponse.json();
        if (createTaskApiResponse.status === 201) {
          console.log(createTaskApiResponseData.message);
          handleCreateTaskPopupClose();
          getTasksData(); // Refresh task list
        } else {
          console.log(createTaskApiResponseData.message);
        }
      } catch (error) {
        console.error("Error creating project:", error);
      }
    }
  };

  // Function to fetch tasks data based on search and filter
  const getTasksData = async () => {
    setTaskApiStatus(taskListApiStatusConstants.in_progress);
    const getTasksApiUrl = `https://taskify-backend-1-ymjh.onrender.com/tasks/?search_q=${searchInput}&status=${filterStatusValue}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const getTasksApiResponse = await fetch(getTasksApiUrl, options);

      if (getTasksApiResponse.ok) {
        const getTasksApiResponseData = await getTasksApiResponse.json();
        const formattedTasksData = getTasksApiResponseData.map((eachTask) => ({
          taskId: eachTask.task_id,
          taskTitle: eachTask.task_title,
          taskDescription: eachTask.task_description,
          taskStatus: eachTask.task_status,
          userId: eachTask.user_id,
          firstName: eachTask.first_name,
          lastName: eachTask.last_name,
          role: eachTask.role,
          emailId: eachTask.email_id,
          projectId: eachTask.project_id,
          projectTitle: eachTask.project_title,
        }));
        setTaskData(formattedTasksData);
        setTaskApiStatus(taskListApiStatusConstants.success);
      } else {
        setTaskApiStatus(taskListApiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Fetch tasks data on search input or filter status change
  useEffect(() => {
    getTasksData();
    // eslint-disable-next-line
  }, [searchInput, filterStatusValue]);

  // Retry fetching tasks data on failure
  const onClickRetry = () => {
    getTasksData();
  };

  // Render function for the create task popup modal
  const renderCreateProjectPopup = () => (
    <Modal show={showCreateTaskPopup} onHide={handleCreateTaskPopupClose}>
      <Modal.Header closeButton className="project-form-border">
        <Modal.Title>New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-left">
        <Form onSubmit={onSubmitNewProject}>
          <Form.Group className="mb-3" controlId="formBasicSelect">
            <Form.Label className="new-project-label">
              Select Project:
            </Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedProjectId || "Select a category"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {existingProjectData.map((eachProject) => (
                  <Dropdown.Item
                    key={eachProject.projectId}
                    onClick={() => onChangeProjectId(eachProject.projectId)}
                  >
                    {eachProject.projectTitle}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          {newTaskErrors.showProjectIdError && (
            <p className="text-danger">Select a project</p>
          )}
          <Form.Group className="mb-3" controlId="formBasicSelect">
            <Form.Label className="new-project-label">
              Select Status:
            </Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedStatus || "Select a status"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {statusOptions.map((status) => (
                  <Dropdown.Item
                    key={status}
                    onClick={() => onChangeTaskStatus(status)}
                  >
                    {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          {newTaskErrors.showStatusError && (
            <p className="text-danger">Select a status</p>
          )}
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label className="new-project-label">Task Title:</Form.Label>
            <Form.Control
              type="text"
              value={newTaskData.taskTitle}
              placeholder="Enter your Project name"
              autoFocus
              onChange={onChangeTaskTitle}
            />
            {newTaskErrors.showTaskTitleError && (
              <p className="text-danger">{newTaskErrors.taskTitleErrorMsg}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label className="new-project-label">
              Task Description:
            </Form.Label>
            <Form.Control
              as="textarea"
              value={newTaskData.taskDescription}
              rows={3}
              placeholder="Enter project description"
              onChange={onChangeTaskDescription}
            />
            {newTaskErrors.showTaskDescriptionError && (
              <p className="text-danger">
                {newTaskErrors.taskDescriptionErrorMsg}
              </p>
            )}
          </Form.Group>
          <Modal.Footer className="project-form-border">
            <Button variant="secondary" onClick={handleCreateTaskPopupClose}>
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

  // Render function for create task button and popup
  const renderCreateProjectContainer = () => (
    <>
      <Button
        variant="primary"
        onClick={handleCreateTaskPopupShow}
        className="create-project-button"
      >
        Create Tasks
      </Button>
      {renderCreateProjectPopup()}
    </>
  );

  // Render function for status filter dropdown
  const renderStatusFilter = () => (
    <Dropdown onSelect={selectFilterStatus}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {filterStatusValue}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="">All</Dropdown.Item>
        <Dropdown.Item eventKey="To Do">To Do</Dropdown.Item>
        <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
        <Dropdown.Item eventKey="Done">Done</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  // Render function for task list container
  const renderTaskListContainer = () => {
    if (taskData.length > 0) {
      return (
        <div>
          <ul className="project-list">
            {taskData.map((eachTask) => (
              <TaskList
                key={eachTask.taskId}
                taskDetails={eachTask}
                getTasksData={getTasksData}
              />
            ))}
          </ul>
        </div>
      );
    } else {
      return <EmptyResponse onClickRetry={onClickRetry} />;
    }
  };

  // Render function for task list view based on API status
  const renderTaskListView = () => {
    switch (tasksApiStatus) {
      case taskListApiStatusConstants.success:
        return renderTaskListContainer();
      case taskListApiStatusConstants.in_progress:
        return <Loader />;
      case taskListApiStatusConstants.failure:
        return <FailureResponse />;
      default:
        return null;
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
            <div className="status-filter-container">
              <p>Status Filter:</p>
              {renderStatusFilter()}
            </div>
          </div>
          {renderTaskListView()}
        </div>
      </div>
    </>
  );
}

export default Tasks;
