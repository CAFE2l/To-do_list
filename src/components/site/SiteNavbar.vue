<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
const links = [
  { to: '/', label: 'Início' }, { to: '/overlays', label: 'Overlays' },
  { to: '/how-to-use', label: 'Como usar' }, { to: '/pricing', label: 'Planos' }, { to: '/about', label: 'Sobre' },
]
</script>
<template>
  <header class="site-nav"><div class="site-container nav-inner">
    <router-link to="/" class="brand" @click="open = false"><span class="brand-mark"><i></i><i></i><i></i></span><span>OVER<span>LOOM</span></span></router-link>
    <button class="mobile-toggle" aria-label="Abrir menu" @click="open = !open">☰</button>
    <nav :class="{ open }">
      <router-link v-for="link in links" :key="link.to" :to="link.to" @click="open = false">{{ link.label }}</router-link>
      <router-link to="/customize" class="nav-cta" @click="open = false">Customizar <span>↗</span></router-link>
    </nav>
  </div></header>
</template>
