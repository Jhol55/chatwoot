<script setup>
import { ref, computed, watchEffect, watch } from 'vue';
import ConversationApi from 'dashboard/api/inbox/conversation';
import { useMapGetter } from 'dashboard/composables/store.js';

const props = defineProps({
  to: { type: String, default: '' },
  label: { type: String, default: '' },
  labelColor: { type: String, default: '' },
  shouldTruncate: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  warningIcon: { type: String, default: '' },
  showChildCount: { type: Boolean, default: false },
  childItemCount: { type: Number, default: 0 },
});

const conversationStats = useMapGetter('conversationStats/getStats');
const customConversationStats = ref({ mine_count: 0, unassigned_count: 0, all_count: 0 });

const routeInfo = computed(() => {
  const parts = props.to?.split('/')?.filter(Boolean);
  const inboxIndex = parts.indexOf('inbox');
  const teamIndex = parts.indexOf('team');

  if (teamIndex !== -1 && parts.length > teamIndex + 1) {
    return { type: 'team', id: parts[teamIndex + 1] };
  } else if (inboxIndex !== -1 && parts.length > inboxIndex + 1) {
    return { type: 'inbox', id: parts[inboxIndex + 1] };
  }

  return { type: null, id: null };
});

watchEffect(async () => {
  const { type, id } = routeInfo.value;

  if (!id) return;

  try {
    const { data } = await ConversationApi.meta(
      type === 'team' ? { teamId: id } : { inboxId: id }
    );
    customConversationStats.value = data.meta;
  } catch (e) {}
});

watch(
  () => conversationStats.value,
  async (_, __, onCleanup) => {
    const { type, id } = routeInfo.value;

    if (!id) return;

    const controller = new AbortController();
    onCleanup(() => controller.abort());

    try {
      const { data } = await ConversationApi.meta(
        type === 'team' ? { teamId: id } : { inboxId: id }
      );
      customConversationStats.value = data.meta;
    } catch (e) {}
  },
  { immediate: true, deep: true }
);


const displayedAllCount = computed(() => {
  return customConversationStats.value?.all_count || 0;
});

const isCountZero = computed(() => props.childItemCount === 0);
const menuTitle = computed(() => (props.shouldTruncate ? props.label : ''));
</script>

<template>
  <router-link
    v-slot="{ href, isActive, navigate }"
    :to="to"
    custom
    active-class="active"
  >
    <li
      class="h-7 my-1 hover:bg-slate-25 hover:text-bg-50 flex items-center px-2 rounded-md dark:hover:bg-slate-800"
      :class="{
        'bg-woot-25 dark:bg-slate-800': isActive,
        'text-ellipsis overflow-hidden whitespace-nowrap max-w-full': shouldTruncate,
      }"
      @click="navigate"
    >
      <a
        :href="href"
        class="inline-flex text-left max-w-full w-full items-center"
      >
        <span
          v-if="icon"
          class="inline-flex items-center justify-center w-4 rounded-sm bg-slate-100 dark:bg-slate-700 p-0.5 mr-1.5 rtl:mr-0 rtl:ml-1.5"
        >
          <fluent-icon
            class="text-xxs text-slate-700 dark:text-slate-200"
            :class="{ 'text-woot-500 dark:text-woot-500': isActive }"
            :icon="icon"
            size="12"
          />
        </span>

        <span
          v-if="labelColor"
          class="inline-flex rounded-sm bg-slate-100 h-3 w-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 border border-slate-50 dark:border-slate-900"
          :style="{ backgroundColor: labelColor }"
        />

        <div class="relative items-center flex overflow-hidden whitespace-nowrap text-ellipsis w-full justify-between">
          <span
            :title="menuTitle"
            class="text-sm text-slate-700 dark:text-slate-100 capitalize"
            :class="{
              'text-woot-500 dark:text-woot-500': isActive,
              'text-ellipsis overflow-hidden whitespace-nowrap max-w-full': shouldTruncate,
            }"
          >
            {{ label }}
          </span>

          <div
            class="absolute right-0 top-0 flex justify-center items-center rounded-md text-xxs h-full min-w-[20px] bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-100"
            :class="{'!bg-[#2781f61a] !text-woot-500 dark:!text-woot-500': isActive}"
          >
            <span class="text-xxs">
              {{ displayedAllCount }}
            </span>
          </div>

          <span
            v-if="showChildCount"
            class="bg-slate-50 dark:bg-slate-700 rounded-full min-w-[18px] justify-center items-center flex text-xxs mx-1 py-0 px-1"
            :class="isCountZero
              ? 'text-slate-300 dark:text-slate-500'
              : 'text-slate-700 dark:text-slate-50'"
          >
            {{ childItemCount }}
          </span>
        </div>

        <span
          v-if="warningIcon"
          class="inline-flex mr-1 bg-red-50 dark:bg-red-900 p-0.5 rounded-sm"
        >
          <fluent-icon
            v-tooltip.top-end="$t('SIDEBAR.REAUTHORIZE')"
            class="text-xxs text-red-500 dark:text-red-300"
            :icon="warningIcon"
            size="12"
          />
        </span>
      </a>
    </li>
  </router-link>
</template>
