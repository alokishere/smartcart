import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"

const AdminDashboard = async () => {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <AdminDashboardLayout user={JSON.parse(JSON.stringify(session.user))} />
  )
}

export default AdminDashboard
