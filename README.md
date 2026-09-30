<div align="center">

# ⚡ Kanway Frontend (Web Client)

**Клиентская часть AI-управляемого таск-трекера нового поколения**  
*Автономный канбан с AI-агентом: изменение доски на лету по переписке в чате и голосовым командам*

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3.5](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn-vue](https://img.shields.io/badge/UI-shadcn--vue-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://www.shadcn-vue.com/)
[![Sentry](https://img.shields.io/badge/Sentry-10.x-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)
[![pnpm 11](https://img.shields.io/badge/pnpm-11.x-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

</div>

---

## 📸 Демонстрация и интерфейс

<div align="center">
  <h3>🎥 Видео-демонстрация работы AI-агента и голосового ввода</h3>

https://github.com/user-attachments/assets/b79dc168-a71e-42a7-a19b-477192894259


</div>

<br />

### 🖼️ Скриншоты ключевых сценариев

<table width="100%">
  <tr>
    <td width="50%" align="center">
      <b>1. Рабочее пространство и канбан-доска</b><br /><br />
      <img src="public/1.png" alt="Канбан-доска" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%" align="center">
      <b>2. Диалог с AI-агентом (Chat-as-UI)</b><br /><br />
      <img src="public/2.png" alt="Чат с агентом" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <b>3. Распознавание голоса и быстрые команды</b><br /><br />
      <img src="public/3.png" alt="Голосовой ввод" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%" align="center">
      <b>4. Автоимпорт (Trello / Яндекс Трекер)</b><br /><br />
      <img src="public/4.png" alt="Импорт задач" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
</table>

---

## ✨ Ключевые архитектурные фичи

- **🎙️ Chat-as-UI & Voice-to-Action:** Паттерн диалогового управления доской. Встроенная запись аудио, передача в STT-пайплайн и мгновенная перерисовка карточек по событиям без перезагрузки страниц.
- **📋 Reactive Kanban Board:** Перетаскивание колонок и задач на базе `vuedraggable` с поддержкой WIP-лимитов, приоритетов, дедлайнов и тегов.
- **💬 Рендеринг ответов AI:** Поддержка Markdown-разметки сообщений агента через `showdown` с подсветкой синтаксиса и форматированием списков.
- **⚡ Гибридный рендеринг (Nitro Hybrid Route Rules):**
  - **SSG / Prerender:** Маркетинговые страницы (`/`, `/privacy`, `/terms`, `/cookies`) компилируются статически для мгновенной загрузки и Core Web Vitals.
  - **Client-Side SPA:** Рабочая среда (`/workspace/**`), экраны входа (`/auth/**`) и оплаты (`/payment/**`) выполняются строго на клиенте (SSR: false) для реактивности и экономии серверных ресурсов.
- **🔄 Серверный кеш и стейт-менеджмент:** Связка `@tanstack/vue-query` (`@peterbud/nuxt-query`) и `pinia 3` для дедупликации сетевых запросов и предиктивного кеширования.
- **🛡️ Мониторинг и отказоустойчивость:** Интеграция `@sentry/vue 10` для трассировки ошибок и отлова сбоев интерфейса в реальном времени.
- **🧩 Современный UI-кит:** Полная интеграция `shadcn-nuxt` + `reka-ui`, выезжающие панели `vaul-vue`, иконки `@lucide/vue` и анимации `aos`.
- **🔐 Аутентификация:** Поддержка быстрого входа через Яндекс ID (Yandex Suggest SDK) и VK ID.

---

## 🛠️ Технологический стек

| Категория | Технологии и версии |
| :--- | :--- |
| **Фреймворк** | [Nuxt 4](https://nuxt.com/) (`^4.4.4`), [Vue 3](https://vuejs.org/) (`^3.5.33`) |
| **Язык** | [TypeScript](https://www.typescriptlang.org/) (`^6.0.3`, strict mode) |
| **Стилизация** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`), `@nuxt/fonts` (Inter, Raleway, Roboto), SCSS |
| **Компоненты** | [shadcn-nuxt](https://shadcn-vue.com/), [Reka UI](https://reka-ui.com/), [Vaul Vue](https://github.com/radix-vue/vaul-vue) (Drawer), `@lucide/vue` |
| **Стейт & Запросы** | [Pinia 3](https://pinia.vuejs.org/) (`^3.0.4`), [TanStack Vue Query v5](https://tanstack.com/query) (`^5.100.9`) |
| **Формы & Схемы** | [Vee-Validate 4](https://vee-validate.logaretm.com/), [Zod 4](https://zod.dev/) (`^4.4.3`) |
| **Мониторинг** | [Sentry Vue](https://sentry.io/) (`^10.75.2`) |
| **Мультимедиа & Текст** | `plyr` (аудио/видео плеер), `showdown` (Markdown парсер), `aos` (анимации при скролле) |
| **Утилиты** | [VueUse 14](https://vueuse.org/), `dayjs`, `lodash`, `p-queue`, `axios`, `uuid` |
| **Оптимизация сборки** | `vite-plugin-compression` (Gzip `.gz`), `vite-svg-loader`, `nuxt-svgo` |
| **Пакетный менеджер** | [pnpm 11](https://pnpm.io/) (`11.22.0`) |

---

## 📂 Структура репозитория

```text
├── app/                  # Основной контекст Nuxt 4 (pages, layouts, app.vue)
├── components/           # Vue-компоненты
│   ├── ui/               # Атомарные компоненты shadcn (button, dialog, input, etc.)
│   ├── kanban/           # Доска, колонки, карточки задач (vuedraggable)
│   └── chat/             # Чат-агент, голосовой ввод, аудио-визуализатор
├── composables/          # Автоимпортируемая бизнес-логика (useAuth, useKanban, useVoice)
├── utils/                # Хелперы и утилиты форматирования
├── assets/               # SCSS/CSS-стили, анимации, переходы
├── public/               # Статика, favicon, манифест, скриншоты и медиа
├── nuxt.config.ts        # Конфигурация Nitro, Route Rules, SEO и плагинов
└── package.json          # Конфигурация зависимостей и скриптов
