import Order from "@/Models/Order.model";
import { dbConnection } from "@/utils/dbConnection";
import { authOptions } from "@/utils/nextauth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { status: 401, body: { message: "Unauthorized" } };
        }

        const { productId, variant } = await request.json();
        if (!productId || !variant) {
            return { status: 400, body: { message: "Bad Request" } };
        }

        await dbConnection();

        //create razorpay order
        const order = await razorpay.orders.create({
            amount: Math.round(variant.price * 100),
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: {
                productId: productId.toString(),
                variant: variant._id.toString(),
            }
        });

        const newOrder = await Order.create({
            user: session.user.id,
            productId,
            variant,
            amount: Math.round(variant.price * 100),
            razorpayOrderId: order.id,
            status: "pending",
        })

        return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, dbOrderId: newOrder._id }, { status: 200 });
    } catch (error) {
        console.error("POST orders error: ", error);
        return { status: 500, body: { message: "Internal Server Error Create Order" } };
    }
}