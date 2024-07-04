import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const fs = require("fs").promises; // 使用 fs.promises
const path = require("path"); // 引入 path 模块

const getUserData = async () => {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
};

const findUser = async (phone, password) => {
  const data = await getUserData();
  const users = data.users; // 确保 users 是一个数组
  return users.find(
    (user) => user.phone === phone && user.password === password
  );
};

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await findUser(credentials.phone, credentials.password);
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.phone) {
        session.user.phone = token.phone;
      }
      return session;
    },
  },
};

export default NextAuth(options);
