"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { Grid } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import Profile from "./Profile";
const Navbar = () => {
  const pathname = usePathname();
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
    <div className="container bg-primary border-b border-primary">
      <div className=" flex items-center justify-between  ">
        <div className="flex">
          <Link
            className={`hover:bg-blue-2 px-10 py-4 text-white ${
              pathname === "/stock/stockin/stockinform" ? "bg-blue-2" : ""
            }`}
            href="/stock/stockin/stockinform"
          >
            入库操作
          </Link>
          <Link
            className={`hover:bg-blue-2 px-10 py-4 text-white ${
              pathname === "/stock/stockout/stockoutform" ? "bg-blue-2" : ""
            }`}
            href="/stock/stockout/stockoutform"
          >
            出库操作
          </Link>
        </div>
        <div className="flex">
          <Link
            className={`hover:bg-blue-2 px-10 py-4 text-white ${
              pathname === "/stock/stockall" ? "bg-blue-2" : ""
            }`}
            href="/stock/stockall"
          >
            总库存查询
          </Link>
          <Link
            className={`hover:bg-blue-2 px-10 py-4 text-white ${
              pathname === "/stock/stockin" ? "bg-blue-2" : ""
            }`}
            href="/stock/stockin"
          >
            入库记录
          </Link>
          <Link
            className={`hover:bg-blue-2 px-10 mr-2 py-4 text-white ${
              pathname === "/stock/stockout" ? "bg-blue-2" : ""
            }`}
            href="/stock/stockout"
          >
            出库记录
          </Link>
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
