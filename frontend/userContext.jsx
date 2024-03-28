import { createContext, useState } from "react";
export const userContext = createContext();

function userStatus({ children }) {

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
export default userStatus;
