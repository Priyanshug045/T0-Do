import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";


// CREATE TASK
export const POST = async (req: NextRequest) => {

  try {
    const { Content } = await req.json();
    // console.log(Content);
    const token = req.cookies.get("token")?.value;
    //console.log(token);
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const result = await getUserId(token);
    //console.log(result);
    if (!result.valid) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const userId = String(result.userId);
    // console.log(userId);

    const tasks = await prisma.task.create({
      data: {
       content: Content,
        status: "todo" as any,
        userId,
      },
    });
    // console.log(tasks);

    return NextResponse.json({sucess:true}, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Couldn't create task" }, { status: 500 });
  }
};



// GET ALL TASKS OF USER
export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const result = await getUserId(token);
    if (!result.valid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userId = result.userId;

    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    return NextResponse.json(tasks, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Couldn't fetch tasks" }, { status: 500 });
  }
};



// DELETE TASK
export const DELETE = async (req: NextRequest) => {
  try {
    const { taskId } = await req.json();
    if (!taskId ) {
            return NextResponse.json({ error: "Can't find task to be deleted" }, { status: 400 });
        }
    const deleted = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(deleted, { status: 200 });

  } catch (err:any) {
    return NextResponse.json({ error: "Couldn't delete task" }, { status: 500 });
  }
};


//Edit Task
export const PATCH =async (req:NextRequest)=>{
    try{
        const {editedText,taskId}= await req.json();
        console.log(editedText);
        if (!taskId || !editedText) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }
        const edited= await prisma.task.update({
            where:{
                id:taskId
                
            },
            data: { content:editedText  }
        });
        console.log(edited);
        return NextResponse.json(edited, { status: 200 });
    }catch (err:any){
      console.error("PATCH Error:", err);
        return NextResponse.json({ error: "Couldn't edit task" }, { status: 500 });
    }
}