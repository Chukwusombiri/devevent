'use client';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

function ExploreBtn() {
    return (
        <button
            id='explore-btn'
            type='button'
            className='mt-7 mx-auto'
            onClick={console.log}
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
