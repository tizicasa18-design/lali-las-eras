import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { loginWithGoogle, logout } from '../firebase/auth'

// Barra de navegación que aparece arriba en todas las pantallas.
function Navbar() {
  // menuOpen guarda si el menú del celular está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false)
  // user: la persona que ingresó con Google (o null si nadie ingresó)
  const { user, checking } = useUser()

  async function handleLogin() {
    try {
      await loginWithGoogle()
    } catch (error) {
      // Si cierra la ventanita de Google no pasa nada
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error(error)
        window.alert('No se pudo ingresar. Probá de nuevo.')
      }
    }
  }

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

        {/* Renderizado condicional: si ingresó muestro su foto y "Salir"; si no, "Ingresar" */}
        {!checking && (
          <div className="navbar-user">
            {user ? (
              <>
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="navbar-avatar" referrerPolicy="no-referrer" />
                )}
                <span className="navbar-name">{user.displayName}</span>
                <button className="navbar-toggle navbar-auth" onClick={logout}>
                  Salir
                </button>
              </>
            ) : (
              <button className="navbar-toggle navbar-auth" onClick={handleLogin}>
                Ingresar con Google
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
