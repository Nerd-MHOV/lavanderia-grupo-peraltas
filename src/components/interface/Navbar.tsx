'use client'
import { useSidebar } from '@/context/sidebar.context';
import { CircleHelp, Menu } from 'lucide-react';
import React from 'react'


const Navbar = () => {
  const { dispatch } = useSidebar();
  return (
    <div className='flex items-center justify-between p-2 '>
      <span
        className='flex text-panelBlue items-center justify-center cursor-pointer transition-all'
        onClick={() => dispatch!({ type: 'TOGGLE' })}>
        <Menu height={25} width={25} />
      </span>
      <span
        className='flex text-panelBlue tems-center justify-center cursor-pointer transition-all'
      >
        <CircleHelp height={25} width={25} />
      </span>
    </div>
  )
}

export default Navbar