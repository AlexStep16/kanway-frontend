<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import KanwayLogo from '~/assets/kanway_logo.svg?component'
import { cn } from '~/lib/utils'
import { getSafeBase64String } from '~/utils/getSafeBase64String'

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 20)

const { mutate: logout } = useLogout()

const navigation = {
  standalone: [
    { name: 'Почему Kanway', href: '/#why' },
    { name: 'Коммандный центр', href: '/#command-center' },
    { name: 'Цены', href: '/#prices' },
    { name: 'Вопросы', href: '/#faq' },
  ],
}

const { data: user } = useUser()

const verifyEmailHref = computed(() => ({
  path: '/auth',
  query: {
    step: AllowedAuthStepsEnum.VERIFY_EMAIL,
    payload: getSafeBase64String(user.value?.email || ''),
  },
}))

const isMobileMenuOpen = ref(false)
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled || isMobileMenuOpen
        ? 'border-b border-border/40 bg-background/60 backdrop-blur-lg py-2 shadow-sm'
        : 'bg-transparent py-5 border-transparent',
    ]"
  >
    <div class="container max-w-7xl mx-auto px-4 flex items-center justify-between relative z-10">
      <!-- ЛЕВАЯ ЧАСТЬ: ЛОГО -->
      <div class="flex items-center gap-8">
        <NuxtLink
          to="/"
          class="cursor-pointer"
          aria-label="На главную"
          @click="isMobileMenuOpen = false"
        >
          <KanwayLogo class="h-6 sm:h-8" />
        </NuxtLink>
      </div>

      <!-- ЦЕНТРАЛЬНОЕ МЕНЮ (Десктоп) -->
      <NavigationMenu class="hidden md:flex justify-center">
        <NavigationMenuList
          :class="
            cn(
              'gap-1 py-3 px-6 rounded-full',
              !isScrolled && !isMobileMenuOpen && 'bg-background shadow',
            )
          "
        >
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
        <template v-if="!user">
          <!-- Десктоп: текстовые кнопки -->
          <Button
            variant="ghost"
            size="sm"
            class="hidden sm:inline-flex"
          >
            <NuxtLink to="/auth">Войти</NuxtLink>
          </Button>
          <Button
            size="sm"
            class="hidden sm:inline-flex rounded-full px-5 py-2 h-auto shadow-xs transition-shadow hover:shadow-md"
          >
            <NuxtLink to="/auth?step=signup">Начать бесплатно</NuxtLink>
          </Button>
        </template>

        <!-- НЕ ПОДТВЕРЖДЕН -->
        <template v-else-if="user.isConfirmed === false">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                class="flex items-center relative rounded-md ring-2 ring-border ring-offset-2 ring-offset-background transition-all hover:ring-primary/50 outline-none"
              >
                <UserAvatar />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              class="w-56 mt-2"
            >
              <UserHeader />
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  class="text-primary/90 data-highlighted:bg-primary-muted/80 data-highlighted:text-primary active:bg-primary-muted/80 active:scale-[0.98] transition-all duration-100"
                >
                  <NuxtLink
                    :to="verifyEmailHref"
                    class="flex items-center gap-2 w-full justify-start"
                  >
                    <Sparkles class="size-4" />
                    Подтвердить email
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive active:bg-destructive/10 active:scale-[0.98] transition-all duration-100"
                  @click="logout()"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line
                      x1="21"
                      x2="9"
                      y1="12"
                      y2="12"
                    />
                  </svg>
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <!-- АВТОРИЗОВАН -->
        <template v-else-if="user.isConfirmed === true">
          <!-- Аватар пользователя (Отображается и на десктопе, и на мобилке) -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                class="flex items-center relative rounded-md ring-2 ring-border ring-offset-2 ring-offset-background transition-all hover:ring-primary/50 outline-none"
              >
                <UserAvatar />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              class="w-56 mt-2"
            >
              <UserHeader />
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  class="text-primary/90 data-highlighted:bg-primary-muted/80 data-highlighted:text-primary active:bg-primary-muted/80 active:scale-[0.98] transition-all duration-100"
                >
                  <NuxtLink
                    to="/workspace"
                    class="flex items-center gap-2 w-full justify-start"
                  >
                    <Sparkles class="size-4" />
                    В пространство
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive active:bg-destructive/10 active:scale-[0.98] transition-all duration-100"
                  @click="logout()"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line
                      x1="21"
                      x2="9"
                      y1="12"
                      y2="12"
                    />
                  </svg>
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <!-- МОБИЛЬНЫЙ ГАМБУРГЕР (Только переключатель состояния) -->
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden hover:bg-primary/5 transition-colors relative ml-1"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Меню"
        >
          <transition
            enter-active-class="transition-all duration-300 ease-out absolute inset-0 m-auto flex items-center justify-center"
            leave-active-class="transition-all duration-300 ease-in absolute inset-0 m-auto flex items-center justify-center"
            enter-from-class="opacity-0 rotate-90 scale-50"
            enter-to-class="opacity-100 rotate-0 scale-100"
            leave-from-class="opacity-100 rotate-0 scale-100"
            leave-to-class="opacity-0 -rotate-90 scale-50"
          >
            <!-- Иконка закрытия (X) -->
            <svg
              v-if="isMobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>

            <!-- Иконка Гамбургера (Menu) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                x1="4"
                x2="20"
                y1="12"
                y2="12"
              />
              <line
                x1="4"
                x2="20"
                y1="6"
                y2="6"
              />
              <line
                x1="4"
                x2="20"
                y1="18"
                y2="18"
              />
            </svg>
          </transition>
        </Button>
      </div>
    </div>

    <!-- ВЫПАДАЮЩЕЕ МОБИЛЬНОЕ МЕНЮ (Под хедером) -->
    <Transition
      enter-active-class="transition-[opacity,transform] duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-[opacity,transform] duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-show="isMobileMenuOpen"
        class="absolute top-full left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-xl md:hidden overflow-hidden z-0"
      >
        <div class="flex flex-col px-4 py-6 gap-6 max-h-[80vh] overflow-y-auto">
          <!-- Декоративная линия -->
          <div
            class="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"
          ></div>

          <!-- Основная навигация -->
          <nav class="flex flex-col gap-1">
            <NuxtLink
              v-for="link in navigation.standalone"
              :key="link.href"
              :to="link.href"
              @click="isMobileMenuOpen = false"
              class="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-[0.98]"
            >
              {{ link.name }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </NuxtLink>
          </nav>

          <!-- Нижняя панель (Действия / Авторизация) дублируется для удобства в меню -->
          <div class="mt-2 bg-muted/20 border border-border/50 rounded-2xl p-2 backdrop-blur-md">
            <!-- Состояние: ГОСТЬ -->
            <div
              v-if="!user"
              class="flex flex-col gap-3"
            >
              <Button
                variant="outline"
                class="w-full justify-center text-sm shadow-sm bg-background border-border"
                @click="isMobileMenuOpen = false"
              >
                <NuxtLink
                  to="/auth"
                  class="w-full text-center"
                  >Войти</NuxtLink
                >
              </Button>
              <Button
                class="w-full justify-center text-sm shadow-md"
                @click="isMobileMenuOpen = false"
              >
                <NuxtLink
                  to="/auth?step=signup"
                  class="w-full text-center"
                  >Начать работу</NuxtLink
                >
              </Button>
            </div>

            <!-- Состояние: НЕ ПОДТВЕРЖДЕН -->
            <div
              v-else-if="user.isConfirmed === false"
              class="flex flex-col gap-3"
            >
              <div
                class="flex items-center gap-3 p-1.5 rounded-lg bg-background/50 border border-border/60 shadow-sm mb-1"
              >
                <UserHeader />
              </div>

              <Button
                class="w-full justify-center text-sm shadow-md"
                @click="isMobileMenuOpen = false"
              >
                <NuxtLink
                  :to="verifyEmailHref"
                  class="w-full text-center"
                  >Подтвердить email</NuxtLink
                >
              </Button>

              <Button
                variant="ghost"
                class="w-full justify-center rounded-xl text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                @click="
                  () => {
                    logout()
                    isMobileMenuOpen = false
                  }
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line
                    x1="21"
                    x2="9"
                    y1="12"
                    y2="12"
                  />
                </svg>
                Выйти
              </Button>
            </div>

            <!-- Состояние: АВТОРИЗОВАН -->
            <div
              v-else-if="user.isConfirmed === true"
              class="flex flex-col gap-3"
            >
              <!-- Карточка пользователя внутри мобильного меню -->
              <div
                class="flex items-center gap-3 p-1.5 rounded-lg bg-background/50 border border-border/60 shadow-sm mb-1"
              >
                <UserHeader />
              </div>

              <Button
                class="w-full justify-center text-sm shadow-md transition-transform"
                @click="isMobileMenuOpen = false"
              >
                <NuxtLink
                  to="/workspace"
                  class="flex items-center gap-2 w-full justify-center"
                >
                  <Sparkles class="size-4" />
                  В пространство
                </NuxtLink>
              </Button>

              <Button
                variant="ghost"
                class="w-full justify-center rounded-xl text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                @click="
                  () => {
                    logout()
                    isMobileMenuOpen = false
                  }
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line
                    x1="21"
                    x2="9"
                    y1="12"
                    y2="12"
                  />
                </svg>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
