# Project Management App

## Overview

This is a project management application built with React that includes user authentication, project and task management, and role-based permissions. The app utilizes React Router for navigation, React Bootstrap for styling, and various other libraries to handle state management and authentication.

## Features

- **User Authentication**:

  - Users can log in or sign up.
  - Protected routes ensure that only authenticated users can access certain pages.

- **Header Component**:

  - Displays user profile details and an application logo.
  - Includes a dropdown for user settings, including a logout button with a confirmation popup.

- **Project Management**:

  - **Create Project**: Popup form to create a new project.
  - **Project List**: Displays a list of projects with options to edit or delete, each with its own confirmation popup.
  - **Search**: Allows users to search for projects.

- **Task Management**:

  - **Create Task**: Create tasks related to projects.
  - **Task List**: View, edit, and delete tasks, with stages including To Do, In Progress, and Done.

- **Role-Based Permissions**:

  - **Member**: Can only edit or delete their own tasks and projects.
  - **Admin**: Can edit or delete any tasks and projects.

## Technologies Used

- **React**: For building the user interface.
- **React Router DOM**: For navigation and routing.
- **React Bootstrap**: For styling and UI components.
- **React Loader Spinner**: For handling loading states.
- **React Icons**: For iconography.
- **js-cookie**: For managing JWT tokens.
- **React Context API**: For global state management.
- **React Hooks**: For managing state and side effects.

## Setup

1. **Clone the repository**:

```
git clone https://github.com/thamim-ansari/taskify-frontend.git
cd taskify-frontend
```

2. **Install dependencies**:

```
npm install
```

3. **Start the application**:

```
npm start
```

4. Visit the application:
   Open your browser and go to http://localhost:3000 to see the app in action.

## Components

- **React**: For building the user interface.
- **React Router DOM**: For navigation and routing.
- **React Bootstrap**: For styling and UI components.
- **React Loader Spinner**: For handling loading states.
- **React Icons**: For iconography.
- **js-cookie**: For managing JWT tokens.
- **React Context API**: For global state management.
- **React Hooks**: For managing state and side effects.

## Role Permissions

- **Member**: Limited to managing their own tasks and projects.
- **Admin**: Full access to manage all tasks and projects.
