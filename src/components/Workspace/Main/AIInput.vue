<script setup lang="ts">
import { Mic } from 'lucide-vue-next'

defineProps<{
  theme?: 'light' | 'dark'
  placeholder?: string
  noInputMargin?: boolean
}>()
</script>

<template>
  <div
    class="w-full relative p-3 rounded-md"
    :class="{
      'bg-gray-100': theme === 'dark',
      'border border-gray-200': theme === 'light' || !theme,
      ' mb-3 mt-1.5': !noInputMargin,
    }"
  >
    <div class="flex gap-x-1 items-end">
      <div class="w-full min-h-8 flex items-center">
        <textarea
          class="block p-0 w-full ps-1 text-gray-700 bg-transparent placeholder:text-gray-500 border-none focus:ring-0 text-sm disabled:opacity-50 disabled:pointer-events-none resize-none"
          :placeholder="placeholder ? placeholder : 'Напишите что вы хотите сделать...'"
          data-hs-textarea-auto-height='{
                "defaultHeight": "auto"
              }'
          rows="1"
        ></textarea>
      </div>
      <div class="flex shrink-0 items-center gap-x-2">
        <button
          type="button"
          class="flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-200 size-8 rounded-md"
        >
          <Mic class="size-5" />
        </button>
        <button
          class="text-white bg-blue-500 px-3 text-xs font-medium hover:bg-blue-600 transition-colors duration-200 rounded-md inline-flex items-center gap-x-2 h-8"
        >
          Начать чат
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0,0,256,256"
            class="size-4"
          >
            <g
              fill="#ffffff"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
              style="mix-blend-mode: normal"
            >
              <g transform="scale(5.12,5.12)">
                <path
                  d="M49.306,26.548l-11.24,-3.613l-3.613,-11.241c-0.134,-0.414 -0.518,-0.694 -0.953,-0.694c-0.435,0 -0.819,0.28 -0.952,0.694l-3.613,11.241l-11.24,3.613c-0.415,0.133 -0.695,0.517 -0.695,0.952c0,0.435 0.28,0.819 0.694,0.952l11.24,3.613l3.613,11.241c0.134,0.414 0.518,0.694 0.953,0.694c0.435,0 0.819,-0.28 0.952,-0.694l3.613,-11.241l11.24,-3.613c0.415,-0.133 0.695,-0.517 0.695,-0.952c0,-0.435 -0.28,-0.819 -0.694,-0.952zM1.684,13.949l7.776,2.592l2.592,7.776c0.136,0.408 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l2.592,-7.776l7.776,-2.592c0.409,-0.135 0.684,-0.517 0.684,-0.948c0,-0.431 -0.275,-0.813 -0.684,-0.949l-7.776,-2.592l-2.592,-7.776c-0.135,-0.408 -0.517,-0.683 -0.948,-0.683c-0.431,0 -0.813,0.275 -0.948,0.684l-2.592,7.775l-7.776,2.592c-0.409,0.137 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949zM17.316,39.05l-5.526,-1.842l-1.842,-5.524c-0.135,-0.408 -0.517,-0.684 -0.948,-0.684c-0.431,0 -0.813,0.275 -0.948,0.684l-1.842,5.524l-5.525,1.842c-0.408,0.136 -0.684,0.518 -0.684,0.949c0,0.431 0.275,0.813 0.684,0.949l5.526,1.842l1.841,5.524c0.136,0.407 0.517,0.683 0.948,0.683c0.431,0 0.813,-0.275 0.948,-0.684l1.842,-5.524l5.526,-1.842c0.409,-0.136 0.684,-0.518 0.684,-0.948c0,-0.43 -0.275,-0.813 -0.684,-0.949z"
                ></path>
              </g>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
