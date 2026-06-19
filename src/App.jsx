import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Calendario from './pages/Calendario'
import Eventos from './pages/Eventos'
import Secretaria from './pages/Secretaria'
import LoginSecretaria from './pages/LoginSecretaria'
import LugarTuristico from './pages/LugarTuristico'
import RegistroTurista from './pages/turista/RegistroTurista'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/calendario"          element={<Calendario />} />
        <Route path="/eventos"             element={<Eventos />} />
        <Route path="/secretaria"          element={<Secretaria />} />
        <Route path="/secretaria/login"    element={<LoginSecretaria />} />
        <Route path="/lugar/:id"           element={<LugarTuristico />} />
        <Route path="/registro"            element={<RegistroTurista />} />
      </Routes>
    </BrowserRouter>
  )
}
