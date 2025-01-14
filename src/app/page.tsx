import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation';

const Home = async () => {
  await verifySession();
  redirect('/panel')
  // return (
  //   <div>Valid if login or not</div>
  // )
}

export default Home