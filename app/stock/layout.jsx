import React from "react";
import Navbar from "../component/Navbar";
import "toastr/build/toastr.min.css";
import AuthProvider from "../provider/AuthProvider";
const StockLayout = ({ children }) => {
  return (
    <main className="h-full">
      <div className="h-full w-full   flex flex-col">
        <AuthProvider>
          {/* <SideBar /> */}
          <Navbar />

          {children}
        </AuthProvider>
      </div>
    </main>
  );
};

export default StockLayout;
