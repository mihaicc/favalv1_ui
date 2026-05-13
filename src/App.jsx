import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthorPage from './pages/AuthorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authors/:slug" element={<AuthorPage />} />
        <Route path="*" element={<Navigate to="/authors/unknown" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
