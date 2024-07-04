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
  useEffect(() => {
    if (userData) {
      console.log(userData);
    }
  }, [userData]);
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger
          asChild
          className="flex absolute sm:right-2 md:right-4 sm:mt-2 md:mt-4"
        >
          <div className="flex items-center justify-center gap-4  hover:bg-blue-1 hover:shadow-md  p-4">
            <Image
              src={image}
              width={50}
              height={50}
              alt="image"
              className="flex rounded-full "
            />
            <div className="text-white">
              <div>{session.user.name}</div>
              <div className="text-sm">管理员</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[100%]" asChild>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="hover:outline-none active:outline-none focus:outline-none"
          >
            退出登录
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Profile;
