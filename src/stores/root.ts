import { defineStore } from 'pinia'
import { Task } from '../Interfaces/Task';
import { computed, ref, watch } from 'vue';

import { Category } from '../Interfaces/Category';
import { Board } from '../Interfaces/Board';
import { Workspace } from '../Interfaces/Workspace';
import { Notification, NotificationStrict } from '../Interfaces/Notification';
import { useCategoryStore } from './category';
import { useTaskStore } from './task';
import Tabs from '../enums/TabsEnum';
import { useBoardStore } from './board';
import User from '../Interfaces/User';
import { useTipsStore } from './tips';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { OperationLog } from '../Interfaces/OperationLog';
import { updateCurrentEntities } from '../helpers/updateCurrentEntities';
import { OperationLogs } from '../Interfaces/OperationLogs';

dayjs.extend(utc);
dayjs.extend(timezone);

export const useRootStore = defineStore('root', () => {
  const CATEGORY_STORE = useCategoryStore()
  const TASK_STORE = useTaskStore()
  const BOARD_STORE = useBoardStore()
  const TIPS_STORE = useTipsStore()
  
  const user = ref<User>({
    _id: '',
    username: '',
    email: '',
    role: '',
    hasAvatar: false,
    subscription: "trial",
    subscription_until: new Date(),
    generations_balance: 0,
    avatar_color: '',
    is_tips_completed: false,
    payment_method_id: '',
    ya_id: null,
  })
  const timezone = ref(dayjs.tz.guess())

  const filter = ref<any>({
    date: [],
    tags: {
      hasTags: true,
      items: []
    }
  });

  const entityToDelete = ref<any>(null)  
  const searchInput = ref<string>('');

  const showSearch = ref<boolean>(false);
  const showSearchMobile = ref<boolean>(false);
  const showSettingsAccount = ref<boolean>(false)
  const showArchive = ref<boolean>(false)
  const showBoard = ref<boolean>(true)
  const showPolicy = ref<boolean>(false)
  const showOferta = ref<boolean>(false)
  const showMoneyback = ref<boolean>(false)
  const showTerms = ref<boolean>(false)
  const showSidebar = ref<boolean>(false);
  const showUpgradeToPremium = ref<boolean>(false);

  const allEntities = ref<{
    boards: Board[],
    categories: Category[],
    workspaces: Workspace[],
    chats: any[]
  }>({
    boards: [],
    categories: [],
    workspaces: [],
    chats: []
  })

  const deletedEntities = ref<{
    tasks: Task[],
    boards: Board[],
    categories: Category[],
    workspaces: Workspace[]
  }>({
    tasks: [],
    boards: [],
    categories: [],
    workspaces: []
  })

  const deletedEntitiesLoadState = ref<{
    tasks: boolean,
    boards: boolean,
    categories: boolean,
    workspaces: boolean
  }>({
    tasks: false,
    boards: false,
    categories: false,
    workspaces: false
  })

  const deletedEntitiesLoadedState = ref<{
    tasks: boolean,
    boards: boolean,
    categories: boolean,
    workspaces: boolean
  }>({
    tasks: false,
    boards: false,
    categories: false,
    workspaces: false
  })

  const notifications = ref<NotificationStrict[]>([]);
  const hydrationState = ref<{
    isHydrationEnded: boolean,
    isMounted: boolean
  }>({
    isHydrationEnded: false,
    isMounted: false
  });

  function $reset() {
    user.value = {
      _id: '',
      username: '',
      email: '',
      role: '',
      hasAvatar: false,
      subscription: "trial",
      subscription_until: new Date(),
      generations_balance: 0,
      is_tips_completed: false,
      payment_method_id: '',
      avatar_color: '',
      ya_id: null
    };
    filter.value = {
      date: [],
      tags: {
        hasTags: true,
        items: []
      }
    };
    entityToDelete.value = null;
    searchInput.value = '';

    showSearch.value = false;
    showSettingsAccount.value = false;
    showArchive.value = false;
    showBoard.value = true;
    showPolicy.value = false;
    showTerms.value = false;

    allEntities.value = {
      boards: [],
      categories: [],
      workspaces: [],
      chats: []
    };
    deletedEntities.value = {
      tasks: [],
      boards: [],
      categories: [],
      workspaces: []
    };
    deletedEntitiesLoadState.value = {
      tasks: false,
      boards: false,
      categories: false,
      workspaces: false
    };
    deletedEntitiesLoadedState.value = {
      tasks: false,
      boards: false,
      categories: false,
      workspaces: false
    };
    notifications.value = [];
    hydrationState.value = {
      isHydrationEnded: false,
      isMounted: false
    };
  }

  function checkHydrationMountEnded() {
    return hydrationState.value.isHydrationEnded && hydrationState.value.isMounted;
  }
  
  function updateUser(data: any) {
    Object.assign(user.value, data);

    if (data.is_tips_completed) TIPS_STORE.isTipsInProgress = false;
    else TIPS_STORE.isTipsInProgress = true;
  }

  function isUserPremium() {
    return user.value.subscription === 'premium';
  }

  function updateDateFilter(value: string) {
    if (filter.value.date.includes(value)) {
      filter.value.date.splice(filter.value.date.indexOf(value), 1);
    } else if (value) {
      filter.value.date.push(value);
    }
  }

  function clearInput() {
    searchInput.value = '';
    showSearchMobile.value = false;
    CATEGORY_STORE.setSelectedSearchCategory(null);
    TASK_STORE.setSelectedSearchTask(null);
  }

  const getRandomGuid = computed(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'. replace(/[xy]/g, function(c) {
        const r = Math. random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v. toString(16);
      });;
    }
  });

  function updateTagsFilter(value: string, changeHasTags = false) {
    if (changeHasTags) {
      filter.value.tags.hasTags = !filter.value.tags.hasTags;
      return;
    }

    if (filter.value.tags.items.includes(value)) {
      filter.value.tags.items.splice(filter.value.tags.items.indexOf(value), 1);
    } else if (value) {
      filter.value.tags.items.push(value);
    }
  }

  function removeNotification(notification: Notification) {
    if (notifications.value) {
      const notificationObj = notifications.value.find((n: any) => n._id === notification._id);

      if (!notificationObj) return;
      
      if (notification.refDivElement) {
        notification.refDivElement.classList.add('notification-hide');
      }
      
      setTimeout(() => {
        const index = notifications.value.indexOf(notificationObj);

        if (index > -1) notifications.value.splice(index, 1);
      }, 1000)
    }
  }

  async function createNotification(notification: Notification) {
    if (!notifications.value) return;

    notification.time = Date.now();

    if (!notification._id) {
      try {
        notification._id = crypto.randomUUID();
      } catch {
        notification._id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
        });
      }
    }

    notifications.value.push(notification as NotificationStrict);

    setTimeout(() => {
      removeNotification(notification)
    }, 10000)
  }

  function switchTabs(tabNumber: Tabs) {
    showArchive.value = false;
    showBoard.value = false;
    showSidebar.value = false;

    if (tabNumber !== Tabs.Board && BOARD_STORE.activeBoard) BOARD_STORE.activeBoard = null;
    
    switch (tabNumber) {
      case Tabs.Board:
        showBoard.value = true;
        break;
      case Tabs.Archive:
        showArchive.value = true;
        break;
    }
  }

  function typingSearch() {
    if (searchInput.value.length > 0) {
      showSearch.value = true;
      showSearchMobile.value = true;
    } else {
      clearInput();
    }
  }

  function updateCurrentEntitiesByOpLogs(operation_logs: OperationLogs) {
    const expandedLogs: OperationLog[] = [];
    
    if (operation_logs) {
      if (operation_logs.operationLog) {
        expandedLogs.push(operation_logs.operationLog);
      }
      if (operation_logs.dependencies) {
        expandedLogs.push(...operation_logs.dependencies);
      }
    }

    updateCurrentEntities(expandedLogs);
  }

  const isFilterActive = computed(() => {
    return filter.value.date.length > 0 || filter.value.tags.hasTags === false || filter.value.tags.items.length > 0;
  });

  watch(searchInput, () => {
    typingSearch()
  });

  return {
    allEntities,
    deletedEntitiesLoadState,
    deletedEntitiesLoadedState,
    deletedEntities,
    user,
    filter,
    showSettingsAccount,
    showArchive,
    showOferta,
    showMoneyback,
    notifications,
    entityToDelete,
    searchInput,
    showSearch,
    showSearchMobile,
    showPolicy,
    showTerms,
    showBoard,
    showSidebar,
    showUpgradeToPremium,
    hydrationState,
    timezone,
    checkHydrationMountEnded,
    updateUser,
    updateDateFilter,
    updateTagsFilter,
    createNotification,
    removeNotification,
    getRandomGuid,
    clearInput,
    isUserPremium,
    updateCurrentEntitiesByOpLogs,
    isFilterActive,
    switchTabs,
    $reset
  }
})