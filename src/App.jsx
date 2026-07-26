import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import OwnerPage from './pages/OwnerPage'
import PublicCardPage from './pages/PublicCardPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/owner" replace />} />
        <Route path="/owner" element={<OwnerPage />} />
        <Route path="/u/:linkId" element={<PublicCardPage />} />
        <Route path="*" element={<Navigate to="/owner" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
