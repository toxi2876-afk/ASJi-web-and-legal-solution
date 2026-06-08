import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toast: (props: Omit<ToastProps, 'id'>) => void;
  toasts: ToastProps[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, type = 'success' }: Omit<ToastProps, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      dismiss(id);
    }, 4000);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function Toaster() {
  const context = useContext(ToastContext);
  if (!context) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 min-w-[340px] max-w-[420px]">
      <AnimatePresence>
        {context.toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`glass-dark border rounded-lg p-4 flex items-start gap-3 shadow-card ${
              t.type === 'error' ? 'border-destructive/30' : 'border-gold/30'
            }`}
          >
            <div className="mt-0.5">
              {t.type === 'error' ? (
                <AlertTriangle size={18} className="text-destructive animate-pulse" />
              ) : (
                <CheckCircle size={18} className="text-gold" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-medium text-foreground">{t.title}</h4>
              {t.description && (
                <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => context.dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
