import { createRouter, createWebHistory, Router } from 'vue-router'

let router: Router | undefined

export function getWorkspaceRouter() {
  if (!router) {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/workspace',
          component: () => import('@views/WorkspaceView.vue'),
        },
        {
          path: '/workspace/:workspaceId',
          component: () => import('@views/WorkspaceView.vue'),
        },
        {
          path: '/workspace/:workspaceId/:boardId',
          component: () => import('@views/WorkspaceView.vue'),
        },
      ],
    })
  }

  return router
}

export async function workspaceNavigate(path: string) {
  const r = getWorkspaceRouter()
  if (r) {
    await r.push(path)
  } else {
    console.warn('Router is not available')
  }
}
