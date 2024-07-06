"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "@/server/GlobalApi";
import Spinner from "../../components/Spinner";
import { toast } from "@/components/ui/use-toast";
import { Select } from "@radix-ui/themes";
import toastr from "toastr";
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
const StockIn = () => {
  const debounceTimeout = useRef(null);
  const [allStock, setAllstock] = useState([]);
  const [model, setModel] = useState(false);
  const [item, setItem] = useState();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiverList, setReceiverList] = useState([]);
  const [modelReceiver, setModelReceiver] = useState(false);
  const [workshop, setWorkshop] = useState("chuku");
  const [selectOpen, setSelectOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    itemName: false,
    quantity: false,
    receiver: false,
  });

  const handleInputChange = (e) => {
    const { value } = e.target;
    setModel(true);
    setItemName(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      getAllStock(value);
      console.log(value);
    }, 500);
  };

  const handleReceierChange = (e) => {
    const { value } = e.target;
    console.log(value);
    setModelReceiver(true);
    setReceiver(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      getAllReceiver(value);
      console.log(value);
    }, 500);
  };

  const handleReceiverClick = (receivers) => {
    console.log(receivers);
    setReceiver(receivers.name);
    setModelReceiver(false);

    console.log(receiver);
  };

  const getAllStock = (value) => {
    GlobalApi.GetStockList("", value).then((resp) => {
      if (resp.data.length > 0) {
        setAllstock(resp.data);
        console.log(resp.data);
        console.log(itemName);
        setSelectOpen(false);
      } else {
        setAllstock([]);
        setSelectOpen(true);
        setModel(false);
      }
      console.log("first", value);
    });
  };

  const submitStockOut = () => {
    GlobalApi.CreateStockOut(itemName, quantity, receiver, workshop).then(
      (resp) => {
        if (resp.status === 200) {
          console.log(resp.data);
          toast({ title: "出库成功" });
          setTimeout(() => {
            setLoading(false);

            window.location.reload();
          }, 1000);
        } else {
          toast({
            title: "库存不足",
            description: `货品：${itemName} 的库存还有：${
              resp.data?.remaining > 0 ? resp.data.remaining : 0
            }个`,
          });
          console.log(resp.data);
        }
      }
    );
  };

  const getAllReceiver = (value) => {
    GlobalApi.GetReceiverList(value).then((resp) => {
      if (resp.data.length > 0) {
        setModelReceiver(true);
        setReceiverList(resp.data);
        console.log(resp.data);
      } else {
        setReceiverList([]);
        setModelReceiver(false);
      }
    });
  };

  useEffect(() => {}, [item, selectOpen]);

  const handleSuggestionClick = (item) => {
    console.log(item);
    setItemName(item.itemName);
    setItem(item);
    setModel(false);

    console.log(item);
  };

  const handleSubmit = () => {
    const errors = {
      itemName: !itemName,
      quantity: !quantity,
      receiver: !receiver,
      workshop: !workshop,
    };

    setInputErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) {
      toast({ title: "请填写所有必填项" });
      return;
    }

    setLoading(true);
    submitStockOut();
  };

  return (
    <div className=" container w-full h-full bg-blue-2  ">
      <div className="flex h-full  items-center justify-center  ">
        <div className="bg-white relative  md:w-[60%] lg:w-[40%] flex flex-col px-20 py-16 rounded-md md:space-y-10 space-y-4">
          <div className="font-semibold  text-2xl flex items-center justify-center">
            出库登记表{" "}
          </div>
          <input
            className={`border focus:outline-none px-4 py-2 rounded-md ${
              inputErrors.itemName ? "border-red-500" : ""
            }`}
            placeholder="输入货品名称"
            value={itemName}
            type="text"
            onChange={handleInputChange}
            required
          />
          {model && allStock.length > 0 && (
            <ul className="absolute w-[80%] bg-white border border-gray-300 rounded-md top-[150px] max-h-40 overflow-y-auto z-10">
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
          <input
            placeholder="数量"
            value={quantity}
            type="number"
            required
            onChange={(e) => setQuantity(e.target.value)}
            className={`border focus:outline-none px-4 py-2 rounded-md ${
              inputErrors.quantity ? "border-red-500" : ""
            }`}
          />
          <input
            className={`border focus:outline-none px-4 py-2 rounded-md ${
              inputErrors.supplier ? "border-red-500" : ""
            }`}
            placeholder="领料人"
            type="text"
            value={receiver}
            onChange={handleReceierChange}
            required
          />
          {modelReceiver && receiverList.length > 0 && (
            <ul className="absolute w-[80%] bg-white border border-gray-300 rounded-md top-[300px] max-h-40 overflow-y-auto z-10">
              {receiverList.map((receivers) => (
                <li
                  key={receivers.id}
                  onClick={() => handleReceiverClick(receivers)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {receivers.name}
                </li>
              ))}
            </ul>
          )}

          <Select.Root
            defaultValue="chuku"
            onValueChange={(value) => setWorkshop(value)}
          >
            <Select.Trigger color="cyan" variant="soft" />
            <Select.Content color="cyan">
              {workshopList.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button
            disabled={loading}
            className="disabled:opacity-70 gap-2 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            {loading && <Spinner />}
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockIn;
