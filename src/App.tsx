import React from 'react';
import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { loginUser } from './api/services';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { KanbanBoard } from './components/KanbanBoard';

const readStoredUser = () => {
  if (typeof window === 'undefined') return null;

  const rawUser = window.localStorage.getItem('user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

function RootLayout() {
  const hasToken = typeof window !== 'undefined' && !!window.localStorage.getItem('token');

  const handleDemoLogin = async () => {
    try {
      const response = await loginUser({
        email: 'alice@acme.com',
        password: 'Password123!',
      });

      window.localStorage.setItem('token', response.token);
      window.localStorage.setItem('tenantId', response.user.tenantId);
      window.localStorage.setItem('user', JSON.stringify(response.user));
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('tenantId');
    window.localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            activeProps={{
              className: 'bg-slate-900 text-white hover:bg-slate-800 hover:text-white',
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/kanban"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            activeProps={{
              className: 'bg-slate-900 text-white hover:bg-slate-800 hover:text-white',
            }}
          >
            Kanban Board
          </Link>

          <div className="ml-auto">
            {hasToken ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDemoLogin}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Demo Login
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/dashboard" replace />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: AnalyticsDashboard,
});

const KanbanRouteComponent = () => {
  const user = readStoredUser();
  return <KanbanBoard tenantId={user?.tenantId ?? 'workspace-demo'} />;
};

const kanbanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kanban',
  component: KanbanRouteComponent,
});

const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute, kanbanRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;