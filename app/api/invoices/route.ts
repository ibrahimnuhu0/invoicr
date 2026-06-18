import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user?.id as string },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { clientId, dueDate, taxRate, notes, items } = await req.json();

    if (!clientId || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const invoiceCount = await prisma.invoice.count({
      where: { userId: session.user?.id as string },
    });

    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user?.id as string,
        clientId,
        invoiceNumber,
        dueDate: new Date(dueDate),
        taxRate: parseFloat(taxRate) || 0,
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: { items: true, client: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.log("INVOICE ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}