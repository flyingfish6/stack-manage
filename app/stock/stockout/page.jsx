"use client";
import React, { useEffect, useState, useRef } from "react";

import "handsontable/dist/handsontable.full.css";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import GlobalApi from "@/server/GlobalApi";
import { Select } from "@radix-ui/themes";
import NoDataPage from "../components/NoDataPage";
import { DateRange } from "react-date-range";
import zhCN from "date-fns/locale/zh-CN";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { CiCalendarDate } from "react-icons/ci";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

import moment from "moment";
import { FaTrash } from "react-icons/fa";
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
export const workshopList = [
  { value: "qianfang", label: "出库前纺" },
  { value: "si71", label: "出库471" },
  { value: "ziluotong", label: "出库自落桶" },
  { value: "laduan", label: "出库拉断" },
  { value: "lamaohuanian", label: "出库拉毛花捻" },
  { value: "dianqi", label: "出库电器" },
  { value: "wu83", label: "出库583" },
  { value: "zhoucheng", label: "出库轴承" },
  { value: "maoling", label: "出库毛另" },
  { value: "sanjiaodai", label: "出库三角带" },
  { value: "shumaoji", label: "出库梳毛机" },
  { value: "gaobing", label: "出库高并" },
  { value: "dache", label: "出库大车" },
  { value: "chuku", label: "本仓出库" },
];
const StockAll = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimeout = useRef(null);
  const router = useRouter();
  const [stockList, setStockList] = useState([]);
  const [wareHouse, setWareHouse] = useState("qianfang");

  const [itemName, setItemName] = useState("");
  const [allStock, setAllstock] = useState([]);
  const [stockName, setStockName] = useState();
  const [model, setModel] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [startDateFormatted, setStartDateFormatted] = useState("");
  const [endDateFormatted, setEndDateFormatted] = useState("");
  const [totalStockIn, setTotalStockIn] = useState(0);
  const [delOpen, setDelOpen] = useState(false);
  const [stockIn, setStockIn] = useState();
  const [workshopName, setworkshopName] = useState("1");
  const getLabelByValue = (value) => {
    const wareHouse = wareHouseList.find((item) => item.value === value);
    return wareHouse ? wareHouse.label : "";
  };
  const getWorkshopByValue = (value) => {
    const workshop = workshopList.find((item) => item.value === value);
    return workshop ? workshop.label : "";
  };
  const handleSelect = (ranges) => {
    setState([ranges.selection]);
    const startDateFormatted = moment(ranges.selection.startDate).format(
      "YYYY-MM-DD"
    );
    const endDateFormatted = moment(ranges.selection.endDate).format(
      "YYYY-MM-DD"
    );
    setStartDateFormatted(startDateFormatted);
    setEndDateFormatted(endDateFormatted);
    console.log("Start Date:", startDateFormatted);
    console.log("End Date:", endDateFormatted);
  };
  const handleConfirm = () => {
    setIsOpen(false);
  };

  const getStockList = () => {
    GlobalApi.GetStockList(wareHouse, itemName).then((resp) => {
      if (resp) {
        setStockList(resp.data);
        setModel(false);
      }
    });
  };

  const getAllStock = (value) => {
    GlobalApi.GetStockList("", value).then((resp) => {
      if (resp.data.length > 0) {
        setAllstock(resp.data);
      } else {
        setAllstock([]);
        setModel(false);
      }
      setItemName(value);
    });
  };

  useEffect(() => {
    // getStockList();
    getFilterStockList();
    // getAllStock(stockName);
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
    { id: 3, name: "出库数量" },

    { id: 4, name: "出库价值" },
    { id: 5, name: "领料人" },
    { id: 6, name: "所属仓库" },
    { id: 9, name: "出库车间" },

    { id: 7, name: "出库时间" },
    { id: 8, name: "删除" },
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
  const getStockIn = () => {
    GlobalApi.GetStockOutList(
      wareHouse,
      workshopName,
      startDateFormatted,
      endDateFormatted
    ).then((resp) => {
      if (resp.data.length > 0) {
        setStockList(resp.data);
      }
      console.log(resp);
      setStockList(resp.data);
      const total = resp.data.reduce((acc, item) => {
        return acc + item.quantity * item.stockIn.unitPrice;
      }, 0);
      setTotalStockIn(total);
    });
  };
  const getStockListByName = () => {
    GlobalApi.GetStockOutByName(itemName).then((resp) => {
      if (resp.data.length > 0) {
        setStockList(resp.data);
      }
      setModel(false);
      console.log(resp.data);
      setStockList(resp.data);
      const total = resp.data.reduce((acc, item) => {
        return acc + item.quantity * item.stockIn.unitPrice;
      }, 0);
      setTotalStockIn(total);
    });
  };
  const getFilterStockList = () => {
    console.log(wareHouse);
    console.log(startDateFormatted);
    console.log(endDateFormatted);
    console.log(supplierName);
    getStockIn();
  };

  const clearDate = () => {
    setStartDateFormatted("");
    setIsOpen(false);
    console.log(moment(new Date()).format("YYYY-MM-01"));
    console.log(new Date());
  };
  const onDelete = (id, name) => {
    console.log(id);
    console.log(name);
    setDelOpen(true);
  };
  const handleDel = (id) => {
    GlobalApi.DelStockOutById(id).then((resp) => {
      if (resp.status === 200) {
        toast({ title: "删除成功" });
        getStockIn();
      } else {
        toast({
          title: "删除失败",
          // description: "该条记录删除失败，可能是因为已经存在出库记录",
        });
      }
    });
  };

  return (
    <div className=" w-full h-full">
      <div className="container flex flex-col justify-between pt-5 h-full">
        <div>
          <div className="flex justify-between items-center gap-5 mb-4">
            <div className="flex gap-2 items-center justify-center">
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
              <div className="relative inline-block">
                <Button
                  onClick={() => setIsOpen(true)}
                  className="gap-2 text-white px-4 py-2 rounded"
                >
                  选择日期范围
                  <CiCalendarDate size={25} />
                </Button>
                {isOpen && (
                  <div className="absolute z-50 mt-2 p-4 bg-white border rounded shadow-lg">
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleSelect}
                      moveRangeOnFirstSelection={false}
                      ranges={state}
                      locale={zhCN} // 设置为中文
                    />
                    <div className="flex justify-between">
                      <Button
                        onClick={handleConfirm}
                        className="mt-2 bg-primary text-white px-4 py-2 rounded"
                      >
                        确认
                      </Button>
                      <Button
                        onClick={clearDate}
                        className="mt-2 bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded"
                      >
                        清除日期
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Select.Root
                defaultValue="1"
                onValueChange={(value) => setworkshopName(value)}
              >
                <Select.Trigger color="cyan" variant="soft" />
                <Select.Content color="cyan">
                  {workshopList.map((item) => (
                    <Select.Item key={item.value} value={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                  <Select.Item value="1">请选择出库车间</Select.Item>
                </Select.Content>
              </Select.Root>

              <Button
                className="bg-primary text-white w-[30%]"
                onClick={getFilterStockList}
              >
                查询
              </Button>
            </div>
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
                onClick={getStockListByName}
              >
                搜索货品
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockList.map((stockItem) => (
                    <TableRow key={stockItem.id}>
                      <TableHead className="w-[100px]">
                        {stockItem.itemName}
                      </TableHead>
                      <TableHead>{stockItem.quantity}</TableHead>
                      <TableHead>
                        {stockItem.stockIn.unitPrice * stockItem.quantity}
                      </TableHead>
                      <TableHead>{stockItem.receiver}</TableHead>
                      <TableHead>
                        {getLabelByValue(stockItem.wareHouse)}
                      </TableHead>
                      <TableHead>
                        {getWorkshopByValue(stockItem.workshop)}
                      </TableHead>

                      <TableHead>
                        {moment(stockItem.createdAt).format("YYYY-MM-DD")}
                      </TableHead>
                      <TableHead>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() =>
                                onDelete(stockItem.id, stockItem.itemName)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                确定要删除这条出库库记录吗？
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                删除这条出库记录总库存也会变化
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                // onClick={(stockItem.id)=>handleDelById()}
                                // onClick={(stockItem.id)=>handleDel(stockItem.id)}
                                asChild
                              >
                                <Button onClick={() => handleDel(stockItem.id)}>
                                  确定
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
            总出库价值:{totalStockIn} 元
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
