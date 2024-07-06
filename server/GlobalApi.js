import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const Login = async (phone, password) =>
  await axios.post(`/api/login?phone=${phone}&password=${password}`);

const GetStockList = async (wareHouse, itemName) =>
  await axios.get(
    `http://localhost:3000/api/stock/stockall?wareHouse=${wareHouse}&itemName=${itemName}`
  );

const GetSupplier = async (name) =>
  await axios.get(`http://localhost:3000/api/stock/supplier?name=${name}`);

const CreateStockIn = async (
  itemName,
  unitPrice,
  quantity,
  supplierName,
  wareHouse
) =>
  await axios.post(
    `http://localhost:3000/api/stock/stockin?itemName=${itemName}&unitPrice=${unitPrice}&quantity=${quantity}&supplierName=${supplierName}&wareHouse=${wareHouse}`
  );

const GetReceiverList = async (name) =>
  await axios.get(`http://localhost:3000/api/stock/receiver?name=${name}`);

const CreateStockOut = async (itemName, quantity, receiver, workshop) =>
  await axios.post(
    `http://localhost:3000/api/stock/stockout?itemName=${itemName}&quantity=${quantity}&receiver=${receiver}&workshop=${workshop}`
  );

const GetStockInList = async (wareHose, supplier, startDate, endDate) =>
  await axios.get(
    `http://localhost:3000/api/stock/stockin?wareHouse=${wareHose}&supplier=${supplier}&startDate=${startDate}&endDate=${endDate}`
  );
const GetStockOutList = async (wareHose, workshop, startDate, endDate) =>
  await axios.get(
    `http://localhost:3000/api/stock/stockout?wareHouse=${wareHose}&workshop=${workshop}&startDate=${startDate}&endDate=${endDate}`
  );
const GetStockInByName = async (itemName) =>
  await axios.get(
    `http://localhost:3000/api/stock/stockbyname?itemName=${itemName}`
  );
const GetStockInById = async (id) =>
  await axios.get(`http://localhost:3000/api/stock/stockinbyid?id=${id}`);

const DelStockInById = async (id) =>
  await axios.delete(`http://localhost:3000/api/stock/stockindel?id=${id}`);

const GetStockOutByName = async (itemName) =>
  await axios.get(
    `http://localhost:3000/api/stock/stockoutbyname?itemName=${itemName}`
  );

const DelStockOutById = async (id) =>
  await axios.delete(`http://localhost:3000/api/stock/stockoutdel?id=${id}`);

export default {
  Login,
  GetStockList,
  GetSupplier,
  CreateStockIn,
  GetReceiverList,
  CreateStockOut,
  GetStockInList,
  GetStockInByName,
  DelStockInById,
  GetStockOutByName,
  GetStockOutList,
  DelStockOutById,
  GetStockInById,
};
