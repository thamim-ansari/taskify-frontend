import React from "react";

// Create a context for user profile data
// The default context value contains `userProfileData` and `setUserProfileData`
// `userProfileData` is an object to hold user data
// `setUserProfileData` is a function placeholder to update the user profile data
const UserContext = React.createContext({
  userProfileData: {}, // Default user profile data (initially an empty object)
  setUserProfileData: () => {}, // Default function to update user profile data (no operation)
});

export default UserContext;
