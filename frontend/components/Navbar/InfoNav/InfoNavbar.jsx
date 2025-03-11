import React from 'react'
import { Link } from 'react-router-dom'

const InfoNavbar = () => {
  return (
    <nav className='flex justify-around w-full  bg-green-400 h-40'>
      <div>
        My Website
      </div>
      <ul>
        <li className="px-2">
          <Link to="/" className="text-black hover:text-yellow-300 transition duration-300 ease-in-out">Home</Link>
        </li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </nav>
  )
}

export default InfoNavbar