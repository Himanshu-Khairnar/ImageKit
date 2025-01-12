import { connect } from "http2";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PassThrough } from "stream";
import { dbConnection } from "./dbConnection";
import User from "@/Models/User.Models";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email:{label: "Email", type: "email",placeholder:"Email"},
                password:{label: "Password", type: "password",placeholder:"Password"},
            },
            async authorize(credentials){ 
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing credentials");
                }
                try{
                    await dbConnection();
                    const user = await User.findOne({email: credentials.email });
                    if(!user){
                        throw new Error("User not found");
                    }

                    const isValid = await bcrypt.compare(credentials.password , user.password);

                    if(!isValid){
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role:user.role,
                    }

                }catch(error){
                    console.log("Auth errorr", error);
                    throw error;
                }
            }
        }),
    ],
    callbacks:{
        async jwt({token, user}){
            if(user ){
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({session, token}){
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            return session;
        }
    },
    pages:{
        signIn: "/login",
        error: "/login",
    },
    session:{
        strategy: "jwt",
        maxAge:30*24*60*60
    },
    secret: process.env.SECRET,
}    

