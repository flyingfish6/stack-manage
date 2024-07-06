// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Handsontable from "handsontable";
// import { HotTable } from "@handsontable/react";
// import "handsontable/dist/handsontable.full.css";
// import * as XLSX from "xlsx";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { TbError404 } from "react-icons/tb";
// import GlobalApi from "@/server/GlobalApi";
// import { Select } from "@radix-ui/themes";
// import { Input } from "@/components/ui/input";
// const wareHouseList = [
//   { value: "qianfang", label: "前纺" },
//   { value: "si71", label: "471" },
//   { value: "ziluotong", label: "自落桶" },
//   { value: "laduan", label: "拉断" },
//   { value: "lamaohuanian", label: "拉毛花捻" },
//   { value: "dianqi", label: "电器" },
//   { value: "wu83", label: "583" },
//   { value: "zhoucheng", label: "轴承" },
//   { value: "maoling", label: "毛另" },
//   { value: "sanjiaodai", label: "三角带" },
//   { value: "shumaoji", label: "梳毛机" },
//   { value: "gaobing", label: "高并" },
//   { value: "dache", label: "大车" },
// ];
// const StockAll = () => {
//   const debounceTimeout = useRef(null);
//   const router = useRouter();
//   const [stockList, setStockList] = useState([]);
//   const [wareHouse, setWareHouse] = useState("qianfang");
//   const [itemName, setItemName] = useState("");
//   const [wareHouseLabel, setWareHouseLabel] = useState("");
//   const [allStock, setAllstock] = useState([]);
//   const [stockName, setStockName] = useState([]);
//   const getLabelByValue = (value) => {
//     const wareHouse = wareHouseList.find((item) => item.value === value);
//     return wareHouse ? wareHouse.label : "";
//   };
//   const getStockList = () => {
//     GlobalApi.GetStockList(wareHouse, itemName).then((resp) => {
//       if (resp) {
//         setStockList(resp.data);
//       }
//     });
//   };
//   const getAllStock = () => {
//     GlobalApi.GetStockList("", stockName).then((resp) => {
//       if (resp.data.length > 0) {
//         console.log("first:", resp.data);
//         setAllstock(resp.data);
//       }
//     });
//   };

//   useEffect(() => {
//     getStockList();
//     console.log(wareHouse);
//     setWareHouseLabel(getLabelByValue(wareHouse));
//     // getAllStock();
//   }, [itemName]);
//   // useEffect(() => {
//   //   getAllStock();
//   //   console.log("set:", allStock);
//   // }, [stockName]);

//   const colHeaders = [
//     "货品名称",
//     "单价",
//     // "总入库",
//     // "总出库",

//     // "上月剩余",
//     "本月入库",
//     "本月出库",
//     "剩余库存",
//     "库存价值",
//     "所属仓库",
//   ];

//   const columns = [
//     { data: "itemName", renderer: centerRenderer },
//     { data: "unitPrice", renderer: centerRenderer },
//     // { data: "totalIn", renderer: centerRenderer },
//     // { data: "totalOut", renderer: centerRenderer },

//     // { data: "lastMonthCarry", renderer: centerRenderer },
//     { data: "monthlyIn", renderer: centerRenderer },
//     { data: "monthlyOut", renderer: centerRenderer },
//     { data: "remaining", renderer: centerRenderer },
//     { data: "stockValue", renderer: centerRenderer },
//     // { data: "wareHouse", renderer: centerRenderer },
//   ];

//   function centerRenderer(instance, td, row, col, prop, value, cellProperties) {
//     Handsontable.renderers.TextRenderer.apply(this, arguments);
//     td.style.textAlign = "center";
//     td.style.verticalAlign = "middle";
//   }

//   const exportToExcel = () => {
//     const dataWithHeaders = [
//       colHeaders,
//       ...stockList.map((item) => Object.values(item)),
//     ];
//     const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "data.xlsx");
//   };
//   const handleSearch = (e) => {
//     getStockList();
//     console.log(allStock);
//   };
//   const handleKeydown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const handleInputChange = (value) => {
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }
//     debounceTimeout.current = setTimeout(() => {
//       setStockName(value);

//       console.log(stockName);
//       console.log(value);

