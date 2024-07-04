import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const Login = async (phone, password) =>
  await axios.post(`/api/login?phone=${phone}&password=${password}`);

export default {
  Login,
};
