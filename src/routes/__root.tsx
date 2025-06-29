import { createRootRoute, Outlet, Link } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

export const rootRoute = Route;

function RootComponent() {
  return (
    <div className='app-root'>
      {/* Main navigation */}
      <nav className='main-nav'>
        <Link to='/' className='nav-link'>
          Home
        </Link>
        <Link to='/instructions' className='nav-link'>
          How It Works
        </Link>
        <Link to='/species' className='nav-link'>
          Wild Species
        </Link>
        <Link to='/recipes' className='nav-link'>
          Recipes
        </Link>
      </nav>

      {/* Main content */}
      <main className='main-content'>
        <Outlet />
      </main>

      {/* Footer navigation */}
      <footer className='footer-nav'>
        <Link to='/impressum' className='footer-link'>
          Impressum
        </Link>
        <Link to='/privacy-policy' className='footer-link'>
          Privacy Policy
        </Link>
        <Link to='/termsuse' className='footer-link'>
          Terms of Use
        </Link>
      </footer>
    </div>
  );
}
