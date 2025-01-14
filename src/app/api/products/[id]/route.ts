import Product from "@/Models/Product.model";
import { dbConnection } from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request:NextRequest,
    props:{params:Promise<{id:string}>} 
) {
    try {
        const { id } = await props.params;
        await dbConnection();
        const product = await Product.findById(id).lean();
        if(!product) {
            return { status: 404, body: { message: "No product found" } };
        }
        return NextResponse.json({ status: 200, body: product });
    } catch (error) {

        console.error("GET products error: ", error);
        return { status: 500, body: { message: "Internal Server Error Get Specific Product" } };
        
    }

}