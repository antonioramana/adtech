import { BrowserRouter, Link, NavLink } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
              RetailSpot Ad Manager
            </Link>
            <nav className="flex gap-4 text-sm">
              <NavLink
                to="/"
                end
                className={({ isActive }: { isActive: boolean }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                Campagnes
              </NavLink>
              <NavLink
                to="/campaigns/new"
                className={({ isActive }: { isActive: boolean }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive ? 'bg-emerald-500 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                  }`
                }
              >
                Nouvelle campagne
              </NavLink>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
