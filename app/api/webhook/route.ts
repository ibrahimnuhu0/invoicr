import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const invoiceId = event.data.metadata.invoiceId;
      const reference = event.data.reference;
      const amount = event.data.amount / 100;

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "paid" },
      });

      await prisma.payment.create({
        data: {
          invoiceId,
          amount,
          reference,
          provider: "paystack",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}