//       getAllStock();
//     }, 1000);
//   };
//   const handleSuggestionClick = (suggestion) => {
//     setStockName(suggestion.itemName);
//   };
//   return (
//     <div>
//       <div className="container pt-5 h-full">
//         <div className="flex justify-between mt-2 mb-4 h-full">
//           <Button
//             variant="outline"
//             className="bg-primary  text-white w-[10%]"
//             onClick={() => router.push("/stock/stockin")}
//           >
//             入库
//           </Button>
//           <Button
//             variant="outline"
//             className="bg-primary text-white w-[10%]"
//             onClick={() => router.push("/stock/stockout")}
//           >
//             出库
//           </Button>
//         </div>
//         <div className="flex justify-between items-center gap-5 mb-4">
//           <Select.Root
//             defaultValue={wareHouse}
//             onValueChange={(value) => setWareHouse(value)}
//           >
//             <Select.Trigger color="cyan" variant="soft" />
//             <Select.Content color="cyan">
//               <Select.Item value="qianfang">前纺</Select.Item>
//               <Select.Item value="si71">471</Select.Item>
//               <Select.Item value="ziluotong">自落桶</Select.Item>
//               <Select.Item value="laduan">拉断</Select.Item>
//               <Select.Item value="lamaohuanian">拉毛花捻</Select.Item>
//               <Select.Item value="dianqi">电器</Select.Item>
//               <Select.Item value="wu83">583</Select.Item>
//               <Select.Item value="zhoucheng">轴承</Select.Item>
//               <Select.Item value="maoling">毛另</Select.Item>
//               <Select.Item value="sanjiaodai">三角带</Select.Item>
//               <Select.Item value="shumaoji">梳毛机</Select.Item>
//               <Select.Item value="gaobing">高并</Select.Item>
//               <Select.Item value="dache">大车</Select.Item>
//             </Select.Content>
//           </Select.Root>
//           <div>{wareHouseLabel}库存表</div>
//           <div className="flex gap-2">
//             <div className=" rounded-md border border-solid">
//               <input
//                 className=" px-4 py-2 text-sm focus:outline-none"
//                 placeholder="查询货品"
//                 placholder="查询货品"
//                 onKeyDown={handleKeydown}
//                 onChange={(e) => handleInputChange(e.target.value)}
//               />
//               {allStock.length > 0 && (
//                 <ul className="suggestions-list">
//                   {allStock.map((suggestion) => (
//                     <li
//                       key={suggestion.id}
//                       onClick={() => handleSuggestionClick(suggestion)}
//                       className="suggestion-item"
//                     >
//                       {suggestion.itemName}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//             <Button
//               variant="outline"
//               className="bg-primary text-white w-[30%]"
//               onClick={() => {
//                 handleSearch;
//               }}
//             >
//               查询
//             </Button>
//           </div>
//         </div>

//         {stockList.length > 0 ? (
//           <div className=" z-0">
//             <HotTable
//               data={stockList}
//               columns={columns}
//               colHeaders={colHeaders}
//               rowHeaders={true}
//               width="100%"
//               height="auto"
//               licenseKey="non-commercial-and-evaluation" // 请替换为您的许可证密钥
//               columnSorting={true}
//               readOnly={true}
//               stretchH="all"
//               manualColumnResize={true}
//               // className="z-0"
//             />
//           </div>
//         ) : (
//           <div className="flex justify-center items-center mt-10 text-gray-600 gap-4">
//             没有数据
//             <TbError404 width={100} height={100} className="w-10" />
//           </div>
//         )}

//         <Button
//           variant="outline"
//           className="bg-primary text-white absolute gap-2 bottom-4"
//           onClick={() => router.push("/")}
//         >
//           <FaArrowLeftLong />
//           返回主页
//         </Button>
//         <Button
//           variant="outline"
//           className="bg-primary text-white absolute bottom-4 right-4"
//           onClick={exportToExcel}
//         >
//           导出excel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default StockAll;

"use client";
import React, { useEffect, useState, useRef } from "react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TbError404 } from "react-icons/tb";
import GlobalApi from "@/server/GlobalApi";
import { Select } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";
import NoDataPage from "../components/NoDataPage";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const wareHouseList = [
  { value: "qianfang", label: "前纺" },
  { value: "si71", label: "471" },
  { value: "ziluotong", label: "自落桶" },
  { value: "laduan", label: "拉断" },
  { value: "lamaohuanian", label: "拉毛花捻" },
  { value: "dianqi", label: "电器" },
  { value: "wu83", label: "583" },
  { value: "zhoucheng", label: "轴承" },
  { value: "maoling", label: "毛另" },
  { value: "sanjiaodai", label: "三角带" },
  { value: "shumaoji", label: "梳毛机" },
  { value: "gaobing", label: "高并" },
  { value: "dache", label: "大车" },
];

