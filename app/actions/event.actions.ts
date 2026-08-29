'use server';

import { Event } from "@/database";
import connectToDatabase from "../lib/mongodb";

export async function getSimilarEventsBySlug(slug: string){
    try {
        await connectToDatabase();

        const event = await Event.findOne({ slug }).lean().exec();
        const events = await Event.find({
            slug: { $ne: slug },
            tags: { $in: event?.tags ?? [] },
        }).lean().exec();

        return events.map(({ _id, createdAt, updatedAt, ...similarEvent }) => ({
            ...similarEvent,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}