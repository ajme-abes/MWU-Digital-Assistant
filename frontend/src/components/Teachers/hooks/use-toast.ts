import { useState, useCallback } from 'react';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

let toastFn: (options: ToastOptions) => void;

export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toast = useCallback(({ title, description, duration = 3000 }: ToastOptions) => {
    const id = Date.now();
    setToasts(prev => [...prev, { title, description }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== id));
    }, duration);
  }, []);

  toastFn = toast;
  return { toast, toasts };
}

export const toast = (options: ToastOptions) => toastFn?.(options); 