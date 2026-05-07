<script setup lang="ts">
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f2035] to-[#0a1628]"></div>

    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/5 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-blue-400/15 to-cyan-500/5 blur-[100px]"></div>
      <div class="absolute top-[40%] left-[30%] w-[40%] h-[30%] rounded-full bg-gradient-to-r from-emerald-400/8 to-cyan-500/8 blur-[80px]"></div>
      <div class="absolute top-[20%] right-[10%] w-[25%] h-[25%] rounded-full bg-gradient-to-bl from-sky-400/10 to-transparent blur-[90px]"></div>
    </div>

    <svg class="absolute bottom-0 left-0 w-full h-auto opacity-[0.04]" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="url(#waveGrad)" d="M0,160 C320,280 480,80 720,160 C960,240 1120,80 1440,160 L1440,320 L0,320 Z">
        <animate attributeName="d" dur="20s" repeatCount="indefinite"
          values="M0,160 C320,280 480,80 720,160 C960,240 1120,80 1440,160 L1440,320 L0,320 Z;
                  M0,200 C320,80 480,240 720,120 C960,200 1120,40 1440,180 L1440,320 L0,320 Z;
                  M0,160 C320,280 480,80 720,160 C960,240 1120,80 1440,160 L1440,320 L0,320 Z"
        />
      </path>
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>

    <svg class="absolute bottom-0 left-0 w-full h-auto opacity-[0.03]" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="url(#waveGrad2)" d="M0,240 C360,100 540,280 720,160 C900,40 1080,200 1440,120 L1440,320 L0,320 Z">
        <animate attributeName="d" dur="15s" repeatCount="indefinite"
          values="M0,240 C360,100 540,280 720,160 C900,40 1080,200 1440,120 L1440,320 L0,320 Z;
                  M0,180 C360,280 540,100 720,220 C900,100 1080,240 1440,160 L1440,320 L0,320 Z;
                  M0,240 C360,100 540,280 720,160 C900,40 1080,200 1440,120 L1440,320 L0,320 Z"
        />
      </path>
      <defs>
        <linearGradient id="waveGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>

    <div class="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-cyan-400/30 blur-[1px]"
      style="animation: floatParticle 12s ease-in-out infinite">
    </div>
    <div class="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-blue-400/20 blur-[2px]"
      style="animation: floatParticle 15s ease-in-out infinite 1s">
    </div>
    <div class="absolute top-2/3 left-1/3 w-1 h-1 rounded-full bg-emerald-400/20 blur-[1px]"
      style="animation: floatParticle 10s ease-in-out infinite 2s">
    </div>
    <div class="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-sky-400/20 blur-[2px]"
      style="animation: floatParticle 14s ease-in-out infinite 0.5s">
    </div>
    <div class="absolute top-3/4 left-1/2 w-1 h-1 rounded-full bg-cyan-300/15 blur-[1px]"
      style="animation: floatParticle 11s ease-in-out infinite 3s">
    </div>
    <div class="absolute top-1/5 right-1/5 w-2 h-2 rounded-full bg-blue-300/10 blur-[3px]"
      style="animation: floatParticle 18s ease-in-out infinite 1.5s">
    </div>

    <div class="absolute top-[15%] left-[10%] w-16 h-16 border border-cyan-400/5 rounded-full backdrop-blur-sm"
      style="animation: floatBubble 20s ease-in-out infinite">
    </div>
    <div class="absolute top-[55%] right-[12%] w-24 h-24 border border-blue-400/5 rounded-full backdrop-blur-sm"
      style="animation: floatBubble 25s ease-in-out infinite 3s">
    </div>
    <div class="absolute bottom-[25%] left-[20%] w-12 h-12 border border-emerald-400/5 rounded-full backdrop-blur-sm"
      style="animation: floatBubble 18s ease-in-out infinite 5s">
    </div>
    <div class="absolute top-[30%] right-[25%] w-20 h-20 border border-sky-400/5 rounded-full backdrop-blur-sm"
      style="animation: floatBubble 22s ease-in-out infinite 1s">
    </div>

    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"></div>
  </div>
</template>

<style scoped>
@keyframes floatParticle {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
  25% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
  50% { transform: translateY(-15px) translateX(-5px); opacity: 0.2; }
  75% { transform: translateY(-40px) translateX(15px); opacity: 0.5; }
}

@keyframes floatBubble {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
  33% { transform: translateY(-20px) scale(1.05); opacity: 0.6; }
  66% { transform: translateY(-10px) scale(0.95); opacity: 0.3; }
}
</style>
