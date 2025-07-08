import ThemeButton from '@/components/ui/theme-button'
import UserCart from '@/components/user-cart'
import { getServerSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async () => {
	const session = await getServerSession()
	if (!session) { redirect('/auth/login') }


	return (
		<div className='flex h-screen w-full items-center justify-center flex-col gap-4'>
			<ThemeButton />
			<UserCart />
		</div>
	)
}

export default Home