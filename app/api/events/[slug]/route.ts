import connectToDatabase from "@/app/lib/mongodb";
import { Event } from "@/database";
import { NextResponse } from "next/server";

// export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/events/[slug]">,
) {
  try {
    const { slug } = await context.params;

    await connectToDatabase();
    const event = await Event.findOne({ slug }).lean().exec();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Failed to fetch event", error);
    return NextResponse.json(
      { message: "Unable to fetch event" },
      { status: 500 },
    );
  }
}
