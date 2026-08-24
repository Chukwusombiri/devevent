import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function NavBar() {
  return (
    <header>
      <nav>
        <Link href={'/'} className='logo'>
            <Image src="/icons/logo.png" alt="App Logo" width={24} height={24} />
            <p>DevEvents</p>
        </Link>
        <ul>
            <Link href={'/'}>Home</Link>
            <Link href={'/'}>Events</Link>
            <Link href={'/'}>Create New</Link>            
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
