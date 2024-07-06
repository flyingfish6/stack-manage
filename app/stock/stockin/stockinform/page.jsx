"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "@/server/GlobalApi";
import Spinner from "../../components/Spinner";
import { wareHouseList } from "../../stockall/page";
import { toast } from "@/components/ui/use-toast";
import { Select } from "@radix-ui/themes";
import { delay } from "delay";
const StockIn = () => {
  const debounceTimeout = useRef(null);
  const [allStock, setAllstock] = useState([]);
  const [model, setModel] = useState(false);
  const [item, setItem] = useState();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [loading, setLoading] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [modelSupplier, setModelSupplier] = useState(false);
  const [wareHouse, setWareHouse] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    itemName: false,
    quantity: false,
    supplier: false,
    unitPrice: false,
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

  const handleSupplierChange = (e) => {
    const { value } = e.target;
    setModelSupplier(true);
    setSupplier(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      getAllSupplier(value);
      console.log(value);
    }, 500);
  };

  const handleSupplierClick = (suppliers) => {
    console.log(suppliers);
    setSupplier(suppliers.name);
    setModelSupplier(false);

    console.log(supplier);
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

  const submitStockIn = () => {
    GlobalApi.CreateStockIn(
      itemName,
      unitPrice,
      quantity,
      supplier,
      wareHouse
    ).then((resp) => {
      if (resp.status === 200) {
        console.log(resp.data);
        toast({
          title: "入库成功",
          description: `货品：${resp.data.itemName} 的库存还有：${resp.data.remaining}`,
        });

        setTimeout(() => {
          setLoading(false);

          window.location.reload();
        }, 1000);
      } else {
        toast({ title: "入库失败" });
        console.log(resp.data);
      }
    });
  };

  const getAllSupplier = (value) => {
    GlobalApi.GetSupplier(value).then((resp) => {
      if (resp.data.length > 0) {
        setModelSupplier(true);
        setSupplierList(resp.data);
        console.log(resp.data);
      } else {
        setSupplierList([]);
        setModelSupplier(false);
      }
    });
  };

  useEffect(() => {
    if (item) {
      setUnitPrice(item.unitPrice);
    }
  }, [item, selectOpen]);

  const handleSuggestionClick = (item) => {
    console.log(item);
    setItemName(item.itemName);
    setItem(item);
    setModel(false);

    console.log(item);
  };

  const handleSubmit = () => {
    let errors = {};
    if (selectOpen) {
      errors = {
        itemName: !itemName,
        quantity: !quantity,
        supplier: !supplier,
        unitPrice: !unitPrice,

        wareHouse: !wareHouse,
      };
    } else {
      errors = {
        itemName: !itemName,
        quantity: !quantity,
        supplier: !supplier,
        unitPrice: !unitPrice,
      };
    }

    setInputErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) {
      toast({ title: "请填写所有必填项" });
      return;
    }

    setLoading(true);
    submitStockIn();
  };

  return (
    <div className="w-full container h-full bg-blue-2  ">
      <div className="flex h-full  items-center justify-center  ">
        <div className="bg-white relative  md:w-[60%] lg:w-[40%] flex flex-col px-20 py-16 rounded-md md:space-y-10 space-y-4">
          <div className="font-semibold text-2xl flex items-center justify-center">
            入库登记表{" "}
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
            placeholder="供货商"
            type="text"
            value={supplier}
            onChange={handleSupplierChange}
            required
          />
          {modelSupplier && supplierList.length > 0 && (
            <ul className="absolute w-[80%] bg-white border border-gray-300 rounded-md top-[300px] max-h-40 overflow-y-auto z-10">
              {supplierList.map((suppliers) => (
                <li
                  key={suppliers.id}
                  onClick={() => handleSupplierClick(suppliers)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suppliers.name}
                </li>
              ))}
            </ul>
          )}
          <input
            value={unitPrice}
            placeholder="单价"
            type="number"
            required
            onChange={(e) => setUnitPrice(e.target.value)}
            className={`border focus:outline-none px-4 py-2 rounded-md ${
              inputErrors.unitPrice ? "border-red-500" : ""
            }`}
          />
          {selectOpen && (
            <Select.Root
              onValueChange={(value) => setWareHouse(value)}
              className="border"
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
          )}
          <Button
            disabled={loading}
            className="disabled:opacity-70 gap-2 disabled:cursor-not-allowed "
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
