'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import posthog from 'posthog-js'
import { EventItem } from '../lib/types'

function EventCard(props: EventItem) {
  const handleEventSelection = () => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture('featured_event_selected', {
        event_slug: props.slug,
      })
    }
  }

  return (
    <Link href={'/events/' + props.slug} id='event-card' onClick={handleEventSelection}>
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
