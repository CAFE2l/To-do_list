<script setup lang="ts">
const plans = [
  { name: 'Free', price: 'R$ 0', desc: 'Para começar agora.', items: ['To Do List Overlay', 'Chat básico', 'Countdown simples', 'Uso em Browser Source'], cta: 'Começar grátis' },
  { name: 'Creator', price: 'Em breve', desc: 'Para elevar a identidade.', items: ['Mais overlays', 'Customização avançada', 'Temas extras', 'Widgets de comunidade'], cta: 'Entrar na lista', featured: true },
  { name: 'Pro', price: 'Em breve', desc: 'O pacote completo.', items: ['Overlays premium', 'Animações avançadas', 'Branding removido', 'Pacote completo para streamers'], cta: 'Conhecer o Pro' },
]
</script>
<template><main class="site-container page-shell"><section class="page-intro center"><p class="eyebrow">PLANOS SIMPLES • SEM SURPRESAS</p><h1>Comece grátis. Evolua quando <em>fizer sentido.</em></h1><p>Uma base completa para colocar sua live no ar e novos recursos para crescer com sua comunidade.</p></section><section class="pricing-grid"><article v-for="plan in plans" :key="plan.name" :class="{ featured: plan.featured }"><small v-if="plan.featured">MAIS ESCOLHIDO</small><h2>{{ plan.name }}</h2><strong>{{ plan.price }}</strong><p>{{ plan.desc }}</p><ul><li v-for="item in plan.items" :key="item">✓ {{ item }}</li></ul><button>{{ plan.cta }} <span>↗</span></button></article></section></main></template>
