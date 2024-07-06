import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");
  if (!name) {
    const receivers = await prisma.receiver.findMany({});
    return NextResponse.json(receivers, { status: 202 });
  }
  const receivers = await prisma.receiver.findMany({
    where: {
      AND: [name ? { name: { contains: name } } : undefined],
    },
  });

  if (receivers.length === 0) {
    return NextResponse.json({}, { status: 201 });
  }
  return NextResponse.json(receivers, { status: 200 });
}
