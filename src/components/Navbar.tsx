// import { Github } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            S
          </span>

          <span className="text-base font-semibold tracking-tight text-slate-950">
            SA Craft
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? 'text-slate-950'
                  : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tools"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? 'text-slate-950'
                  : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            Tools
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? 'text-slate-950'
                  : 'text-slate-500 hover:text-slate-950'
              }`
            }
          >
            About
          </NavLink>

          <a
            href="https://github.com/suryaahdiyat/sacraft-data-tools"
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar