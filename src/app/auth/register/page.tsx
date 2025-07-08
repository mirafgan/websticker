import SignUp from '@/components/auth/sign-up'
import { getServerSession } from '@/server/auth'
import { redirect } from 'next/navigation'


const page = async () => {
    const session = await getServerSession()
    if (session) { redirect('/') }

    console.log(session)

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <SignUp />
        </div>
    )
}

export default page