import ExploreBtn from "./components/ExploreBtn"
import EventCard from "./components/EventCard";
import { events } from "./lib/constants";

function page() {
  return (
    <div>
      <h1 className="text-center">One Stop Hub for Dev Events <br /> You Can't Afford To Miss</h1>
      <p className="text-center mt-5">Meet-ups, Hackathons, Code presentations - all in one place.</p>
      <ExploreBtn />
      <div className="mt-20 space-y-2">
        <h3>Featured Events</h3>
        <ul className="events list-none" role="listbox">
          {
            events.map((it, idx) => <EventCard key={idx} {...it} />)
          }
        </ul>
      </div>
    </div>
  )
}

export default page
