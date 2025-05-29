import { frontendURL } from 'dashboard/helper/URLHelper.js';
import Services from './Services.vue';

const servicesRoutes = {
  routes: [
    {
      path: frontendURL('accounts/:accountId/services'),
      name: 'services_index',
      component: Services,
      meta: {
        permissions: ['administrator', 'agent'],
      },
    },
  ],
};

export default servicesRoutes;
