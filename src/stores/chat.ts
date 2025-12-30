import { Nullable } from '@/types/utils'
import { BackendError, HttpError } from '@/utils/errors'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import {
  fetchChats,
  sendMessage as sendMessageService,
  approveToolCall as approveToolCallService,
  retryAgent as retryAgentService,
} from '@services/chat'
import ChatModel from '@models/ChatModel'
import { useBoardDataStore } from '@stores/boardData'
import { useAgentStatusStore } from '@stores/agentStatus'
import dayjs from 'dayjs'
import { useUIStore } from '@stores/ui'
import { useChatMessageStore } from '@stores/chatMessages'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { ApproveToolCall } from '@/interfaces/ApproveToolCall'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

type ChatErrorType = Nullable<BackendError | HttpError>

export const useChatStore = defineStore('chat', () => {
  const chats = ref<ChatModel[]>([])
  const activeChatId = ref<string | null>(null)

  const BOARD_STORE = useBoardDataStore()
  const AGENT_STATUS_STORE = useAgentStatusStore()
  const UI_STORE = useUIStore()
  const CHAT_MESSAGE_STORE = useChatMessageStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()

  // Errors
  const loadChatsError = ref<ChatErrorType>(null)
  const startChatError = ref<ChatErrorType>(null)
  const sendMessageError = ref<ChatErrorType>(null)
  const retryAgentError = ref<ChatErrorType>(null)
  const _approveToolCallsError = ref<Map<string, ChatErrorType>>(new Map())

  //Loading
  const _loadingStatusWorkspaces = ref<Map<string, boolean>>(new Map())
  const _loadedWorkspaces = ref<Set<string>>(new Set())
  const _isChatStarting = ref<boolean>(false)
  const _isMessageSending = ref<boolean>(false)
  const _isAgentRetrying = ref<boolean>(false)
  const _approvingTools = ref<Set<string>>(new Set())

  async function loadChats(workspaceId: string, force_reload: boolean = false) {
    if (areChatsLoaded(workspaceId) && !force_reload) return
    if (areChatsLoading(workspaceId)) return
    if (_loadingStatusWorkspaces.value.get(workspaceId)) return

    _loadingStatusWorkspaces.value.set(workspaceId, true)

    loadChatsError.value = null

    try {
      const chatsPayload = await fetchChats(workspaceId)

      chats.value = chats.value.filter((c) => c.workspaceId !== workspaceId) // Remove old chats of this workspace

      chats.value.push(...chatsPayload)

      _loadedWorkspaces.value.add(workspaceId)

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadChatsError.value = e
      } else if (e instanceof HttpError) {
        loadChatsError.value = e

        if (e.status === 401) {
        }
      } else {
        loadChatsError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadChatsError.value.message)

      return false
    } finally {
      _loadingStatusWorkspaces.value.set(workspaceId, false)
    }
  }

  function selectChat(chat: ChatModel, openModal: boolean = false) {
    activeChatId.value = chat.id

    CHAT_MESSAGE_STORE.loadChatMessages(chat.workspaceId, chat.id)

    if (openModal) {
      UI_STORE.openChatModal()
    }
  }

  async function startChat(workspaceId: string, initialMessage: string) {
    if (!initialMessage.trim()) {
      return
    }

    if (isChatStarting.value) {
      return
    }

    try {
      _isChatStarting.value = true
      startChatError.value = null

      const sendResult = await sendMessageService(workspaceId, {
        message: initialMessage,
        boardId: BOARD_STORE.getActiveBoard?.id || '',
        timezone: dayjs.tz.guess(),
        workspaceId,
      })

      chats.value.unshift(sendResult.chat)
      CHAT_MESSAGE_STORE.addChatMessages(sendResult.chatMessages)

      activeChatId.value = sendResult.chat.id

      AGENT_STATUS_STORE.connectSSE(sendResult.jobId)

      UI_STORE.openChatModal()
    } catch (e) {
      if (e instanceof BackendError) {
        startChatError.value = e
      } else if (e instanceof HttpError) {
        startChatError.value = e

        if (e.status === 401) {
        }
      } else {
        startChatError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(startChatError.value.message)

      return false
    } finally {
      _isChatStarting.value = false
    }
  }

  async function sendMessage(initialMessage: string) {
    if (!initialMessage.trim()) return
    if (isMessageSending.value) return
    if (!activeChat.value || !activeChat.value.threadId) return
    if (!WORKSPACE_STORE.activeWorkspace) return

    try {
      _isMessageSending.value = true
      sendMessageError.value = null

      const sendResult = await sendMessageService(WORKSPACE_STORE.activeWorkspace.id, {
        message: initialMessage,
        boardId: BOARD_STORE.getActiveBoard?.id || '',
        threadId: activeChat.value.threadId,
        timezone: dayjs.tz.guess(),
        workspaceId: WORKSPACE_STORE.activeWorkspace.id,
      })

      CHAT_MESSAGE_STORE.addChatMessages(sendResult.chatMessages)

      AGENT_STATUS_STORE.connectSSE(sendResult.jobId)
    } catch (e) {
      if (e instanceof BackendError) {
        sendMessageError.value = e
      } else if (e instanceof HttpError) {
        sendMessageError.value = e

        if (e.status === 401) {
        }
      } else {
        sendMessageError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(sendMessageError.value.message)

      return false
    } finally {
      _isMessageSending.value = false
    }
  }

  async function retryAgent(chatMessage: IChatMessage) {
    if (isMessageSending.value) return
    if (!activeChat.value || !activeChat.value.threadId) return
    if (!WORKSPACE_STORE.activeWorkspace) return

    try {
      _isAgentRetrying.value = true
      retryAgentError.value = null

      const retryResult = await retryAgentService(
        {
          chatId: chatMessage.chatId,
          threadId: chatMessage.threadId,
          boardId: BOARD_STORE.getActiveBoard?.id || '',
          workspaceId: WORKSPACE_STORE.activeWorkspace.id,
          timezone: dayjs.tz.guess(),
        },
        WORKSPACE_STORE.activeWorkspace.id,
      )

      CHAT_MESSAGE_STORE.removeChatMessageFromStore(chatMessage.id)

      AGENT_STATUS_STORE.connectSSE(retryResult.jobId)
    } catch (e) {
      if (e instanceof BackendError) {
        retryAgentError.value = e
      } else if (e instanceof HttpError) {
        retryAgentError.value = e

        if (e.status === 401) {
        }
      } else {
        retryAgentError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(retryAgentError.value.message)

      return false
    } finally {
      _isAgentRetrying.value = false
    }
  }

  async function approveToolCall(
    toolCallId: string,
    chatMessageId: string,
    decision: 'confirm' | 'cancel',
  ): Promise<boolean> {
    if (_approvingTools.value.has(toolCallId)) return false

    _approveToolCallsError.value.set(toolCallId, null)
    _approvingTools.value.add(toolCallId)

    const workspaceId = WORKSPACE_STORE.activeWorkspace?.id || ''

    try {
      const payload: ApproveToolCall = {
        toolCallId,
        chatMessageId,
        boardId: BOARD_STORE.getActiveBoard?.id || '',
        isConfirmed: decision === 'confirm',
        isCancelled: decision === 'cancel',
        workspaceId: workspaceId,
        timezone: dayjs.tz.guess(),
      }
      const result = await approveToolCallService(payload, workspaceId)

      CHAT_MESSAGE_STORE.updateChatMessageInStore(result.chatMessage)

      if (result.jobId) {
        CHAT_MESSAGE_STORE.deleteFromStore([chatMessageId])
        AGENT_STATUS_STORE.connectSSE(result.jobId)
      }

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        _approveToolCallsError.value.set(toolCallId, e)
      } else if (e instanceof HttpError) {
        _approveToolCallsError.value.set(toolCallId, e)

        if (e.status === 401) {
        }
      } else {
        _approveToolCallsError.value.set(
          toolCallId,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      toast.error(
        _approveToolCallsError.value.get(toolCallId)?.message || ErrorsMessage.UNEXPECTED_ERROR,
      )

      return false
    } finally {
      _approvingTools.value.delete(toolCallId)
    }
  }

  function areChatsLoading(workspaceId: string): boolean {
    return _loadingStatusWorkspaces.value.has(workspaceId)
  }

  function areChatsLoaded(workspaceId: string): boolean {
    return _loadedWorkspaces.value.has(workspaceId)
  }

  const isChatStarting = computed(() => _isChatStarting.value)
  const isMessageSending = computed(() => _isMessageSending.value)
  const isToolCallApproving = computed(() => (toolCallId: string) => {
    return _approvingTools.value.has(toolCallId)
  })

  const activeChat = computed(
    () => chats.value.find((chat) => chat.id === activeChatId.value) || null,
  )

  return {
    //States
    loadChatsError,
    chats,
    activeChatId,
    isChatStarting,
    isMessageSending,
    isToolCallApproving,
    sendMessageError,
    activeChat,

    //Actions
    loadChats,
    startChat,
    sendMessage,
    approveToolCall,
    selectChat,
    retryAgent,
  }
})
