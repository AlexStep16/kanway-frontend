import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'

interface Tip {
  title: string
  description: string
  anchorElement: HTMLElement | null
  buttonNextText: string
  clonedAnchorElement?: HTMLElement | null
}

export const useTipsStore = defineStore('tips', () => {
  const tipsStack = ref<Tip[]>([])
  const currentTip = ref<Tip | null>(null)

  const UI_STORE = useUIStore()

  function $reset() {
    tipsStack.value = []
    destroyClonedAnchor()
    currentTip.value = null
  }

  function addTip(tip: Tip) {
    tipsStack.value.push(tip)

    if (!currentTip.value) {
      setCurrentTip(tip)
    }
  }

  function nextTip() {
    destroyClonedAnchor()

    tipsStack.value.shift()
    setCurrentTip(tipsStack.value[0] || null)
  }

  function setCurrentTip(tip: Tip) {
    currentTip.value = tip || null
    initTip()
  }

  function initTip() {
    if (currentTip.value && currentTip.value.anchorElement && UI_STORE.tipRef) {
      const anchor = currentTip.value.anchorElement
      const anchorClone = currentTip.value.anchorElement.cloneNode(true) as HTMLElement
      const tip = UI_STORE.tipRef

      if (window.FloatingUIDOM) {
        window.FloatingUIDOM.computePosition(anchor, tip, {
          placement: 'top-start',
          middleware: [
            window.FloatingUIDOM.offset(8),
            window.FloatingUIDOM.shift({ padding: 5 }),
            window.FloatingUIDOM.flip(),
          ],
        }).then(({ x, y }: any) => {
          Object.assign(tip.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
        })
      }

      transformClonedAnchor(anchorClone, anchor)
      currentTip.value.clonedAnchorElement = anchorClone

      document.body.appendChild(anchorClone)
    }
  }

  function destroyClonedAnchor() {
    if (currentTip.value && currentTip.value.clonedAnchorElement) {
      document.body.removeChild(currentTip.value.clonedAnchorElement)
      currentTip.value.clonedAnchorElement = null
    }
  }

  function transformClonedAnchor(anchorClone: HTMLElement, anchor: HTMLElement) {
    anchorClone.removeAttribute('id')
    anchorClone.style.position = 'fixed'
    anchorClone.style.zIndex = '201'
    anchorClone.style.pointerEvents = 'none'
    anchorClone.style.left = `${anchor.getBoundingClientRect().left}px`
    anchorClone.style.top = `${anchor.getBoundingClientRect().top}px`
    anchorClone.style.width = `${anchor.getBoundingClientRect().width}px`
    anchorClone.style.height = `${anchor.getBoundingClientRect().height}px`
  }

  function skip() {
    //will be implemented later
  }

  return {
    // State
    tipsStack,
    currentTip,

    // Actions
    $reset,
    addTip,
    nextTip,
    skip,
  }
})
