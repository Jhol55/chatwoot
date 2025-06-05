import { frontendURL } from 'dashboard/helper/URLHelper.js';
import SettingsWrapper from '../SettingsWrapper.vue';
import Calendars from './Calendars.vue';

const calendarsRoutes = {
  routes: [
    {
      path: frontendURL('accounts/:accountId/settings/calendars'),
      component: SettingsWrapper,
      children: [
        {
          path: '',
          redirect: to => {
            return { name: 'calendars_list', params: to.params };
          },
        },
        {
          path: 'list',
          name: 'calendars_list',
          component: Calendars,
          meta: {
            permissions: ['administrator', 'agent'],
          },
        },
      ],
    },
  ],
};


export default calendarsRoutes;
