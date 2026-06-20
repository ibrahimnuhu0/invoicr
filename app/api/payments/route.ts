import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, amount, invoiceId } = await req.json();

    if (!email || !amount || !invoiceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          callback_url: `${process.env.NEXTAUTH_URL}/invoice/${invoice.publicToken}`,
          metadata: {
            invoiceId,
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.log("PAYMENT ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}