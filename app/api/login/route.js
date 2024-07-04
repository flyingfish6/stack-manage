// eslint-disable-next-line import/no-anonymous-default-export
// export async function POST(req, res) {
//   const { username, password } = req.body;

//   // 获取用户数据文件的路径
//   const filePath = path.join(process.cwd(), "data", "users.json");

//   // 异步读取用户数据
//   const jsonData = await fs.promises.readFile(filePath, "utf8");
//   const data = JSON.parse(jsonData);

//   // 查找用户
//   const user = data.users.find(
//     (u) => u.username === username && u.password === password
//   );

//   if (user) {
//     // 成功登录，返回用户 token
//     res.status(200).json({ token: user.token });
//   } else {
//     // 登录失败
//     res.status(401).json({ message: "无效的用户名或密码" });
//   }
// }

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  const searchParams = request.nextUrl.searchParams;
  const phone = searchParams.get("phone");
  const password = searchParams.get("password");
  const filePath = path.join(process.cwd(), "data", "users.json");

  // 异步读取用户数据
  const jsonData = await fs.promises.readFile(filePath, "utf8");
  const data = JSON.parse(jsonData);
  const user = data.users.find((u) => u.phone === phone);
  if (!user) {
    return new NextResponse(JSON.stringify("用户未找到"), {
      status: 203,
    });
  } else {
    if (user.password === password)
      return new NextResponse(JSON.stringify(user), { status: 200 });
    else {
      return new NextResponse(JSON.stringify("密码错误"), {
        status: 201,
      });
    }
  }
}
