import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export const PATCH =async (req:NextRequest)=>{
    try{
        const {status,taskId}= await req.json();
        console.log(status,taskId);
        if (!taskId || !status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 });
        }
        const updatedStatus= await prisma.task.update({
            where:{
                id:taskId
                
            },
            data: { status:status  }
        });
        
        return NextResponse.json(updatedStatus, { status: 200 });
    }catch (err:any){
      
        return NextResponse.json({ error: "Couldn't update status" }, { status: 500 });
    }
}