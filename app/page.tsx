import ExploreBtn from "./components/ExploreBtn"
import EventCard from "./components/EventCard";
import { EventItem } from "./lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const instant = false;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function page() {
  'use cache';
  cacheLife('hours');
  cacheTag('events')

  const res = await fetch(`${BASE_URL}/api/events`);
  const { events } = await res.json();
  
  return (
    <div>
      <h1 className="text-center">One Stop Hub for Dev Events <br /> You Can't Afford To Miss</h1>
      <p className="text-center mt-5">Meet-ups, Hackathons, Code presentations - all in one place.</p>
      <ExploreBtn />
      <div className="mt-20 space-y-2">
        <h3>Featured Events</h3>
        <ul className="events list-none" role="listbox">
          {
            (events && events.length > 0) && events.map((event: EventItem) => <li key={event.slug}>              
              <EventCard {...event} />
            </li>)
          }
        </ul>
      </div>
    </div>
  )
}

export default page
