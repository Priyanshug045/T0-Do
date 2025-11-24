import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { content, status, start_date, end_date } = await req.json(); // <-- FIXED KEYS

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const result = await getUserId(token);
    const userId = String(result.userId);

    const req_tasks = await prisma.task.findMany({
      where: {
        userId: userId,

        content: content
          ? {
              contains: content,
              mode: "insensitive",
            }
          : undefined,

        status: status || undefined,

        createdAt:
          start_date && end_date
            ? {
                gte: new Date(start_date),
                lte: new Date(end_date),
              }
            : start_date
            ? { gte: new Date(start_date) }
            : end_date
            ? { lte: new Date(end_date) }
            : undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(req_tasks);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Couldn't fetch tasks" },
      { status: 500 }
    );
  }
}
