export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  byBoard: (boardId: MaybeRef<string | null>) => [...taskKeys.lists(), { boardId }],
  archived: () => [...taskKeys.all, 'archived'],
  detailed: (taskId: MaybeRef<string | null>) => [...taskKeys.all, 'detailed', { taskId }],
}

export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  byBoard: (boardId: MaybeRef<string | null>) => [...categoryKeys.lists(), { boardId }],
  archived: () => [...categoryKeys.all, 'archived'],
  detailed: (categoryId: MaybeRef<string | null>) => [
    ...categoryKeys.all,
    'detailed',
    { categoryId },
  ],
}

export const boardKeys = {
  all: ['boards'],
  lists: () => [...boardKeys.all, 'list'],
  count: () => [...boardKeys.all, 'count'],
  byWorkspace: (workspaceId: MaybeRef<string | null>) => [...boardKeys.lists(), { workspaceId }],
  archived: () => [...boardKeys.all, 'archived'],
  detailed: (boardId: MaybeRef<string | null>) => [...boardKeys.all, 'detailed', { boardId }],
}

export const workspaceKeys = {
  all: ['workspaces'],
  lists: () => [...workspaceKeys.all, 'list'],
  archived: () => [...workspaceKeys.all, 'archived'],
  detailed: (workspaceId: MaybeRef<string | null>) => [
    ...workspaceKeys.all,
    'detailed',
    { workspaceId },
  ],
}

export const logKeys = {
  all: ['logs'],
  lists: () => [...logKeys.all, 'list'],
  detailed: (logId: MaybeRef<string | null>) => [...logKeys.all, 'detailed', { logId }],
}

export const settingKeys = {
  all: ['settings'],
}

export const subscriptionKeys = {
  all: ['subscriptions'],
}

export const paymentKeys = {
  all: ['payments'],
  list: () => [...paymentKeys.all, 'list'],
}

export const paymentMethodKeys = {
  all: ['paymentMethods'],
}

export const chatKeys = {
  all: ['chats'],
  byWorkspace: (workspaceId: MaybeRef<string | null>) => [...chatKeys.all, { workspaceId }],
  detailed: (chatId: MaybeRef<string | null>) => [...chatKeys.all, 'detailed', { chatId }],
}

export const chatMessageKeys = {
  all: ['chatMessages'],
  byChat: (chatId: MaybeRef<string | null>) => [...chatMessageKeys.all, { chatId }],
}

export const userKeys = {
  me: ['me'],
}
