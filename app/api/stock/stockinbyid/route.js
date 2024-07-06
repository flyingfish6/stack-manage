import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = parseInt(searchParams.get("id"));

  const stockin = await prisma.stockIn.findUnique({
    where: { id },
  });

  return NextResponse.json(stockin, { status: 200 });
}
