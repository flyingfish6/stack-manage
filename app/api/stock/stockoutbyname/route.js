import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;

  const itemName = searchParams.get("itemName");

  try {
    const result = await prisma.$transaction(async (prisma) => {
      let stockList;

      if (!itemName) {
        stockList = await prisma.stockOut.findMany();
      } else {
        stockList = await prisma.stockOut.findMany({
          where: {
            itemName: {
              contains: itemName,
            },
          },
        });
      }

      return stockList;
    });

    if (result.length > 0) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json([], { status: 201 });
    }
  } catch (error) {
    console.error("Transaction failed: ", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}
