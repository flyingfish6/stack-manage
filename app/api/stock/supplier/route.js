// pages/api/supplier.js
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  try {
    const result = await prisma.$transaction(async (prisma) => {
      if (!name) {
        const supplierList = await prisma.supplier.findMany({});
        return supplierList;
      }

      const supplie = await prisma.supplier.findUnique({
        where: { name },
      });

      if (!supplie) {
        const supplier = await prisma.supplier.create({
          data: { name },
        });
        return supplier;
      }

      return supplie;
    });

    if (!name) {
      return NextResponse.json(result, { status: 201 });
    }

    if (!result.id) {
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({}, { status: 202 });
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");

  try {
    const result = await prisma.$transaction(async (prisma) => {
      if (!name) {
        const allSuppliers = await prisma.supplier.findMany();
        return allSuppliers;
      }

      if (name) {
        const suppliers = await prisma.supplier.findMany({
          where: {
            name: {
              contains: name,
            },
          },
        });
        return suppliers;
      }
    });

    if (!name) {
      if (result.length > 0) {
        return NextResponse.json(result, { status: 201 });
      }
      return NextResponse.json([], { status: 202 });
    }

    if (result.length > 0) {
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json([], { status: 202 });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
