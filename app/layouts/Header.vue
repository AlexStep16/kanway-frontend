<script setup lang="ts">
import {
  Mic,
  BrainCircuit,
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Headphones,
  Menu,
  LogOut,
  User,
  Sparkles,
} from 'lucide-vue-next'
import KanwayLogo from '~/assets/kanway_logo.svg?component'
import { AuthStatus } from '~/enums/AuthStatusesEnum'
import { cn } from '~/lib/utils'

// Состояние авторизации
const authStore = useAuthStore()
const { status, user } = storeToRefs(authStore)

// Следим за скроллом для эффекта "стекла"
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 20)

// СТРУКТУРА НАВИГАЦИИ
const navigation = {
  product: [
    {
      name: 'Голосовое управление',
      description: 'Создание задач голосом за секунды.',
      href: '/#voice',
      icon: Mic,
    },
    {
      name: 'ИИ-Планировщик',
      description: 'Автоматическая сортировка и приоритеты.',
      href: '/#ai',
      icon: BrainCircuit,
    },
    {
      name: 'Канбан-доски',
      description: 'Визуальный контроль ваших проектов.',
      href: '/#boards',
      icon: LayoutDashboard,
    },
  ],
  resources: [
    { name: 'Документация', href: '/docs/privacy', icon: BookOpen },
    { name: 'Безопасность', href: '/docs/privacy', icon: ShieldCheck },
    { name: 'Тех. поддержка', href: '/support', icon: Headphones },
  ],
  standalone: [{ name: 'Цены', href: '/pricing' }],
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'border-b border-border/40 bg-background/60 backdrop-blur-lg py-2'
        : 'bg-transparent py-5 border-transparent',
    ]"
  >
    <div class="container max-w-7xl mx-auto px-4 flex items-center justify-between">
      <!-- ЛЕВАЯ ЧАСТЬ: ЛОГО -->
      <div class="flex items-center gap-8">
        <NuxtLink
          to="/"
          class="cursor-pointer"
          aria-label="На главную"
        >
          <KanwayLogo class="h-6 sm:h-8" />
        </NuxtLink>
      </div>

      <!-- ЦЕНТРАЛЬНОЕ МЕНЮ (Десктоп) -->
      <NavigationMenu class="hidden md:flex justify-center">
        <NavigationMenuList
          :class="cn('gap-1 py-2 px-6 rounded-full', !isScrolled && 'bg-background shadow')"
        >
          <!-- ПРОДУКТ (Мега-меню) -->
          <NavigationMenuItem>
            <NavigationMenuTrigger
              class="h-9 px-3 bg-transparent! text-sm font-medium hover:text-primary data-[state=open]:text-primary"
            >
              О сервисе
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-125 gap-3 p-4 md:grid-cols-1 lg:w-150 lg:grid-cols-2">
                <li
                  v-for="item in navigation.product"
                  :key="item.name"
                >
                  <NavigationMenuLink as-child>
                    <NuxtLink
                      :to="item.href"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <div class="flex items-center gap-2.5 mb-1">
                        <div class="p-1 rounded-md bg-primary/10 text-primary">
                          <component
                            :is="item.icon"
                            class="size-4"
                          />
                        </div>
                        <div class="text-sm font-bold">{{ item.name }}</div>
                      </div>
                      <p class="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {{ item.description }}
                      </p>
                    </NuxtLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <!-- РЕСУРСЫ (Список) -->
          <NavigationMenuItem>
            <NavigationMenuTrigger
              class="h-9 px-3 bg-transparent! text-sm font-medium hover:text-primary data-[state=open]:text-primary"
            >
              Ресурсы
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-50 gap-1 p-2">
                <li
                  v-for="item in navigation.resources"
                  :key="item.name"
                >
                  <NavigationMenuLink as-child>
                    <NuxtLink
                      :to="item.href"
                      class="flex items-center gap-3 select-none rounded-md p-2.5 text-sm font-medium no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <component
                        :is="item.icon"
                        class="size-4 text-muted-foreground"
                      />
                      {{ item.name }}
                    </NuxtLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <!-- ОДИНОЧНЫЕ ССЫЛКИ -->
          <NavigationMenuItem
            v-for="link in navigation.standalone"
            :key="link.href"
          >
            <NuxtLink
              :to="link.href"
              class="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              {{ link.name }}
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <!-- ПРАВАЯ ЧАСТЬ: АКШЕНЫ -->
      <div class="flex items-center gap-3">
        <!-- ГОСТЬ -->
        <template v-if="status === AuthStatus.GUEST || status === AuthStatus.IDLE">
          <Button
            variant="ghost"
            size="sm"
            as-child
            class="hidden sm:inline-flex"
          >
            <NuxtLink to="/auth">Войти</NuxtLink>
          </Button>
          <Button
            size="sm"
            as-child
            class="rounded-full px-5 shadow-xs transition-shadow hover:shadow-md"
          >
            <NuxtLink to="/auth?step=signup">Попробовать бесплатно</NuxtLink>
          </Button>
        </template>

        <!-- АВТОРИЗОВАН -->
        <template v-else-if="status === AuthStatus.AUTHENTICATED">
          <Button
            variant="outline"
            size="sm"
            as-child
            class="hidden sm:inline-flex gap-2 rounded-full border-primary/20 hover:bg-primary/5"
          >
            <NuxtLink to="/workspace">
              <Sparkles class="size-3.5 text-primary" />
              Консоль
            </NuxtLink>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                class="relative size-9 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background transition-all hover:ring-primary/50"
              >
                <img
                  v-if="user?.avatarUrl"
                  :src="user.avatarUrl"
                  class="rounded-full object-cover"
                />
                <div
                  v-else
                  class="size-full bg-linear-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                >
                  {{ user?.username?.substring(0, 2).toUpperCase() }}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              class="w-56 mt-2"
            >
              <div class="flex items-center gap-2 p-2 px-3">
                <div class="flex flex-col space-y-0.5">
                  <p class="text-sm font-medium">{{ user?.username }}</p>
                  <p class="text-xs text-muted-foreground truncate">{{ user?.email }}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="navigateTo('/workspace/settings')">
                <User class="mr-2 size-4" /> Профиль
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="authStore.logout()"
                class="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut class="mr-2 size-4" /> Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <!-- МОБИЛЬНОЕ МЕНЮ -->
        <Sheet>
          <SheetTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="md:hidden"
            >
              <Menu class="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div class="flex flex-col gap-4 mt-8">
              <NuxtLink
                to="/#features"
                class="text-lg font-bold"
                >Возможности</NuxtLink
              >
              <NuxtLink
                to="/pricing"
                class="text-lg font-bold"
                >Цены</NuxtLink
              >
              <Separator />
              <Button
                v-if="status !== AuthStatus.AUTHENTICATED"
                as-child
                class="w-full"
              >
                <NuxtLink to="/auth">Начать работу</NuxtLink>
              </Button>
              <Button
                v-else
                variant="destructive"
                @click="authStore.logout()"
                >Выйти</Button
              >
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
