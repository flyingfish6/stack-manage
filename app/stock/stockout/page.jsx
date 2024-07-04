"use client";
import React from "react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import * as XLSX from "xlsx";
const StockOut = () => {
  const data = [
    ["", "Ford", "Volvo", "Toyota", "Honda"],
    ["2016", 10, 11, 12, 13],
    ["2017", 20, 11, 14, 13],
    ["2018", 30, 15, 12, 13],
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };
  return (
    <div className="container">
      <button onClick={exportToExcel}>Export to Excel</button>
      <HotTable
        data={data}
        colHeaders={true}
        rowHeaders={true}
        width="900"
        height="300"
        licenseKey="non-commercial-and-evaluation" // 请替换为您的许可证密钥
        columnSorting={true}
      />
    </div>
  );
};

export default StockOut;
