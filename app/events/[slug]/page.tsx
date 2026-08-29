import { getSimilarEventsBySlug } from "@/app/actions/event.actions";
import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { EventItem } from "@/app/lib/types";
import { formatDate } from "@/app/lib/utils";
import Image from "next/image";
import { redirect, notFound } from "next/navigation"

// export const instant = false;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/* CHILD COMPONENT - EVENT DETAILS COMPONENT */
const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => {
    return (
        <div className="flex-row-gap-2 items-center">
            <Image src={icon} alt={alt} width={17} height={17} />
            <p>{label}</p>
        </div>
    )
}

/* CHILD COMPONENT - EVENT AGENDA COMPONENT */
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
    return (
        <div className="agenda">
            <h2>Agenda</h2>
            <ul>
                {
                    agendaItems.map((el) => <li key={el}>{el}</li>)
                }
            </ul>
        </div>
    )
}

/* CHILD COMPONENT - EVENT TAGS COMPONENT */
const EventTags = ({ tags }: { tags: string[] }) => {
    return (
        <div className="flex gap-1.5 flex-wrap">
            {
                tags.map(tag => <div className="pill" key={tag}>{tag}</div>)
            }
        </div>
    )
}


/* MAIN COMPONENT - SINGLE EVENT PAGE */
async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const resp = await fetch(`${BASE_URL}/api/events/${slug}`)
    const { event } = await resp.json();
    if (!event) {
        return notFound();
    }

    const {
        title,
        description,
        location,
        venue,
        date,
        time,
        overview,
        tags,
        organizer,
        agenda,
        audience,
        image,
        mode } = event;

    const dateLabel = formatDate(date);

    const bookings = 10;
    const similarEvents: EventItem[] = await getSimilarEventsBySlug(slug);


    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className="mt-2">{description}</p>
            </div>
            <div className="details">
                {/* EVENT CONTENT */}
                <div className="content">
                    <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={dateLabel} />
                        <EventDetailItem icon="/icons/clock.svg" alt="calendar" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="calendar" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="calendar" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="calendar" label={audience} />
                    </section>

                    <EventAgenda agendaItems={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About Event Organizers</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>


                {/* BOOKING FORM */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book your spot</h2>
                        <p className="text-sm">{
                            bookings > 0
                                ? `Join ${bookings} people who already booked their spot.`
                                : "Become the first to person to book a spot, there's special perks to it."}</p>

                        <BookEvent eventId={event._id} />
                    </div>
                </aside>
            </div>
            <div className="w-full flex flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {
                        similarEvents.length > 0 && similarEvents.map(((sEvent: EventItem) => {
                            return <EventCard key={sEvent.slug} {...sEvent} />
                        }))
                    }
                </div>
            </div>
        </section>
    )
}

export default page
