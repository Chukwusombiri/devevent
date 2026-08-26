import "server-only";
import mongoose, { type HydratedDocument, type Model, Schema, Types } from "mongoose";
import { Event } from "./event.model";

export interface BookingDocument {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    // Store the relationship as an ObjectId and index it for event lookups.
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [emailPattern, "Please provide a valid email address."],
    },
  },
  { timestamps: true },
);

bookingSchema.pre("save", async function (this: HydratedDocument<BookingDocument>) {
  // A booking cannot be saved for an event that no longer exists.
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Cannot create a booking for a non-existent event.");
  }
});

bookingSchema.index({ eventId: 1 });

const existingBooking = mongoose.models.Booking as Model<BookingDocument> | undefined;

export const Booking =
  existingBooking ?? mongoose.model<BookingDocument>("Booking", bookingSchema);
