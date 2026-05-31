import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import User from "@/models/user.model"
import { redirect } from "next/navigation"
import EditMobileRole from "@/components/EditMobileRole"
import Nav from "@/components/Nav"
const page = async () => {
  await dbConnect()
  const session = await auth()

  const user = await User.findById(session?.user?.id)
  if (!user) {
    redirect('/login')
  }
  const isCompleted = !user.mobile || !user.role || (!user.mobile && user.role == "user")

  if(isCompleted){
    return <EditMobileRole/>
  }
  return (
    <>
      <Nav user={JSON.parse(JSON.stringify(user))} />
    </>
  )
}

export default page