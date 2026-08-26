'use client'

import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import posthog from 'posthog-js'

function ExploreBtn() {
    const handleExplore = () => {
        if (
            process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
            process.env.NEXT_PUBLIC_POSTHOG_HOST
        ) {
            posthog.capture('event_exploration_started')
        }
    }

    return (
        <button
            id='explore-btn'
            type='button'
            className='mt-7 mx-auto'
            onClick={handleExplore}
        >
            <Link href={`#events`}>
                Explore Now
                <Image
                    src='/icons/arrow-down.svg'
                    alt='Arrow-down-icon'
                    width={24}
                    height={24}
                />
            </Link>
        </button>
    )
}

export default ExploreBtn
