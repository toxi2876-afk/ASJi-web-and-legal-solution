import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Index = lazy(() => import('./pages/Index'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#07090c] flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 w-16 h-16 border border-dashed border-gold/40 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
        {/* Pulsing light */}
        <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center border border-gold/15 shadow-[0_0_20px_rgba(231,172,35,0.1)]">
          <Loader2 size={24} className="text-gold animate-spin" />
        </div>
        <p className="mt-4 text-[10px] uppercase font-mono tracking-widest text-[#e7ac23] animate-pulse">
          Loading ASJi Workspace...
        </p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Index />
      </Suspense>
    )
  },
  {
    path: '/profile',
    element: (
      <Suspense fallback={<PageLoader />}>
        <CompanyProfile />
      </Suspense>
    )
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLogin />
      </Suspense>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminDashboard />
      </Suspense>
    )
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    )
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
