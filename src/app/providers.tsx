'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root providers wrapper for the application
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}