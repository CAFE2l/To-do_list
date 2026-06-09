<script setup lang="ts">
import { availableOverlays } from '@/data/overlays'
import OverlayRenderer from '@/components/overlays/OverlayRenderer.vue'
</script>
<template>
  <main>
    <section class="hero site-container">
      <div class="hero-copy">
        <p class="eyebrow"><i></i> STREAM TOOLS • BUILT FOR CREATORS</p>
        <h1>Overlays inteligentes para <em>streamers modernos.</em></h1>
        <p class="hero-text">Widgets bonitos, leves e customizáveis para transformar sua live em uma experiência profissional. Prontos para OBS, Streamlabs e sua comunidade.</p>
        <div class="hero-actions"><router-link to="/overlays" class="site-btn primary">Explorar overlays <span>↗</span></router-link><router-link to="/overlays/todo-list" class="site-btn ghost"><span>▷</span> Ver demonstração</router-link></div>
        <div class="trust-row"><span><b>16+</b> widgets</span><span><b>100%</b> browser source</span><span><b>0ms</b> setup complexo</span></div>
      </div>
      <div class="hero-visual">
        <div class="hero-orbit"></div><div class="visual-chip top">● AO VIVO</div><div class="visual-chip bottom">OBS READY</div>
        <div class="window-card"><header><span><i></i><i></i><i></i></span><small>overloom / scene-01</small><b>•••</b></header><OverlayRenderer id="todo-list" /></div>
      </div>
    </section>
    <section class="ticker"><div>OBS STUDIO <span>✦</span> STREAMLABS <span>✦</span> TWITCH <span>✦</span> YOUTUBE LIVE <span>✦</span> CREATOR TOOLS <span>✦</span> OBS STUDIO</div></section>
    <section class="site-section site-container">
      <div class="section-heading split"><div><p class="eyebrow">POR QUE OVERLOOM</p><h2>Menos configuração.<br><em>Mais presença.</em></h2></div><p>Uma biblioteca criada para se adaptar à sua identidade sem pesar na transmissão.</p></div>
      <div class="feature-grid">
        <article><b>01</b><span>⌘</span><h3>Fácil no OBS</h3><p>Copie a URL, adicione como Browser Source e comece a transmitir.</p></article>
        <article><b>02</b><span>◒</span><h3>Design responsivo</h3><p>Layouts nítidos e fluidos em qualquer resolução da sua cena.</p></article>
        <article><b>03</b><span>✦</span><h3>Sua identidade</h3><p>Temas, cores, textos e fontes que acompanham o seu estilo.</p></article>
        <article><b>04</b><span>∞</span><h3>Creator first</h3><p>Feito para streamers, comunidades e sessões de estudo ao vivo.</p></article>
      </div>
    </section>
    <section class="site-section site-container">
      <div class="section-heading"><p class="eyebrow">COLEÇÃO EM DESTAQUE</p><h2>Escolha sua próxima <em>camada.</em></h2></div>
      <div class="mini-showcase"><router-link v-for="overlay in availableOverlays.slice(0, 4)" :key="overlay.id" :to="`/overlays/${overlay.id}`" :style="{ '--accent': overlay.accent }"><span>{{ overlay.icon }}</span><small>{{ overlay.category }}</small><h3>{{ overlay.shortName }}</h3><b>Explorar ↗</b></router-link></div>
      <router-link to="/overlays" class="inline-link">Ver biblioteca completa <span>→</span></router-link>
    </section>
    <section class="site-section site-container"><div class="cta-panel"><p class="eyebrow">PRONTO PARA ENTRAR AO VIVO?</p><h2>Sua stream merece uma<br><em>interface memorável.</em></h2><router-link to="/customize" class="site-btn primary">Começar a customizar <span>↗</span></router-link></div></section>
  </main>
</template>
