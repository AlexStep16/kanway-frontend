import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useWorkspaceStore } from './workspace';
import { mande, MandeError } from 'mande';
import { useRootStore } from './root';
import NotificationEntities from '../enums/NotificationEntitiesEnum';
import { useBoardStore } from './board';
import * as userFunctions from '../helpers/user';
import { updateCurrentEntities } from '../helpers/updateCurrentEntities';
import { ServerResponse } from '../Interfaces/ServerResponse';

export const useChatStore = defineStore('chat', () => {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const BOARD_STORE = useBoardStore();
  const baseApi = import.meta.env.VITE_SERVER_BASE_URL;
  const controller = ref<AbortController | null>(null);

  function stopGeneration() {
    if (controller.value) controller.value.abort();
  }

  // STATE
  const isDialogOpen = ref(false);
  const currentThreadId = ref<string | null>(null);
  const initialPrompt = ref('');
  const history = ref<Array<unknown>>([]);
  const isLoading = ref(false);
  const jobId = ref<string | null>(null);

  async function startNewChatFromPrompt(prompt: string) {
    isDialogOpen.value = true;
    currentThreadId.value = null;
    history.value = [];
    initialPrompt.value = prompt;
  }

  async function openExistingChat(threadId: string) {
    isDialogOpen.value = true;
    currentThreadId.value = threadId;
    initialPrompt.value = '';
    isLoading.value = true;
    history.value = await getChatHistory(threadId) || [];
    isLoading.value = false;
  }

  async function getChats(workspace_id: string) {
    try {
      const response = await mande(
        baseApi + '/workspace/' + workspace_id + '/ai/chats'
      ).get<ServerResponse<unknown[]>>();

      if (response.success && response.result) {
        STORE.allEntities.chats = response.result;
      } else {
        STORE.createNotification({
          action_type: 'error',
          entity_type: NotificationEntities.Confirmation,
          description: response.error?.description || 'Ошибка при получении истории чата.'
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getChatHistory(threadId: string) {
    if (!WORKSPACE_STORE.activeWorkspace) return;

    try {
      const response = await mande(
        baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/ai/chat-history/' + threadId
      ).get<ServerResponse<unknown[]>>();

      if (response.success && response.result) {
        return response.result;
      } else {
        STORE.createNotification({
          action_type: 'error',
          entity_type: NotificationEntities.Confirmation,
          description: response.error?.description || 'Ошибка при получении истории чата.'
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  function closeChat() {
    isDialogOpen.value = false;
    currentThreadId.value = null;
    initialPrompt.value = '';
    history.value = [];
  }

  function getStreamStatus(lastMessage: unknown) {
    if (!jobId.value || !WORKSPACE_STORE.activeWorkspace) return;

    const chatHistoryMessage: unknown = history.value.find((message: unknown) => message.id === lastMessage.id);
    if (!chatHistoryMessage) return;

    const streamStatus = new EventSource(
      baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + `/ai/stream/${jobId.value}/status`,
      { withCredentials: true }
    );

    chatHistoryMessage.content = '';

    streamStatus.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.status === 'failed') {
          streamStatus.close();

          STORE.createNotification({
            action_type: 'error',
            entity_type: NotificationEntities.Confirmation,
            description: payload.error?.description || 'Ошибка при получении данных.'
          });
          return;
        }

        if (payload.status === 'completed') {
          if (STORE.user.generations_balance > 0) STORE.user.generations_balance--;
          streamStatus.close();
        }

        const eventData = payload.data;
        if (!eventData?.role) return;

        switch (eventData.role) {
          case 'tools_execution':
            chatHistoryMessage.status = 'tools_execution';
            chatHistoryMessage.tip = eventData.tip || '';
            break;
          case 'assistant_chunk':
            chatHistoryMessage.status = 'assistant';
            chatHistoryMessage.content += eventData.content;
            break;
          case 'modifications':
            updateCurrentEntities(eventData.operation_logs);
            break;
          case 'preview':
            chatHistoryMessage.status = 'preview';
            history.value.pop();
            history.value.push({
              id: eventData.chat_history_id,
              role: eventData.role,
              content: eventData.content
            });
            for (const toolCall of eventData.content) {
              toolCall.is_resolved = false;
            }
            break;
          case 'assistant':
            chatHistoryMessage.status = 'assistant';
            chatHistoryMessage.content = eventData.content;
            chatHistoryMessage.id = eventData.chat_history_id;
            break;
          case 'tools_retrieving':
            chatHistoryMessage.status = 'tools_retrieving';
            chatHistoryMessage.content = '';
            break;
          case 'history_retrieving':
            chatHistoryMessage.status = 'history_retrieving';
            chatHistoryMessage.content = '';
            break;
          case 'history_summary_retrieving':
            chatHistoryMessage.status = 'history_summary_retrieving';
            chatHistoryMessage.content = '';
            break;
          default:
            break;
        }
      } catch (e) {
        console.error('SSE message parse error', e);
      }
    };

    streamStatus.onerror = (err) => {
      console.error('SSE error', err);
      streamStatus.close();
    };
  }

  async function sendMessage(messageText: string) {
    if (!WORKSPACE_STORE.activeWorkspace) return;

    controller.value = new AbortController();
    const signal = controller.value.signal;
    isLoading.value = true;

    history.value.push({ id: crypto.randomUUID(), content: messageText, role: 'user' });

    mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + `/ai/stream`)
      .post({
        description: messageText,
        board_id: BOARD_STORE.activeBoard?._id,
        thread_id: currentThreadId.value,
        timezone: STORE.timezone
      }, { signal })
      .then(async (res: any) => {
        const data = res.result;

        if (!res.success) {
          STORE.createNotification({
            action_type: 'error',
            description: res.error.description
          });
          if (res.error.code === 54) {
            return await userFunctions.logout();
          }
          return;
        }

        jobId.value = data.jobId;
        currentThreadId.value = data.threadId;

        const lastMessage = {
          id: `agent-response-${jobId.value}`,
          role: 'assistant',
          content: '',
          status: 'thinking'
        };

        history.value.push(lastMessage);
        getStreamStatus(lastMessage);
      }).catch((e: MandeError) => {
        if (e.body && e.response.status === 422 && e.body.length > 0 && !e.message.includes('signal is aborted')) {
          for (const error of e.body) {
            STORE.createNotification({
              action_type: 'error',
              description: error.description
            });
          }
        }
      }).finally(() => {
        isLoading.value = false;
      });
  }

  function cancelDecision(toolCall: any) {
    toolCall.decision = null;
    toolCall.is_resolved = false;
  }

  function reviewTool(toolCall: any, message: any, decision: string) {
    if (!WORKSPACE_STORE.activeWorkspace || !currentThreadId.value) return;

    const toolsReview: any[] = [];
    const content: any[] = message.content;
    const chat_history_id: string = message.id;

    let needSend = true;

    if (toolCall) {
      toolCall.decision = decision;
      toolCall.is_resolved = true;
    }

    for (const toolCall of content) {
      if (!toolCall.is_resolved) {
        needSend = false;
      } else {
        toolsReview.push({
          tool_call_id: toolCall.call_id,
          decision: toolCall.decision
        });
      }
    }

    if (needSend) {
      mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + `/ai/stream` + `/${currentThreadId.value}/review`).put({
        thread_id: currentThreadId.value,
        timezone: STORE.timezone,
        board_id: BOARD_STORE.activeBoard?._id,
        chat_history_id,
        toolsReview
      }).then((res: any) => {
        const data = res.result;

        if (res.success) {
          jobId.value = data.jobId;

          const lastMessage = {
            id: `agent-response-${jobId.value}`,
            role: 'assistant',
            content: '',
            status: 'thinking'
          };

          history.value.push(lastMessage);
          message.is_resolved = true;
          getStreamStatus(lastMessage);
        } else {
          STORE.createNotification({
            action_type: 'error',
            description: res.error.description || 'Ошибка при возобновлении.'
          });
        }
      }).catch((e: MandeError) => {
        STORE.createNotification({
          action_type: 'error',
          description: e.message || 'Ошибка при возобновлении.'
        });
      });
    }
  }

  return {
    // State
    isDialogOpen,
    currentThreadId,
    initialPrompt,
    history,
    isLoading,
    jobId,
    // Actions
    startNewChatFromPrompt,
    openExistingChat,
    getChatHistory,
    getChats,
    closeChat,
    getStreamStatus,
    sendMessage,
    stopGeneration,
    reviewTool,
    cancelDecision
  };
});