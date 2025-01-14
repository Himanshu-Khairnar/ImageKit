import Product, { IProduct } from "@/Models/Product.model";
import { dbConnection } from "@/utils/dbConnection";
import { authOptions } from "@/utils/nextauth";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const db = dbConnection();
        const products = await Product.find().lean();

        if(!products || products.length === 0) {
            return { status: 404, body: { message: "No products found" } };
        }

        return { status: 200, body: products };
    } catch (error) {
        console.error("GET products error: ", error);
        return { status: 500, body: { message: "Internal Server Error" } };
    }
}

export async function POST(request:Request ) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user?.role!=="admin") {
            return { status: 401, body: { message: "Unauthorized" } };
        }

        await dbConnection();

        const body:IProduct = await request.json();
        if(!body.name || !body.imageUrl || !body.description || body.variants.length === 0) {
            return { status: 400, body: { message: "Invalid request" } };
        }
        const newProduct =  Product.create(body);
        return { status: 201, body: newProduct };
    } catch (error) {
        console.error("POST products error: ", error);
        return { status: 500, body: { message: "Internal Server Error While Creating Product" } };
    }
}