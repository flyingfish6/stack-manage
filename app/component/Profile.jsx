"use client";
import React, { useEffect } from "react";
import image from "../../public/profile.webp";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

import { useSessionContext } from "../provider/SessionContext";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const Profile = () => {
  const { data: session, status } = useSession();

  const userData = useSessionContext();
  const getSession = () => {};
  useEffect(() => {
    if (userData) {
    }
  }, [userData]);
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };
  return (
    <div className=" h-full">
      <Popover className="h-full">
        <PopoverTrigger asChild className="flex">
          <div className="flex items-center justify-between gap-4 cursor-pointer h-full w-full">
            <Image
              src={image}
              width={40}
              height={40}
              alt="image"
              className="flex rounded-full "
            />
            <div className="text-white">
              <div className="text-[15px]">{userData?.user?.name}</div>
              <div className="text-sm">管理员</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[100%]" asChild>
          <Button className="bg-white hover:bg-white" onClick={handleSignOut}>
            退出登录
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Profile;
