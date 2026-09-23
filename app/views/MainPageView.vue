<script setup lang="ts">
import AOS from 'aos'
import Hero from '~/components/MainPage/Hero.vue'
import Why from '~/components/MainPage/Why.vue'
import CommandCenter from '~/components/MainPage/CommandCenter.vue'
import Control from '~/components/MainPage/Control/Control.vue'
import Prices from '~/components/MainPage/Prices.vue'
import FAQ from '~/components/MainPage/FAQ.vue'
import Ready from '~/components/MainPage/Ready.vue'
import Footer from '~/components/MainPage/Footer.vue'
import CookieBanner from '~/components/CookieBanner.vue'
import DemoPlan from '~/components/Workspace/Main/Chat/Demo/DemoPlan.vue'
import DemoConfirmation from '~/components/Workspace/Main/Chat/Demo/DemoConfirmation.vue'
import DemoCancel from '~/components/Workspace/Main/Chat/Demo/DemoCancel.vue'
import Header from '~/components/Header.vue'

const activeTab = shallowRef<typeof DemoPlan>(DemoPlan)
const chatStore = useChatStore()

const { demoChatApprovedTag, demoChatRejectedTag } = storeToRefs(chatStore)

watch(demoChatApprovedTag, () => {
  activeTab.value = DemoConfirmation
})

watch(demoChatRejectedTag, () => {
  activeTab.value = DemoCancel
})

onMounted(() => {
  AOS.init()
})
</script>

<template>
  <div class="flex flex-col min-h-screen w-full bg-white">
    <div class="flex flex-col relative h-full overflow-hidden">
      <Header />
      <Hero />
    </div>

    <Why id="why" />
    <CommandCenter id="command-center" />

    <Control
      v-model:activeTab="activeTab"
      id="control"
    />

    <Prices id="prices" />

    <FAQ id="faq" />
    <Ready />

    <Footer />
    <CookieBanner />
  </div>
</template>
