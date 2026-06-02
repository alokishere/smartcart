import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <AdminDashboardLayout user={JSON.parse(JSON.stringify(session.user))}>
      {children}
    </AdminDashboardLayout>
  )
}
