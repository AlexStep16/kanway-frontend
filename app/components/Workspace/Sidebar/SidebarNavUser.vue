<script setup lang="ts">
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  MessageCircleQuestionMark,
} from '@lucide/vue'

import { useSidebar } from '~/components/ui/sidebar'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'

const uiStore = useUIStore()
const { mutate: logout } = useLogout()

const { data: user } = useUser()

const { isMobile } = useSidebar()

const isUserHasArchitectorSub = computed(() => {
  return user.value?.subscriptionId === SubscriptionPlanEnum.Architector
})

const isUserHasBasicSub = computed(() => {
  return user.value?.subscriptionId === SubscriptionPlanEnum.Basic
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatar />

            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user?.username }}</span>
              <span class="truncate text-xs">{{ user?.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <UserHeader />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] text-white!"
            v-if="!isUserHasArchitectorSub"
            @click="uiStore.isPlansModalOpen = true"
          >
            <Sparkles />
            Улучшить план
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="uiStore.openPlansSettings()"
            v-if="!isUserHasBasicSub"
          >
            <Sparkles />
            Управлять подпиской
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="uiStore.openProfileSettings()">
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
              @click="logout(true)"
            >
              <LogOut />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel class="text-xs flex flex-wrap gap-x-2 font-normal">
            <NuxtLink
              class="inline-flex gap-x-2 text-gray-400 hover:text-gray-500 focus:outline-hidden focus:text-gray-500"
              to="/terms"
              >Соглашение</NuxtLink
            >
            <NuxtLink
              class="inline-flex gap-x-2 text-gray-400 hover:text-gray-500 focus:outline-hidden focus:text-gray-500"
              to="/cookies"
              >Cookies</NuxtLink
            >
            <NuxtLink
              class="inline-flex gap-x-2 text-gray-400 hover:text-gray-500 focus:outline-hidden focus:text-gray-500"
              to="/privacy"
              >Конфиденциальность</NuxtLink
            >
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
