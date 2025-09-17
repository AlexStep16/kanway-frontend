import { mande } from "mande";
import { useRootStore } from '../stores/root';
import { useSidebarStore } from "../stores/sidebar";
import { useWorkspaceStore } from "../stores/workspace";
import { useBoardStore } from "../stores/board";
import { useTaskStore } from "../stores/task";
import { useTipsStore } from "../stores/tips";
import { navigate } from "vike/client/router";
import { useData } from "vike-vue/useData";
import User from "../Interfaces/User";

const baseApi = import.meta.env.VITE_SERVER_BASE_URL;

export function checkAvatar(file: any) {
  const MAX_FILE_SIZE_MB = 2;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  let isSuccess = true;
  let failureMessage = '';

  if (file.size > MAX_FILE_SIZE_BYTES) {
    failureMessage = `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE_MB} MB.`;
    isSuccess = false;
  }

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    failureMessage = `Недопустимый тип файла. Пожалуйста, выберите изображение (${ALLOWED_MIME_TYPES.join(', ')}).`;
    isSuccess = false;
  }

  return {
    isSuccess,
    failureMessage
  }
}

export async function avatar(formData: any) {
  const STORE = useRootStore();

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/users/avatar').post<any>(formData)

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await logout();
      }

      return null;
    }

    STORE.createNotification({
      action_type: 'success',
      description: res.result
    });

    return true;
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при обновлении аватара. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return false;
  }
}

export async function user(username: string) {
  const STORE = useRootStore();

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/users')
      .post<any>({ username });

    const data = res.result;

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await logout();
      }

      return null;
    }

    if (!data) return null;

    return true;
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при обновлении пользователя. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return false;
  }
}

export async function logout() {
  const STORE = useRootStore();
  const SIDEBAR_STORE = useSidebarStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const BOARD_STORE = useBoardStore();
  const TASK_STORE = useTaskStore();
  const TIPS_STORE = useTipsStore();

  const res = await mande(baseApi + '/auth/logout').get<any>();

  if (res.success || res.status === 401) {
    SIDEBAR_STORE.showUserAccount = false;

    STORE.$reset();
    WORKSPACE_STORE.$reset();
    SIDEBAR_STORE.$reset();
    BOARD_STORE.$reset();
    TASK_STORE.$reset();
    TIPS_STORE.$reset();

    navigate('/sign-in');
  }

  return res;
}

export async function sendCompletionTips(is_tips_completed: boolean) {
  const res = await mande(baseApi + '/users').post<any>({ is_tips_completed });

  if (!res || !res.success) {
    if (res.error.code === 54) {
      return await logout();
    }
  }

  return res;
}

export function updateUserByPageContext() {
  const STORE = useRootStore();

  const data = useData<{ user: User }>();

  if (data.user) {
    STORE.updateUser(data.user);
  }
}