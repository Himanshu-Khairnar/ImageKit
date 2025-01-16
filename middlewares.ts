import {withAuth} from "next-auth/middleware"
import {NextApiRequest, NextApiResponse} from "next"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req){
        return NextResponse.next()
    },
    {
        callbacks:{
            authorized:({token,req})=>{
                const {pathname} = req.nextUrl


                if(
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/login") ||
                    pathname.startsWith("/register")
                )
                {
                    return true
                }

                if(
                    pathname.startsWith("/") ||
                    pathname.startsWith("/api/products") ||
                    pathname.startsWith("/prodcuts") 
                )
                {
                    return true
                }
                if(pathname.startsWith("/api/webhooks") || pathname.startsWith("/orders"))

                if(pathname.startsWith("/admin")){
                    return token?.role === "admin"
                }

                return !!token
            }
        }
    }
)

export const config = {
    matcher:[

    ]
}