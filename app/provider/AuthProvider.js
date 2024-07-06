// components/AuthProvider.js
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (session) {
    }
    // console.log(session);
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
  }

  return <>{session && children}</>;
};

export default AuthProvider;
