"use server";

import { Booking } from "@/database";
import connectToDatabase from "../lib/mongodb";

export async function createBooking({ eventId, email }: { eventId: string, email: string }) {
    try {
        await connectToDatabase();
        const booking = await Booking.create({ eventId, email });
        const plainBooking = booking.toObject();

        return {
            success: true,
            booking: plainBooking
        }
    } catch (err: unknown) {
        console.log(err);
        return { success: false, message: err instanceof Error ? err.message : "Unable to create booking" }
    }
}