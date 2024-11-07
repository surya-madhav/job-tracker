import { type ToastProps as RadixToastProps } from '@radix-ui/react-toast';
import { Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport, } from '@radix-ui/react-toast';
import { useToast } from './use-toast';
export interface ToastProps extends RadixToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export {Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
}

def useToast