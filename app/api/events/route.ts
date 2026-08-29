import connectToDatabase from '@/app/lib/mongodb';
import { Event } from '@/database';
import type { EventDocument } from '@/database/event.model';
import type { NextApiRequest } from 'next';
import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';


export async function POST(request: NextRequest) {

    try {
        await connectToDatabase();

        try {
            // for application/json content type
             /* const event = (await request.json()) as Omit<EventDocument, 'createdAt' | 'updatedAt'>;
            const createdEvent = await Event.create(event); */

            // for formdata or multipart/formdata content type
            const form = await request.formData();
            const event = Object.fromEntries(form.entries());
            const file = form.get("image") as File;
            if (!file) {
                return NextResponse.json({ message: "Event has invalid image" }, { status: 400 })
            }

            const arrBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrBuffer);

            const uploadRes = await new Promise((res, rej) => {
                cloudinary.uploader.upload_stream({
                    resource_type: 'image',
                    folder: 'devevents'
                }, (failure, success) => {
                    if (failure) rej(failure);
                    res(success);
                }).end(buffer);
            });

            event.image = (uploadRes as { secure_url: string }).secure_url;           
            event.tags = JSON.parse(form.get('tags') as string);
            event.agenda = JSON.parse(form.get('agenda') as string);

            const createdEvent = await Event.create(event);

            return NextResponse.json({ message: "successful", event: createdEvent }, { status: 201 });
        } catch (err) {
            return NextResponse.json({ message: "Invalid JSON data format", error: err instanceof Error ? err.message : "unknown" }, { status: 400 })
        }
    } catch (e) {
        console.log("============================ New Error ===============================")
        console.log(e);
        return NextResponse.json({ message: "Unable to create event", error: e instanceof Error ? e.message : "unknown" }, { status: 500 })
    }
}


export async function GET () {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Event fetching successful", events });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Event fetching failed" }, { status: 500 })
    }
}