import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { mobile, role } = await req.json();
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "unauthorized" },
        { status: 401 },
      );
    }
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { mobile: mobile, role: role },
      {
        new: true,
      },
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, message: "updated role and mobile successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("the error in user route for edit role and mobile is ", error);
    return NextResponse.json(
      { success: false, message: "internal server error" },
      { status: 500 },
    );
  }
}