const StockAll = () => {
  const debounceTimeout = useRef(null);
  const router = useRouter();
  const [stockList, setStockList] = useState([]);
  const [wareHouse, setWareHouse] = useState("qianfang");
  const [itemName, setItemName] = useState("");
  const [wareHouseLabel, setWareHouseLabel] = useState("");
  const [allStock, setAllstock] = useState([]);
  const [stockName, setStockName] = useState("");
  const [model, setModel] = useState(false);
  const [totalStock, setTotalStock] = useState(0);
  const getLabelByValue = (value) => {
    const wareHouse = wareHouseList.find((item) => item.value === value);
    return wareHouse ? wareHouse.label : "";
  };

  const getStockList = () => {
    GlobalApi.GetStockList(
      wareHouse,
      itemName === "" || undefined ? "" : itemName
    ).then((resp) => {
      if (resp) {
        setStockList(resp.data);
        setModel(false);
        const total = resp.data.reduce((acc, item) => {
          return acc + item.remaining * item.unitPrice;
        }, 0);
        setTotalStock(total);
      }
      console.log(itemName, "item");
    });
  };

  const getAllStock = (value) => {
    GlobalApi.GetStockList("", value).then((resp) => {
      if (resp.data.length > 0) {
        setAllstock(resp.data);
        console.log(resp.data);
        console.log(stockName);
        const total = resp.data.reduce((acc, item) => {
          return acc + item.remaining * item.unitPrice;
        }, 0);
        setTotalStock(total);
      } else {
        setAllstock([]);
        setModel(false);
      }
      console.log("first", value);

      setItemName(value);
    });
  };

  useEffect(() => {
    getStockList();
    getAllStock(stockName);
  }, [wareHouse]);

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      getStockList();
      setModel(false);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setModel(true);
    setStockName(value);
    setItemName(value);
    console.log(value, "valbhbh");

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      getAllStock(value);
      console.log(value);
    }, 1000);
  };

  const colHeaders = [
    { id: 1, name: "货品名称" },
    { id: 2, name: "单价" },
    { id: 3, name: "本月入库" },
    { id: 4, name: "本月出库" },
    { id: 5, name: "剩余库存" },
    { id: 6, name: "库存价值" },
    { id: 7, name: "所属仓库" },
  ];

  const exportToExcel = () => {
    const dataWithHeaders = [
      colHeaders,
      ...stockList.map((item) => Object.values(item)),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };
  const handleSuggestionClick = (item) => {
    setStockName(item.itemName);
    setItemName(item.itemName);
    setModel(false);
    console.log(item);
  };

  return (
    <div className=" w-full h-full">
      <div className="lg:container bg-gray-200 flex flex-col justify-between pt-5 h-full">
        <div>
          {/* <div className="flex justify-between mt-2 mb-4">
            <Button
              variant="outline"
              className="bg-primary  text-white w-[10%]"
              onClick={() => router.push("/stock/stockin/stockinform")}
            >
              入库
            </Button>
            <Button
              variant="outline"
              className="bg-primary text-white w-[10%]"
              onClick={() => router.push("/stock/stockout/stockoutform")}
            >
              出库
            </Button>
          </div> */}
          <div className="flex justify-between items-center gap-5 mb-4">
            <Select.Root
              defaultValue={wareHouse}
              onValueChange={(value) => setWareHouse(value)}
            >
              <Select.Trigger color="cyan" variant="soft" />
              <Select.Content color="cyan">
                {wareHouseList.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <div>{wareHouseLabel}库存表</div>
            <div className="flex gap-2">
              <div className="relative rounded-md border border-solid">
                <input
                  className="px-4 py-2 text-sm focus:outline-none"
                  placeholder="查询货品"
                  onKeyDown={handleKeydown}
                  value={stockName}
                  onChange={handleInputChange}
                />
                {model && allStock.length > 0 && (
                  <ul className=" absolute w-full bg-white border border-gray-300 rounded-md mt-12 max-h-40 overflow-y-auto z-10">
                    {allStock.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.itemName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button
                className="bg-primary text-white w-[30%]"
                onClick={getStockList}
              >
                查询
              </Button>
            </div>
          </div>
          <div className="flex mb-10 max-2xl:max-h-[800px] max-h-[450px] ">
            {stockList.length > 0 ? (
              <Table>
                <TableCaption>库存数据表</TableCaption>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    {colHeaders.length > 0 &&
                      colHeaders.map((col) => (
                        <TableHead key={col.id} className="w-[100px]">
                          {col.name}
                        </TableHead>
                      ))}
                    <TableHead className="w-[100px]">库存状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockList.map((stockItem) => (
                    <TableRow key={stockItem.itemName}>
                      <TableHead className="w-[100px]">
                        {stockItem.itemName}
                      </TableHead>

                      <TableHead>
                        {parseFloat(stockItem.unitPrice.toFixed(2))}
                      </TableHead>
                      <TableHead>{stockItem.monthlyIn}</TableHead>
                      <TableHead>{stockItem.monthlyOut}</TableHead>
                      <TableHead>{stockItem.remaining}</TableHead>
                      <TableHead>{stockItem.stockValue}</TableHead>
                      <TableHead>
                        {getLabelByValue(stockItem.wareHouse)}
                      </TableHead>
                      <TableHead
                        className={`${
                          stockItem.remaining < 5
                            ? "bg-red-500"
                            : "bg-green-400"
                        } text-white flex items-center justify-center`}
                      >
                        {stockItem.remaining > 5 ? "库存充足" : "库存警戒"}
                      </TableHead>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <NoDataPage />
            )}
          </div>
        </div>
        <div className=" bg-white fixed bottom-24">
          <div className="fixed right-2 md:right-14 lg:right-40">
            总入库价值:{parseFloat(totalStock.toFixed(2))} 元
          </div>
          <div className="fixed bottom-4 sm:left-0 sm:right-0 md:left-10 md:right-10 lg:left-28 lg:right-28 flex justify-between px-4">
            <Button
              className="bg-primary text-white gap-2"
              onClick={() => router.push("/")}
            >
              <FaArrowLeftLong />
              返回主页
            </Button>
            <Button className="bg-primary text-white" onClick={exportToExcel}>
              导出excel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAll;
