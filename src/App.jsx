import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchOverlay from './components/SearchOverlay'
import Home from './pages/Home'
import Calendario from './pages/Calendario'
import Eventos from './pages/Eventos'
import Secretaria from './pages/Secretaria'
import LoginSecretaria from './pages/LoginSecretaria'
import LugarTuristico from './pages/LugarTuristico'
import RegistroTurista from './pages/turista/RegistroTurista'

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <BrowserRouter>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/calendario"          element={<Calendario />} />
        <Route path="/eventos"             element={<Eventos />} />
        <Route path="/secretaria"          element={<Secretaria />} />
        <Route path="/secretaria/login"    element={<LoginSecretaria />} />
        <Route path="/lugar/:id"           element={<LugarTuristico />} />
        <Route path="/registro"            element={<RegistroTurista />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
