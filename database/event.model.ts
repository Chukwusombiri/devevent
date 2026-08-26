import "server-only";
import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";

export interface EventDocument {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const nonEmptyString = {
  type: String,
  required: true,
  trim: true,
  minlength: 1,
  maxLength: 100
};

const nonEmptyStringArray = {
  type: [String],
  required: true,
  validate: {
    validator: (values: string[]): boolean =>
      Array.isArray(values) &&
      values.length > 0 &&
      values.every((value) => typeof value === "string" && value.trim().length > 0),
    message: "At least one non-empty value is required.",
  },
};

const eventSchema = new Schema<EventDocument>(
  {
    title: nonEmptyString,
    slug: { type: String },
    description: nonEmptyString,
    overview: nonEmptyString,
    image: nonEmptyString,
    venue: nonEmptyString,
    location: nonEmptyString,
    date: nonEmptyString,
    time: nonEmptyString,
    mode: nonEmptyString,
    audience: nonEmptyString,
    agenda: nonEmptyStringArray,
    organizer: nonEmptyString,
    tags: nonEmptyStringArray,
  },
  { timestamps: true },
);

function normalizeTime(value: string): string {
  const time = value.trim().toUpperCase();
  const twelveHourMatch = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/.exec(time);

  if (twelveHourMatch) {
    const [, hourValue, minute, period] = twelveHourMatch;
    const hour = Number(hourValue);

    if (hour < 1 || hour > 12 || Number(minute) > 59) {
      throw new Error("Time must be a valid clock time.");
    }

    const hour24 = (hour % 12) + (period === "PM" ? 12 : 0);
    return `${String(hour24).padStart(2, "0")}:${minute}`;
  }

  const twentyFourHourMatch = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time);

  if (!twentyFourHourMatch) {
    throw new Error("Time must use HH:mm or h:mm AM/PM format.");
  }

  const [, hourValue, minute] = twentyFourHourMatch;
  const hour = Number(hourValue);

  if (hour > 23 || Number(minute) > 59) {
    throw new Error("Time must be a valid clock time.");
  }

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

eventSchema.pre("save", function (this: HydratedDocument<EventDocument>) {
  // Generate a stable URL slug only when the source title changes.
  if (this.isModified("title")) {
    this.slug = this.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Store a parseable event date and a consistent 24-hour time value.
  const parsedDate = new Date(this.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Date must be a valid date.");
  }
  this.date = parsedDate.toISOString();
  this.time = normalizeTime(this.time);
});

// Enforce URL identity at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

const existingEvent = mongoose.models.Event as Model<EventDocument> | undefined;

export const Event =
  existingEvent ?? mongoose.model<EventDocument>("Event", eventSchema);
