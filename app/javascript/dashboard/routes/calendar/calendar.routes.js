import { frontendURL } from 'dashboard/helper/URLHelper.js';
import Calendar from './Calendar.vue';

const calendarRoutes = {
  routes: [
    {
      path: frontendURL('accounts/:accountId/calendar'),
      name: 'calendar_index',
      component: Calendar,
      meta: {
        permissions: ['administrator', 'agent'],
      },
    },
  ],
};

export default calendarRoutes;
