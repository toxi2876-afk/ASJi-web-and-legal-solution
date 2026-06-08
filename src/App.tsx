import { ToastProvider } from './components/ui/toast';
import AppRouter from './router';

export default function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}
