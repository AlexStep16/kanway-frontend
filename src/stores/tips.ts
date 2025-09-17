import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRootStore } from './root';
import { watchOnce } from '@vueuse/core';
import { useData } from 'vike-vue/useData';
import Tip from '../Interfaces/Tip';
import * as userFunctions from '../helpers/user';

export const useTipsStore = defineStore('tips', () => {
  const STORE = useRootStore();

  const isTipsInProgress = ref<boolean>(false);
  const progress = ref({
    start: false,
    generation: false,
    createWorkspace: false,
    createBoard: false,
    createCategory: false,
    createTask: false,
    saveGenerationResults: false,
    feedback: false
  });

  if (typeof localStorage !== 'undefined') {
    const localStorageProgress = localStorage ? localStorage.getItem("tipsProgress") : null;

    if (localStorageProgress) {
      progress.value = JSON.parse(localStorageProgress);
    }
  }

  const currentTip = ref<Tip | null>(null);
  const boardAITipsOverlayTarget = ref<HTMLElement | null>(null);
  const boardAIZIndexTipsRef = ref<HTMLElement | null>(null);
  const boardAIAnchorTipsRef = ref<HTMLElement | null>(null);
  const createWorkspaceTipsOverlayTarget = ref<HTMLElement | null>(null);
  const createWorkspaceAnchorTipsRef = ref<HTMLElement | null>(null);
  const createBoardTipsOverlayTarget = ref<HTMLElement | null>(null);
  const createBoardAnchorTipsRef = ref<HTMLElement | null>(null);
  const createCategoriesOverlayTarget = ref<HTMLElement | null>(null);
  const createCategoriesAnchorTipsRef = ref<HTMLElement | null>(null);
  const saveGenerationOverlayTargetRef = ref<HTMLElement | null>(null);
  const saveGenerationAnchorTipsRef = ref<HTMLElement | null>(null);
  const feedbackOverlayTargetRef = ref<HTMLElement | null>(null);
  const feedbackAnchorTipsRef = ref<HTMLElement | null>(null);

  const routeParams = useData<{ boardId?: string }>();

  const overlay = ref<HTMLElement | null>(null);
  let intersectionObserver = null;

  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting && observer.value) {
          observer.value.unobserve(entry.target);

          if (STORE.user.is_tips_completed) return;

          setTimeout(() => {
            const tip = getTipByType(entry.target?.dataset?.tipType);

            if (tip) {
              if (!progress.value[tip.type as "start" | "generation" | "createWorkspace" | "createBoard" | "createCategory" | "createTask"]) {
                if (currentTip.value === null) {
                  currentTip.value = tip;
                }

                tipsStack.value.push(tip);
              }
              if (currentTip.value === tip) updateTip(tip);
              updateTipCoords(tip, entry.target.getBoundingClientRect());
            }
          }, 500);
        }
      })
    });
  }

  const observer = ref(intersectionObserver);

  function watchObserve(newRef: any) {
    if (newRef instanceof Element && observer.value) {
      observer.value.observe(newRef);
    }
  }

  watchOnce(boardAIAnchorTipsRef, watchObserve);
  watchOnce(createWorkspaceAnchorTipsRef, watchObserve);
  watchOnce(createBoardAnchorTipsRef, watchObserve);
  watchOnce(saveGenerationAnchorTipsRef, watchObserve);
  watchOnce(feedbackAnchorTipsRef, watchObserve);

  const showTips = ref<boolean>(false);

  function $reset() {
    isTipsInProgress.value = false;
    progress.value = {
      start: false,
      generation: false,
      createWorkspace: false,
      createBoard: false,
      createCategory: false,
      createTask: false,
      saveGenerationResults: false,
      feedback: false
    };
    currentTip.value = null;
    boardAITipsOverlayTarget.value = null;
    boardAIZIndexTipsRef.value = null;
    boardAIAnchorTipsRef.value = null;
    createWorkspaceTipsOverlayTarget.value = null;
    createWorkspaceAnchorTipsRef.value = null;
    createBoardTipsOverlayTarget.value = null;
    createBoardAnchorTipsRef.value = null;
    createCategoriesOverlayTarget.value = null;
    createCategoriesAnchorTipsRef.value = null;
    saveGenerationOverlayTargetRef.value = null;
    saveGenerationAnchorTipsRef.value = null;
    feedbackOverlayTargetRef.value = null;
    feedbackAnchorTipsRef.value = null;
    overlay.value = null;
    observer.value?.disconnect();
    isTipsInProgress.value = false;
    tipsStack.value = [];
    showTips.value = false;
  }

  function getTipByType(type: string) {
    return tips.value.find(tip => tip.type === type);
  }

  const tips = ref<Tip[]>([
    {
      title: 'Давайте начнем!',
      type: "start",
      coords: {
        x: 0,
        y: 0
      },
      progress: computed(() => (progress.value.start)),
      currentRef: { value: null }
    },
    {
      title: 'Генерация',
      type: "generation",
      overlayTarget: computed(() => (boardAITipsOverlayTarget.value)),
      zIndexRefElement: computed(() => (boardAIZIndexTipsRef.value)),
      anchor: computed(() => (boardAIAnchorTipsRef.value)),
      progress: computed(() => (progress.value.generation)),
      currentRef: { value: null },
      coords: {
        x: 0,
        y: 0
      }
    },
    {
      title: 'Рабочие пространства',
      type: "createWorkspace",
      overlayTarget: computed(() => (createWorkspaceTipsOverlayTarget.value)),
      zIndexRefElement: computed(() => (createWorkspaceAnchorTipsRef.value)),
      anchor: computed(() => (createWorkspaceAnchorTipsRef.value)),
      progress: computed(() => (progress.value.createWorkspace)),
      currentRef: { value: null },
      coords: {
        x: 0,
        y: 0
      }
    },
    {
      title: 'Доски',
      type: "createBoard",
      overlayTarget: computed(() => (createBoardTipsOverlayTarget.value)),
      zIndexRefElement: computed(() => (createBoardAnchorTipsRef.value)),
      anchor: computed(() => (createBoardAnchorTipsRef.value)),
      progress: computed(() => (progress.value.createBoard)),
      currentRef: { value: null },
      coords: {
        x: 0,
        y: 0
      }
    },
    {
      title: 'Категории',
      type: "createCategory",
      overlayTarget: null,
      zIndexRefElement: null,
      anchor: null,
      progress: computed(() => (progress.value.createCategory)),
      currentRef: { value: null },
      coords: {
        x: 0,
        y: 0
      }
    },
    {
      title: 'Задачи',
      type: "createTask",
      overlayTarget: null,
      zIndexRefElement: null,
      anchor: null,
      coords: {
        x: 0,
        y: 0
      },
      progress: computed(() => (progress.value.createTask)),
      currentRef: { value: null }
    },
    {
      title: 'Сохранение результатов',
      type: "saveGenerationResults",
      overlayTarget: computed(() => (saveGenerationOverlayTargetRef.value)),
      zIndexRefElement: computed(() => (saveGenerationAnchorTipsRef.value)),
      anchor: computed(() => (saveGenerationAnchorTipsRef.value)),
      coords: {
        x: 0,
        y: 0
      },
      progress: computed(() => (progress.value.saveGenerationResults)),
      currentRef: { value: null }
    },
    {
      title: 'Отзывы',
      type: "feedback",
      overlayTarget: computed(() => (feedbackAnchorTipsRef.value)),
      zIndexRefElement: computed(() => (feedbackAnchorTipsRef.value)),
      anchor: computed(() => (feedbackAnchorTipsRef.value)),
      coords: {
        x: 0,
        y: 0
      },
      progress: computed(() => (progress.value.feedback)),
      currentRef: { value: null }
    }
  ]);

  const tipsStack = ref<Tip[]>([]);

  watch(currentTip, (newTip) => {
    if (routeParams.boardId === "settings") return;

    if (newTip === null) showTips.value = false;
    else if (localStorage.getItem("isClickedPremium") !== "true") showTips.value = true;
  })

  function updateTip(tip: any) {
    if (!tip) return;

    const overlayTarget = tip.overlayTarget;
    const type = tip.type;

    const zIndexRef = tip.zIndexRefElement;

    if (zIndexRef) {
      zIndexRef.classList.add("show-for-tips");

      if (type && ["createWorkspace", "createBoard", "createCategory", "createTask", "saveGenerationResults"].includes(type)) zIndexRef.classList.add("tips-shadow");

      if (overlay.value && overlayTarget) {
        overlayTarget.appendChild(overlay.value);
      }
    }
  }

  function updateTipCoords(tip: Tip | null, boundingRect: any) {
    if (tip === null) return;
    const anchor = tip.anchor;
    const type = tip.type;
    const windowWidth = window.innerWidth;

    if (anchor) {
      const container = boundingRect;
      const width = tip.currentRef.value?.offsetWidth;
      const height = tip.currentRef.value?.offsetHeight;
      const coords = tip.coords;

      if (type === "generation") {
        coords.x = container.left;
        coords.y = container.top - (height ?? 0) - 40;
      } else if (type === "createWorkspace" || type === "createBoard") {
        coords.x = container.left - (width ?? 0) + 60;
        coords.y = container.top + 40;
      } else if (type === "createCategory") {
        coords.x = container.right + 7;
        coords.y = container.top - ((height ?? 0) / 2) + 20;

        if (windowWidth < 400) {
          coords.x = null;
          coords.y = container.bottom + 7;
        }
      } else if (type === "createTask") {
        coords.x = container.left;
        coords.y = container.top + 50;
      } else if (type === "saveGenerationResults") {
        coords.x = container.right - (width ?? 0);
        coords.y = container.top - (height ?? 0) - 20;
      } else if (type === "feedback") {
        coords.x = container.left;
        coords.y = container.top - (height ?? 0) - 20;
      }
    }
  }

  async function finishTip(tip: Tip) {
    if (!tip) return;

    const zIndexRefPrev = tip.zIndexRefElement;
    const anchorPrev = tip.anchor;
    const typePrev = tip.type;

    progress.value[typePrev as "start" | "generation" | "createWorkspace" | "createBoard" | "createCategory" | "createTask" | "saveGenerationResults" | "feedback"] = true;

    if (zIndexRefPrev) {
      zIndexRefPrev.classList.remove("show-for-tips");
    }

    if (anchorPrev) {
      anchorPrev.classList.remove("tips-shadow");
    }

    updateLocalStorage();

    const isTipsCompleted = checkForCompletion();

    if (isTipsCompleted) {
      await userFunctions.sendCompletionTips(true);

      localStorage.removeItem('tipsProgress');
    }
  }

  function checkForCompletion() {
    let isTipsCompleted = true;

    for (const [key, value] of Object.entries(progress.value)) {
      if (value === false) isTipsCompleted = false;
    }

    return isTipsCompleted;
  }

  function updateLocalStorage() {
    localStorage.setItem('tipsProgress', JSON.stringify(progress.value));
  }

  async function skipTips() {
    currentTip.value = null;
    tipsStack.value.length = 0;
    isTipsInProgress.value = false;
    observer.value?.disconnect();

    await userFunctions.sendCompletionTips(true);

    localStorage.removeItem('tipsProgress');
  }

  return {
    isTipsInProgress,
    boardAITipsOverlayTarget,
    boardAIZIndexTipsRef,
    boardAIAnchorTipsRef,
    createWorkspaceTipsOverlayTarget,
    createWorkspaceAnchorTipsRef,
    createBoardTipsOverlayTarget,
    createBoardAnchorTipsRef,
    createCategoriesOverlayTarget,
    createCategoriesAnchorTipsRef,
    saveGenerationOverlayTargetRef,
    saveGenerationAnchorTipsRef,
    feedbackOverlayTargetRef,
    feedbackAnchorTipsRef,
    progress,
    showTips,
    currentTip,
    tips,
    tipsStack,
    overlay,
    observer,
    finishTip,
    skipTips,
    getTipByType,
    updateTip,
    updateTipCoords,
    $reset
  }
})