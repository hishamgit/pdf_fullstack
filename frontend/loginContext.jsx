import { createContext, useState } from "react";
export const loginContext = createContext();

// Functional component to manage login status
function LoginStatus({ children }) {
  // Using useState hook to manage loginStatus state
  const [loginStatus, setLoginStatus] = useState(false);
  return (
    // Returning the context provider with the value of loginStatus and setLoginStatus,Rendering child components
    <loginContext.Provider value={{ loginStatus, setLoginStatus }}>
      {children}
    </loginContext.Provider>
  );
}
export default LoginStatus;
