import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  let itemName = searchParams.get("itemName");
  let wareHouse = searchParams.get("wareHouse");

  if (itemName === "undefined") {
    itemName = "";
  }
  if (wareHouse === "undefined") {
    wareHouse = "";
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      let stockList = [];

      if (!itemName && !wareHouse) {
        stockList = await prisma.stock.findMany();
      } else if (itemName === "" && wareHouse) {
        stockList = await prisma.stock.findMany({
          where: { wareHouse },
        });
      } else if (wareHouse === "" && itemName) {
        stockList = await prisma.stock.findMany({
          where: {
            AND: [{ itemName: { contains: itemName } }],
          },
        });
      } else if (wareHouse && itemName) {
        stockList = await prisma.stock.findMany({
          where: {
            AND: [{ itemName: { contains: itemName } }],
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
