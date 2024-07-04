"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
const Login = () => {
  const router = useRouter();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  // const handelLogin = (e) => {
  //   e.preventDefault();
  //   GlobalApi.Login(phone, password).then((resp) => {
  //     console.log(resp);
  //     if (resp.status === 200) {
  //       router.push("/");
  //     } else if (resp.status === 201) {
  //       toast({
  //         title: "密码错误",
  //       });
  //     } else {
  //       toast({
  //         title: "用户不存在",
  //       });
  //     }
  //   });
  // };

  const handelLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // 防止页面跳转
      phone,
      password,
    });
    console.log(result);
    if (result.status === 200) {
      router.push("/");
    } else {
      toast({ title: "密码错误" });
    }
  };
  return (
    <div className="items-center  bg-primary justify-center flex h-full">
      <div className=" bg-white rounded-xl py-20 flex items-center justify-center w-[50%]">
        <div>
          <div className="grid gap-2   mb-5 ">
            <Label htmlFor="phone">手机号码</Label>
            <Input
              placholder="手机号码"
              id="phone"
              focused="false"
              className="focus:border-none"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-2 ">
            <Label htmlFor="phone">密码</Label>

            <Input
              placholder="手机号码"
              id="phone"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
            />
          </div>
          <Button className="w-full mt-5 text-white" onClick={handelLogin}>
            登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
