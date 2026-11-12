import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <p className="footer-logo">LALI: LAS ERAS</p>
          <p>Diario musical de fans. Proyecto no oficial, sin fines comerciales.</p>
        </div>

        <nav className="footer-links" aria-label="Pie de página">
          <Link to="/">Inicio</Link>
          <Link to="/eras">Las eras</Link>
          <Link to="/diario">Mi diario</Link>
        </nav>
      </div>
      <p className="footer-credits">TP2 · Desarrollo Frontend II · UADE · 2026</p>
    </footer>
  )
}

export default Footer
