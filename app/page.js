"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "./provider/SessionContext";

import { Button } from "@/components/ui/button";
const HomePage = () => {
  const userData = useSessionContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log("first", userData);
      console.log(session);
    }
    // console.log(session);
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
  }

  if (!session) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div className="bg-blue-2 h-full">
      {/* <Profile /> */}
      <div className=" flex items-center justify-center h-full">
        {/* <Link
          href="/stock/stockout"
          className="text-white hover:bg-white tracking-[1rem] hover:text-primary px-10 py-2 rounded-sm"
        >
          出库
        </Link> */}
        <div className="space-y-5">
          <Button
            onClick={() => router.push("/stock/stockout")}
            className="bg-white w-full tracking-[1rem] hover:bg-white hover:opacity-75  text-primary px-10 py-2 rounded-sm"
          >
            出库
          </Button>
          <Button
            onClick={() => router.push("/stock/stockin")}
            className="bg-white w-full tracking-[1rem] hover:bg-white hover:opacity-75  text-primary px-10 py-2 rounded-sm"
          >
            入库
          </Button>
          <Button
            onClick={() => router.push("/stock/stockall")}
            className="bg-white w-full tracking-[1rem] hover:bg-white hover:opacity-75  text-primary px-10 py-2 rounded-sm"
          >
            库存
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
