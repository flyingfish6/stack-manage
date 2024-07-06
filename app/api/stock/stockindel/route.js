import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = parseInt(searchParams.get("id"));

  try {
    // 查找入库记录
    const stockIn = await prisma.stockIn.findUnique({
      where: { id },
    });

    if (!stockIn) {
      return NextResponse.json([], { status: 202 });
    }

    // 查找库存记录
    const stock = await prisma.stock.findUnique({
      where: { itemName: stockIn.itemName },
    });

    if (!stock) {
      return NextResponse.json([], { status: 202 });
    }
    if (stockIn.remaining !== stockIn.quantity) {
      return NextResponse.json(stockIn, { status: 203 });
    }
    const result = await prisma.$transaction(async (prisma) => {
      // 检查入库记录是否已部分出库
      if (stockIn.remaining !== stockIn.quantity) {
        return NextResponse.json(stockIn, { status: 203 });
      } else {
        // 删除入库记录
        const delStockIn = await prisma.stockIn.delete({
          where: { id },
        });

        const stockValue =
          stock.stockValue - stockIn.unitPrice * stockIn.quantity;
        const remain = stock.remaining - stockIn.quantity;
        const avagePrice = remain > 0 ? stockValue / remain : 0;

        // 更新库存记录
        const updateStock = await prisma.stock.update({
          where: { itemName: stockIn.itemName },
          data: {
            unitPrice: avagePrice,
            totalIn: { decrement: stockIn.quantity },
            remaining: { decrement: stockIn.quantity },
            stockValue: stockValue,
            monthlyIn: { decrement: stockIn.quantity },
          },
        });

        return { delStockIn, updateStock };
      }
    });

    return NextResponse.json(result.updateStock, { status: 200 });
  } catch (error) {
    console.error("Transaction failed: ", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}
