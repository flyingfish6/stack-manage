// cron/updateStock.js
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

const updateStock = async () => {
  const stocks = await prisma.stock.findMany();

  for (const stock of stocks) {
    const lastMonthCarry = stock.remaining;
    const monthlyIn = await prisma.stockIn.aggregate({
      where: {
        itemName: stock.itemName,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const monthlyOut = await prisma.stockOut.aggregate({
      where: {
        itemName: stock.itemName,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: {
        quantity: true,
      },
    });

    await prisma.stock.update({
      where: { itemName: stock.itemName },
      data: {
        lastMonthCarry,
        monthlyIn: monthlyIn._sum.quantity || 0,
        monthlyOut: monthlyOut._sum.quantity || 0,
        remaining: {
          set:
            lastMonthCarry +
            (monthlyIn._sum.quantity || 0) -
            (monthlyOut._sum.quantity || 0),
        },
      },
    });
  }
};

// 每个月的第一天凌晨 00:00 运行任务
cron.schedule("0 0 1 * *", updateStock);
