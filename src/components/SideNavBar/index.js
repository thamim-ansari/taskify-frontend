import { Link, useLocation } from "react-router-dom";

import "./index.css";

function SideNavBar() {
  // Get the current pathname from the location object
  const location = useLocation();

  return (
    <div className="side-nav-container">
      <ul className="side-nav-links">
        {/* Link to the home page */}
        <Link to="/" className="side-nav-bar-link">
          <li className={location.pathname === "/" ? "active-page" : ""}>
            Projects
          </li>
        </Link>
        {/* Link to the tasks page */}
        <Link to="/tasks" className="side-nav-bar-link">
          <li className={location.pathname === "/tasks" ? "active-page" : ""}>
            Tasks
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default SideNavBar;
