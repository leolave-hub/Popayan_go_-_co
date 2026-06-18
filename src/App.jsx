import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RegistroTurista from './pages/turista/RegistroTurista'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<RegistroTurista />} />
      </Routes>
    </BrowserRouter>
  )
}
