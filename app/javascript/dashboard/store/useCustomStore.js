import { defineStore } from 'pinia';

export const useCustomStore = defineStore('custom', {
  state: () => ({
    teamUnreadCount: 0,
  }),
  actions: {
    setTeamUnreadCount(count) {
      this.teamUnreadCount = count;
    },
  },
});
