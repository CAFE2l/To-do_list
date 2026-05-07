<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { isAuthenticated } = useAuth()
const router = useRouter()

function handleCta() {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/register')
  }
}
</script>

<template>
  <div class="min-h-screen">
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-overlay-950/50 via-transparent to-transparent pointer-events-none"></div>
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-overlay-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-overlay-500/10 border border-overlay-500/20 text-overlay-300 text-sm font-medium mb-8">
            <span class="w-2 h-2 rounded-full bg-overlay-400 animate-pulse"></span>
            Free &amp; Open for everyone
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Turn your study goals into a
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-overlay-400 via-purple-400 to-pink-400">beautiful live overlay</span>
          </h1>

          <p class="mt-6 text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Create tasks, track your progress, and share your focus session with your audience using a gorgeous transparent overlay for OBS.
          </p>

          <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button @click="handleCta" class="btn-primary text-lg px-8 py-4">
              Create my overlay
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-24 max-w-lg mx-auto">
          <div class="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-overlay-500 to-purple-600 flex items-center justify-center text-white text-sm">☑</div>
                <div>
                  <p class="text-white font-semibold text-sm">Study Tasks</p>
                  <p class="text-[10px] text-overlay-300/50 font-medium uppercase">Overlay v2.0</p>
                </div>
              </div>
              <div class="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span class="text-red-400 text-[10px] font-bold uppercase">Live</span>
              </div>
            </div>
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-white/40">Progresso</span>
                <span class="text-xs text-overlay-300 font-semibold">3 / 5</span>
              </div>
              <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div class="h-full w-[60%] rounded-full bg-gradient-to-r from-overlay-500 to-purple-500"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] border-l-[3px] border-l-red-500/40">
                <div class="w-4 h-4 rounded border-2 border-white/20"></div>
                <span class="text-xs text-white/70">Complete React module</span>
              </div>
              <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] border-l-[3px] border-l-yellow-500/40">
                <div class="w-4 h-4 rounded border-2 border-white/20"></div>
                <span class="text-xs text-white/70">Review TypeScript notes</span>
              </div>
              <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] border-l-[3px] border-l-green-500/40">
                <div class="w-4 h-4 rounded border-2 border-white/20"></div>
                <span class="text-xs text-white/70">Read chapter 4</span>
              </div>
              <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] border-l-[3px] border-l-green-500/40 opacity-50">
                <div class="w-4 h-4 rounded bg-gradient-to-br from-overlay-500 to-purple-500 flex items-center justify-center">
                  <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-xs text-white/50 line-through">Practice algorithms</span>
              </div>
              <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] border-l-[3px] border-l-green-500/40 opacity-50">
                <div class="w-4 h-4 rounded bg-gradient-to-br from-overlay-500 to-purple-500 flex items-center justify-center">
                  <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-xs text-white/50 line-through">Set up dev environment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 class="text-3xl font-bold text-white text-center mb-16">How it works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-overlay-500/20 to-overlay-500/5 border border-overlay-500/20 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-overlay-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Sign in with Google</h3>
            <p class="text-sm text-white/40 leading-relaxed">Quick and secure authentication. No passwords needed.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Add your study tasks</h3>
            <p class="text-sm text-white/40 leading-relaxed">Create, edit, and prioritize your tasks in a beautiful dashboard.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Paste into OBS</h3>
            <p class="text-sm text-white/40 leading-relaxed">Copy your overlay link and add it as a Browser Source in OBS.</p>
          </div>
        </div>
      </section>

      <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 class="text-3xl font-bold text-white text-center mb-16">Features</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-200">
            <div class="w-10 h-10 rounded-xl bg-overlay-500/10 border border-overlay-500/20 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-overlay-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-white mb-1.5">Real-time tasks</h3>
            <p class="text-xs text-white/40">Changes sync instantly. Your overlay updates live.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-200">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-white mb-1.5">OBS-ready overlay</h3>
            <p class="text-xs text-white/40">Transparent background, optimized for streaming.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-200">
            <div class="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-white mb-1.5">Custom themes</h3>
            <p class="text-xs text-white/40">Personalize colors, width, opacity, and more.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-200">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-white mb-1.5">Free to use</h3>
            <p class="text-xs text-white/40">No payment required. Free for everyone.</p>
          </div>
        </div>
      </section>

      <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div class="max-w-2xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-overlay-500/10 via-purple-500/5 to-transparent border border-overlay-500/20">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to share your focus?</h2>
          <p class="text-white/50 mb-8">Join and create your study overlay in seconds.</p>
          <button @click="handleCta" class="btn-primary text-lg px-8 py-4">
            Get started free
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
