import { type ToastProps as RadixToastProps } from '@radix-ui/react-toast';

export interface ToastProps extends RadixToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}