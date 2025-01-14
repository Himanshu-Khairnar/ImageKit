"use client"
import React from "react";
import { ImageKitProvider, IKImage } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
 
export default function Providers({ children }:{children: React.ReactNode}) {
    const authenticator = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/imagekit-auth");

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

             return response.json();
        } catch (error) {
            throw new Error(`Authentication request failed: ${error}`);
        }
    };
    return(
        <SessionProvider refetchInterval={5*60}>
        <ImageKitProvider 
        urlEndpoint={urlEndpoint} 
        publicKey={publicKey} 
        authenticator={authenticator}>
            {children}
        </ImageKitProvider>
        </SessionProvider>
    )

}