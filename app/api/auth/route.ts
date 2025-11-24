import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma } from "@/lib/prisma";
import {createToken} from "@/lib/auth";
export async function POST(req:NextRequest){
    try{
        const {Username,Password}=await req.json();
        if(!Username ||  !Password ){
            return NextResponse.json({error:"credentials not match"},{status:400});
        }
        const user = await prisma.user.findFirst({
            where:{ 
                username:Username
            },
        });
        //console.log(user);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(Password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 400 }
            );
        }

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
        return NextResponse.json({error:"user not match"},{status:500});
    }
}
export const GET = () => {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { expires: new Date(0) });
  return res;
};
