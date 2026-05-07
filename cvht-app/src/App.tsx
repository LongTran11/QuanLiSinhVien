import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Grades from './pages/Grades'
import Forum from './pages/Forum'
import Messages from './pages/Messages'
import Stats from './pages/Stats'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Students />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
