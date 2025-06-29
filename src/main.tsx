import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { router } from './router';
import { queryClient } from './lib/query';

// Import Why Did You Render in development
if (process.env.NODE_ENV === 'development') {
  import('./lib/wdyr');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
