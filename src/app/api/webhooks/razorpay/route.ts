import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnection } from "@/utils/dbConnection";
import Order from "@/Models/Order.model";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("shad256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");
    if(expectedSignature !== signature)
    {
        return NextResponse.json({ error:"Invalid signature" }, { status: 400 });
    }
    const event = JSON.parse(body);
    await dbConnection();
    
    if(event.event === "payment.captured")
    {
        const payment = event.payload.payment.entity;
          const order = await Order.findOneAndUpdate(
            { razorpayOrderId: event.payload.payment.entity.id },
            { status: "completed", razorpayPaymentId: payment.id }
          ).populate([
            { path: "productId", select: "name" },
            { path: "userId", select: "email" },
          ]);

          if (order) {
            const transporter = nodemailer.createTransport({
              service: process.env.MAILTRAP_SERVICE!, //mailtrap,
              port: "2525",
              auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASSWORD!,
              },
            });

            await transporter.sendMail({
              from: process.env.MAILTRAP_USER!,
              to: order.userId.email,
              subject: "Order Placed",
              text: `Your order for ${order.productId.name} has been placed successfully!`,
            });
          }

    }

  
    return NextResponse.json({ message:"sucess" }, { status: 200 });
  } catch (error) {
    console.log("Error in razorpay webhook", error);
    return NextResponse.json({ message:"Internal Server Error in razorpay webhook" }, { status: 500 });
  }
}
