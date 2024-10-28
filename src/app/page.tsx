import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation';
import React from 'react'

const Home = async () => {
  await verifySession();
  await redirect('/panel')
  return (
    <div>Valid if login or not</div>
  )
}

export default Home