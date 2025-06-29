import { createRouter } from '@tanstack/react-router';

// Import routes
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as instructionsRoute } from './routes/instructions';
import { Route as speciesRoute } from './routes/species';
import { Route as recipesRoute } from './routes/recipes';
import { Route as impressumRoute } from './routes/impressum';
import { Route as privacyPolicyRoute } from './routes/privacy-policy';
import { Route as termsUseRoute } from './routes/termsuse';

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  instructionsRoute,
  speciesRoute,
  recipesRoute,
  impressumRoute,
  privacyPolicyRoute,
  termsUseRoute,
]);

// Create the router instance
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
