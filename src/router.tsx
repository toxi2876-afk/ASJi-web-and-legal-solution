import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />
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
