import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthorPage from './pages/AuthorPage'
import HomePage from './pages/HomePage'
import DonateSuggestPage from './pages/DonateSuggestPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/authors/:slug" element={<AuthorPage />} />
        <Route path="/donate-suggest" element={<DonateSuggestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
