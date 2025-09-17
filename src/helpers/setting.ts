import { mande } from "mande";
import { useRootStore } from '../stores/root';
import { useSettingStore } from "../stores/setting";
import * as userFunctions from '../helpers/user';

const baseApi = import.meta.env.VITE_SERVER_BASE_URL;

export async function getSettings() {
  const STORE = useRootStore();

  try {
    const res = await mande(baseApi + '/settings').get<any>()

    const data = res.result;

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return false;
    }

    return data;
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
        description: 'Возникла ошибка при получении настроек. Попробуйте повторить позже.'
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

export async function updateSettings() {
  const STORE = useRootStore();
  const SETTING_STORE = useSettingStore();

  try {
    const res = await mande(baseApi + '/settings')
      .post<any>({
        ...SETTING_STORE.settings
      })

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return null;
    }

    return res;
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
        description: 'Возникла ошибка при обновлении настроек. Попробуйте повторить позже.'
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