import Order from "@/Models/Order.model";
import { dbConnection } from "@/utils/dbConnection";
import { authOptions } from "@/utils/nextauth";
import { create } from "domain";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if(!session)
        {
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }
        await dbConnection();

       const orders = await Order.find({userId:session.user.id}).populate({path:"userId",select:"name imageUrl" ,options:{strictPopulate:false}}).sort({createAt:-1}).lean()

        return NextResponse.json({orders},{status:200});
    } catch (error) {
        console.log("Error in getting orders", error);
        return NextResponse.json({message:"Internal Server Error in getting orders"},{status:500});
    }
}