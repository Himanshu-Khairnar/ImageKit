import User from "@/Models/User.Models";
import { dbConnection } from "@/utils/dbConnection";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return  NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        await dbConnection();
        const existingUser  =await User.findOne({ email: email });

        if(existingUser){
            return NextResponse.json({ error: "User already present" }, { status: 400 });
        }
        await User.create({ email, password ,role:"USER"});

        return NextResponse.json({ message: "User created" },{status: 201});
    } catch (error) {
        console.log("Error in Registration of User", error);
        return NextResponse.json({ message: "Error in Registration of User" }, { status: 501 });
    }
    
}