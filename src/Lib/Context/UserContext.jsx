import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
export const UserContext = createContext(); // Use UserContext directly

export function UserContextProvider({ children }) {
  const [token, setToken] = useState(Cookies.get('token'));


  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
}
