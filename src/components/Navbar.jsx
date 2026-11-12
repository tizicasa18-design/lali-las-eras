import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Barra de navegación que aparece arriba en todas las pantallas.
function Navbar() {
  // menuOpen guarda si el menú del celular está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false)

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        LALI: LAS ERAS
      </Link>

      {/* Este botón solo se ve en pantallas chicas */}
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-controls="main-menu"
      >
        {menuOpen ? 'Cerrar' : 'Menú'}
      </button>

      <nav id="main-menu" className={menuOpen ? 'navbar-links open' : 'navbar-links'}>
        <NavLink to="/" end onClick={closeMenu}>
          Inicio
        </NavLink>
        <NavLink to="/eras" onClick={closeMenu}>
          Las eras
        </NavLink>
        <NavLink to="/diario" onClick={closeMenu}>
          Mi diario
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
