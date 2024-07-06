// // pages/api/stockout.js
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// const prisma = new PrismaClient();

// export async function POST(req, res) {
//   const searchParams = req.nextUrl.searchParams;

//   const itemName = searchParams.get("itemName");
//   const quantity = parseInt(searchParams.get("quantity"));
//   const receiver = searchParams.get("receiver");
//   const workshop = searchParams.get("workshop");

//   try {
//     const result = await prisma.$transaction(async (prisma) => {
//       // 查找库存记录
//       const stock = await prisma.stock.findUnique({
//         where: { itemName },
//       });

//       if (!stock) {
//         throw new Error("Stock not found");
//       }

//       const balance = stock.remaining;
//       const price = stock.unitPrice;

//       if (quantity > balance || quantity < 0) {
//         throw new Error("Invalid quantity");
//       }

//       // 查找接收者记录
//       let receivers = await prisma.receiver.findUnique({
//         where: { name: receiver },
//       });

//       // 如果接收者不存在，创建一个新的接收者
//       if (!receivers) {
//         receivers = await prisma.receiver.create({
//           data: {
//             name: receiver,
//           },
//         });
//       }

//       // 插入出库记录
//       const stockOut = await prisma.stockOut.create({
//         data: {
//           itemName,
//           quantity,
//           receiver,
//           workshop,
//         },
//       });

//       // 更新库存记录
//       const stockUpdate = await prisma.stock.update({
//         where: { itemName },
//         data: {
//           totalOut: { increment: quantity },
//           remaining: { decrement: quantity },
//           stockValue: { decrement: quantity * price },
//           monthlyOut: { increment: quantity }, // 更新本月出库
//         },
//       });

//       return { stockOut, stockUpdate };
//     });

//     return NextResponse.json(result.stockOut, { status: 200 });
//   } catch (error) {
//     console.error("Transaction failed: ", error);
//     return NextResponse.json({}, { status: 203 });
//   }
// }

// pages/api/stockout.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;

  const itemName = searchParams.get("itemName");
  const quantity = parseFloat(searchParams.get("quantity"));
  const receiver = searchParams.get("receiver");
  const workshop = searchParams.get("workshop");
  const stock = await prisma.stock.findUnique({
    where: { itemName },
  });
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 查找库存记录

      if (!stock) {
        throw new Error("Stock not found");
      }

      const balance = stock.remaining;
      const price = stock.unitPrice;

      if (quantity > balance || quantity < 0) {
        throw new Error("Invalid quantity");
      }

      // 查找接收者记录
      let receiverRecord = await prisma.receiver.findUnique({
        where: { name: receiver },
      });

      // 如果接收者不存在，创建一个新的接收者
      if (!receiverRecord) {
        receiverRecord = await prisma.receiver.create({
          data: {
            name: receiver,
          },
        });
      }

      let remainingQuantity = quantity;
      const stockOutRecords = [];
      const stockInIdList = [];
      const quantityList = [];

      // 使用先进先出算法更新入库记录的剩余数量并创建出库记录
      const stockIns = await prisma.stockIn.findMany({
        where: {
          itemName,
          remaining: {
            gt: 0,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      for (const stockIn of stockIns) {
        if (remainingQuantity <= 0) break;
        if (stockIn.remaining > 0) {
          const stocks = await prisma.stock.findUnique({
            where: { itemName: stockIn.itemName },
          });
          const usedQuantity = Math.min(stockIn.remaining, remainingQuantity);

          const updatedStockIn = await prisma.stockIn.update({
            where: { id: stockIn.id },
            data: {
              remaining: { decrement: usedQuantity },
            },
          });

          stockInIdList.push(stockIn.id);
          quantityList.push(usedQuantity);

          const stockOut = await prisma.stockOut.create({
            data: {
              itemName,
              quantity: usedQuantity,
              receiver,
              workshop,
              stockInId: stockIn.id,
            },
          });

          // 更新库存记录
          const stockValue =
            stocks.stockValue - usedQuantity * stockIn.unitPrice;
          const stockRe = stocks.remaining - usedQuantity;
          const avagePrice = stockValue / stockRe;
          const stockUpdate = await prisma.stock.update({
            where: { itemName },
            data: {
              unitPrice: avagePrice,
              totalOut: { increment: usedQuantity },
              remaining: { decrement: usedQuantity },
              stockValue: { decrement: usedQuantity * stockIn.unitPrice },
              monthlyOut: { increment: usedQuantity }, // 更新本月出库
            },
          });
          stockOutRecords.push(stockOut);
          remainingQuantity -= usedQuantity;
        }
      }

      return { stockOutRecords };
    });

    return NextResponse.json(result.stockOutRecords, { status: 200 });
  } catch (error) {
    console.error("Transaction failed: ", error);
    return NextResponse.json(stock, { status: 201 });
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const wareHouse = searchParams.get("wareHouse");
  const startTime = searchParams.get("startDate");
  const endTime = searchParams.get("endDate");
  const itemName = searchParams.get("itemName");
  let workshop = searchParams.get("workshop");

  if (workshop === "1") {
    workshop = "";
  }

  const conditions = [];

  if (wareHouse) {
    conditions.push({ wareHouse: { equals: wareHouse } }); // 精确匹配
  }

  if (workshop) {
    conditions.push({ workshop: { equals: workshop } }); // 精确匹配
  }

  if (startTime && endTime) {
    conditions.push({
      createdAt: {
        gte: new Date(startTime), // 开始时间
        lte: new Date(endTime), // 截止时间
      },
    });
  }

  // 如果没有条件，返回所有数据
  if (conditions.length === 0) {
    const stockinList = await prisma.stockOut.findMany();
    return NextResponse.json(stockinList, { status: 201 });
  }

  const stockinList = await prisma.stockOut.findMany({
    where: {
      AND: conditions,
    },
    include: {
      stockIn: true, // 关联查询对应的入库记录
    },
  });
  return NextResponse.json(stockinList, { status: 200 });
}
