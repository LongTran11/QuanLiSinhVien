import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <Sidebar />
      <main className="ml-60 mt-14 p-6 min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
    </div>
  )
}
