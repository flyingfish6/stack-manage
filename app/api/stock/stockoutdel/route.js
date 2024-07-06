// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// const prisma = new PrismaClient();

// export async function DELETE(req) {
//   const searchParams = req.nextUrl.searchParams;
//   const id = parseInt(searchParams.get("id"));

//   const stockout = await prisma.stockOut.findUnique({
//     where: { id },
//   });
//   const sto = await prisma.stock.findUnique({
//     where: { itemName: stockout.itemName },
//   });
//   const stockIn = await prisma.stockIn.update({
//     where: { id: stockout.stockInId },
//     data: {
//       remaining: { increment: stockout.quantity },
//     },
//   });
//   const stockValue = sto.stockValue + stockout.quantity * stockIn.unitPrice;
//   const rem = sto.remaining + stockout.quantity;
//   const price = stockValue / rem;
//   const stock = await prisma.stock.update({
//     where: { itemName: stockout.itemName },
//     data: {
//       stockValue: { increment: stockout.quantity * stockIn.unitPrice },
//       totalIn: { increment: stockout.quantity },
//       totalOut: { decrement: stockout.quantity },
//       remaining: { increment: stockout.quantity },
//       monthlyIn: { increment: stockout.quantity },
//       unitPrice: price,
//     },
//   });
//   await prisma.stockOut.delete({
//     where: { id },
//   });

//   return NextResponse.json(stock, { status: 200 });
// }

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = parseInt(searchParams.get("id"));

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 查找出库记录
      const stockOut = await prisma.stockOut.findUnique({
        where: { id },
      });

      if (!stockOut) {
        throw new Error("StockOut not found");
      }

      // 查找库存记录
      const stock = await prisma.stock.findUnique({
        where: { itemName: stockOut.itemName },
      });

      if (!stock) {
        throw new Error("Stock not found");
      }

      // 查找并更新入库记录的剩余数量
      const stockIn = await prisma.stockIn.update({
        where: { id: stockOut.stockInId },
        data: {
          remaining: { increment: stockOut.quantity },
        },
      });

      if (!stockIn) {
        throw new Error("StockIn not found");
      }

      const stockValue =
        stock.stockValue + stockOut.quantity * stockIn.unitPrice;
      const rem = stock.remaining + stockOut.quantity;
      const price = rem > 0 ? stockValue / rem : 0;

      // 更新库存记录
      const updatedStock = await prisma.stock.update({
        where: { itemName: stockOut.itemName },
        data: {
          stockValue: stockValue,
          totalOut: { decrement: stockOut.quantity },
          remaining: { increment: stockOut.quantity },
          unitPrice: price,
          monthlyOut: { decrement: stockOut.quantity },
        },
      });

      // 删除出库记录
      await prisma.stockOut.delete({
        where: { id },
      });

      return updatedStock;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Transaction failed: ", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}
