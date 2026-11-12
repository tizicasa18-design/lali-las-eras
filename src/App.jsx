import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Eras from './pages/Eras'
import EraDetail from './pages/EraDetail'
import MyDiary from './pages/MyDiary'
import NotFound from './pages/NotFound'

// App arma la estructura general: menú arriba, la pantalla que corresponda y el pie.
// Cada Route conecta una dirección (path) con una pantalla (element).
function App() {
  return (
    <BrowserRouter>
      {/* Al cambiar de página, vuelve arriba de todo */}
      <ScrollToTop />
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eras" element={<Eras />} />
          <Route path="/eras/:albumId" element={<EraDetail />} />
          <Route path="/diario" element={<MyDiary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
