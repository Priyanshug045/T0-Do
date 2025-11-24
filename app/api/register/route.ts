import { findFirst } from '../../../node_modules/effect/src/Chunk';
import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {createToken} from "@/lib/auth";
import {prisma } from "@/lib/prisma";
export async function POST(req:NextRequest){
    try{
        const {Username,Name,Password,PhoneNo,lastName,Email}=await req.json();
        if(!Username || !Name || !Password || !PhoneNo || !lastName  || !Email){
            return NextResponse.json({error:"error"},{status:400});
        }
        
        const hashpassword=await bcrypt.hash(Password,10);
       
        const existingUser=await prisma.user.findFirst({
            where:{
                username:Username
            }
        });
        
        
        if(existingUser){
            return NextResponse.json({error:"user already exists"},{status:400});
        }
        const user=await prisma.user.create({
            data:{
                username:Username,
                name:Name,
                password:hashpassword,
                phoneno:PhoneNo,
                lastname:lastName,
                email:Email
            }
        });
        
        const token=await createToken(user);
        
        const result= NextResponse.json(user,{status:201});
        result.cookies.set({
            name:"token",
            value:token,
            httpOnly:false,
            secure:process.env.NODE_ENV==="production",
            sameSite:"lax",
            path:"/",
            maxAge:60*60*24*7
        });

        return result;

    }catch(err:any){
        console.error("Signup Error:", err);
        return NextResponse.json({error:"user can't be created"},{status:500});
    }
}


