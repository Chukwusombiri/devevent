import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { EventItem } from '../lib/types'



function EventCard(props: EventItem) {
  return (
    <Link href={'/events/' + props.slug} id='event-card'>
      <Image
        src={props.image}
        alt={props.title}
        width={410}
        height={300}
        className='poster'
      />
      {/* LOCATION */}
      <div className="flex gap-2 items-center justify-start">
        <Image src="/icons/pin.svg" alt='location' width={14} height={14} />
        <p className=''>{props.location}</p>
      </div>
      {/* TITLE */}
      <p className='event-title'>{props.title}</p>
      {/* DATE AND TIME */}
      <div className="datetime">
        <div className="flex gap-2 items-center justify-start">
          <Image src="/icons/calendar.svg" alt='location' width={14} height={14} />
          <p className=''>{props.date}</p>
        </div>
        <div className="flex gap-2 items-center justify-start">
          <Image src="/icons/clock.svg" alt='location' width={14} height={14} />
          <p className=''>{props.time}</p>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
