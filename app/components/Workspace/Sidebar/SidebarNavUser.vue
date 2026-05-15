<script setup lang="ts">
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  MessageCircleQuestionMark,
} from 'lucide-vue-next'

import { useSidebar } from '~/components/ui/sidebar'
import { AvailableColors } from '~/enums/AvailableColors'

const uiStore = useUIStore()
const authStore = useAuthStore()

const runtimeConfig = useRuntimeConfig()

const { data: user } = useUser()

const { isMobile } = useSidebar()

const avatarUrl = computed(() => {
  if (user.value?.avatarUrl) {
    return runtimeConfig.public.serverApiUrl + '/' + user.value.avatarUrl
  } else {
    return ''
  }
})

const avatarColor = computed(() => {
  return user.value?.avatarColor || AvailableColors.BLUE
})

const usernameFirstLetter = computed(() => {
  if (user.value?.username) {
    return user.value.username.charAt(0).toUpperCase()
  } else {
    return 'A'
  }
})

const hasUserSubscription = computed(() => {
  return user.value?.subscriptionId !== null
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar
              class="h-8 w-8 rounded-lg relative"
              :style="`background-color: ${avatarColor}`"
            >
              <AvatarImage
                v-if="user?.avatarUrl"
                :src="avatarUrl"
                :alt="user.username"
              />
              <AvatarFallback
                v-else
                class="rounded-lg text-white text-base"
              >
                {{ usernameFirstLetter }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user?.username }}</span>
              <span class="truncate text-xs">{{ user?.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar
                class="h-8 w-8 rounded-lg"
                :style="`background-color: ${avatarColor}`"
              >
                <AvatarImage
                  v-if="user?.avatarUrl"
                  :src="avatarUrl"
                  :alt="user.username"
                />
                <AvatarFallback
                  v-else
                  class="rounded-lg text-white text-base"
                >
                  {{ usernameFirstLetter }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ user?.username }}</span>
                <span class="truncate text-xs">{{ user?.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] text-white!"
            v-if="!hasUserSubscription"
            @click="uiStore.isPlansModalOpen = true"
          >
            <Sparkles />
            Улучшить план
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="uiStore.openSubscriptionSettings()"
            v-else
          >
            <Sparkles />
            Управлять подпиской
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="uiStore.openGeneralSettings()">
              <BadgeCheck />
              Профиль
            </DropdownMenuItem>
            <DropdownMenuItem @click="uiStore.openPaymentsSettings()">
              <CreditCard />
              Платежи
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="uiStore.isSupportModalOpen = true">
              <MessageCircleQuestionMark />
              Поддержка
            </DropdownMenuItem>
            <DropdownMenuItem
              class="text-destructive focus:text-destructive focus:bg-red-100"
              @click="authStore.logout()"
            >
              <LogOut />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
