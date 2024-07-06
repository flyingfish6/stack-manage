// // pages/api/stockin.js
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// //http://localhost:3000/api/stock/stockin?itemName=test&unitPrice=11.2&quantity=1&supplierId=1&wareHose=
// export async function POST(req, res) {
//   const searchParams = req.nextUrl.searchParams;
//   const itemName = searchParams.get("itemName");
//   const unitPrice = parseFloat(searchParams.get("unitPrice"));
//   const quantity = parseInt(searchParams.get("quantity"));
//   const supplierName = searchParams.get("supplierName");
//   const wareHose = searchParams.get("wareHouse");

//   try {
//     const result = await prisma.$transaction(async (prisma) => {
//       // 查找库存记录
//       let item = await prisma.stock.findUnique({
//         where: { itemName },
//       });

//       // 如果库存记录不存在，创建一个新的库存记录
//       if (!item) {
//         item = await prisma.stock.create({
//           data: {
//             itemName,
//             unitPrice,
//             wareHouse: wareHose,
//           },
//         });

//         if (!item) {
//           throw new Error("Failed to create stock");
//         }
//       }

//       // 查找供应商记录
//       let supplier = await prisma.supplier.findUnique({
//         where: { name: supplierName },
//       });

//       // 如果供应商记录不存在，创建一个新的供应商记录
//       if (!supplier) {
//         supplier = await prisma.supplier.create({
//           data: {
//             name: supplierName,
//           },
//         });

//         if (!supplier) {
//           throw new Error("Failed to create supplier");
//         }
//       }

//       // 更新库存记录
//       const wareHouse = item.wareHouse;
//       const price = item.unitPrice;
//       const remain = item.remaining;
//       const avagePrice =
//         (price * remain + quantity * unitPrice) / (remain + quantity);

//       const updatedStock = await prisma.stock.update({
//         where: { itemName },
//         data: {
//           totalIn: { increment: quantity },
//           remaining: { increment: quantity },
//           stockValue: { increment: quantity * avagePrice },
//           unitPrice: avagePrice, // 更新单价
//           monthlyIn: { increment: quantity }, // 更新本月入库
//         },
//       });

//       // 插入入库记录
//       const stockIn = await prisma.stockIn.create({
//         data: {
//           itemName,
//           unitPrice: parseFloat(unitPrice),
//           quantity: parseInt(quantity),
//           supplier: supplierName,
//           wareHose: wareHouse,
//         },
//       });

//       if (!stockIn) {
//         throw new Error("Failed to create stockIn");
//       }

//       return { updatedStock, stockIn };
//     });

//     return NextResponse.json(result.updatedStock, { status: 200 });
//   } catch (error) {
//     console.error("Transaction failed: ", error);
//     return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   const searchParams = req.nextUrl.searchParams;
//   const wareHose = searchParams.get("wareHouse");
//   const startTime = searchParams.get("startDate");
//   const endTime = searchParams.get("endDate");
//   const itemName = searchParams.get("itemName");
//   let supplier = searchParams.get("supplier");

//   if (supplier === "1") {
//     supplier = "";
//   }

//   const conditions = [];

//   if (wareHose) {
//     conditions.push({ wareHose: { equals: wareHose } }); // 精确匹配
//   }

//   if (supplier) {
//     conditions.push({ supplier: { equals: supplier } }); // 精确匹配
//   }

//   if (startTime && endTime) {
//     conditions.push({
//       createdAt: {
//         gte: new Date(startTime), // 开始时间
//         lte: new Date(endTime), // 截止时间
//       },
//     });
//   }

//   // 如果没有条件，返回所有数据
//   if (conditions.length === 0) {
//     const stockinList = await prisma.stockIn.findMany();
//     return NextResponse.json(stockinList, { status: 201 });
//   }

//   const stockinList = await prisma.stockIn.findMany({
//     where: {
//       AND: conditions,
//     },
//   });
//   return NextResponse.json(stockinList, { status: 200 });
// }

// pages/api/stockin.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// http://localhost:3000/api/stock/stockin?itemName=test&unitPrice=11.2&quantity=1&supplierName=1&wareHouse=
export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const itemName = searchParams.get("itemName");
  const unitPrice = parseFloat(searchParams.get("unitPrice"));
  const quantity = parseFloat(searchParams.get("quantity"));
  const supplierName = searchParams.get("supplierName");
  const wareHouse = searchParams.get("wareHouse");

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // 查找库存记录
      let item = await prisma.stock.findUnique({
        where: { itemName },
      });

      // 如果库存记录不存在，创建一个新的库存记录
      if (!item) {
        item = await prisma.stock.create({
          data: {
            itemName,
            unitPrice,
            wareHouse,
          },
        });
        item = await prisma.stock.findUnique({
          where: { itemName },
        });
        if (!item) {
          throw new Error("Failed to create stock");
        }
      }

      // 查找供应商记录
      let supplier = await prisma.supplier.findUnique({
        where: { name: supplierName },
      });

      // 如果供应商记录不存在，创建一个新的供应商记录
      if (!supplier) {
        supplier = await prisma.supplier.create({
          data: {
            name: supplierName,
          },
        });

        if (!supplier) {
          throw new Error("Failed to create supplier");
        }
      }

      // 插入入库记录
      const house = item.wareHouse;
      const stockIn = await prisma.stockIn.create({
        data: {
          itemName,
          unitPrice,
          quantity,
          supplier: supplierName,
          wareHose: house,
          remaining: quantity, // 初始化剩余数量
        },
      });

      if (!stockIn) {
        throw new Error("Failed to create stockIn");
      }

      // 更新库存记录（FIFO）
      // 获取所有入库记录，按照先进先出排序
      const stockIns = await prisma.stockIn.findMany({
        where: { itemName },
        orderBy: { createdAt: "asc" },
      });

      let totalQuantity = 0;
      let totalValue = 0;

      // 计算加权平均单价
      for (const stockInRecord of stockIns) {
        totalQuantity += stockInRecord.remaining;
        totalValue += stockInRecord.remaining * stockInRecord.unitPrice;
      }

      const averagePrice = totalValue / totalQuantity;

      const updatedStock = await prisma.stock.update({
        where: { itemName },
        data: {
          totalIn: { increment: quantity },
          remaining: { increment: quantity },
          stockValue: { increment: quantity * unitPrice },
          unitPrice: averagePrice, // 更新单价为加权平均单价
          monthlyIn: { increment: quantity }, // 更新本月入库
        },
      });

      return { updatedStock, stockIn };
    });

    return NextResponse.json(result.updatedStock, { status: 200 });
  } catch (error) {
    console.error("Transaction failed: ", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const wareHouse = searchParams.get("wareHouse");
  const startTime = searchParams.get("startDate");
  const endTime = searchParams.get("endDate");
  const itemName = searchParams.get("itemName");
  let supplier = searchParams.get("supplier");

  if (supplier === "1") {
    supplier = "";
  }

  const conditions = [];

  if (wareHouse) {
    conditions.push({ wareHose: { equals: wareHouse } }); // 精确匹配
  }

  if (supplier) {
    conditions.push({ supplier: { equals: supplier } }); // 精确匹配
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
    const stockinList = await prisma.stockIn.findMany();
    return NextResponse.json(stockinList, { status: 201 });
  }

  const stockinList = await prisma.stockIn.findMany({
    where: {
      AND: conditions,
    },
  });
  return NextResponse.json(stockinList, { status: 200 });
}
