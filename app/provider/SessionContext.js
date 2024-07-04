"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const SessionContext = createContext();

export const SessionContextProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [currentSession, setcurrentSesion] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      setcurrentSesion(session);
    }
  }, [session, status]);
  return (
    <SessionContext.Provider value={currentSession}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
