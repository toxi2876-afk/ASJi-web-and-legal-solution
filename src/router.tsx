import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CompanyProfile from './pages/CompanyProfile';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/profile',
    element: <CompanyProfile />
  },
  {
    path: '/admin',
    element: <AdminLogin />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
