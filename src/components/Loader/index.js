import { ThreeDots } from "react-loader-spinner";

import "./index.css";

// Functional component to display a loading spinner
function Loader() {
  return (
    <div className="loader-container">
      <ThreeDots
        visible={true} // Indicates that the loader is visible
        height="70" // Height of the loader
        width="70" // Width of the loader
        color="#0c66e4" // Color of the loader
        radius="9" // Radius of the loader's dots
        ariaLabel="three-dots-loading" // Aria label for accessibility
        wrapperStyle={{}} // Style for the wrapper (empty object for default)
        wrapperClass="" // CSS class for the wrapper (empty string for default)
      />
    </div>
  );
}

export default Loader;
