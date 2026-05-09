<script setup lang="ts">
import UserDropdown from '@/components/layout/UserDropdown.vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>

<template>
  <header class="header-glow fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] backdrop-blur-2xl bg-[#0a0a1a]/70">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2.5 group shrink-0">
          <div class="relative">
            <div class="absolute inset-0 bg-cyan-400/10 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img src="/icons/study-overlay/icone.png" alt="Study Overlay" class="relative w-14 h-14 object-contain" />
          </div>
          <span class="font-bold text-white text-base tracking-tight hidden sm:block">Study Overlay</span>
        </router-link>

        <nav class="flex items-center gap-0.5 sm:gap-1">
          <template v-if="user">
            <router-link to="/dashboard" class="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200">Dashboard</router-link>
            <router-link to="/settings" class="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200">Settings</router-link>
            <div class="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-white/[0.06]">
              <UserDropdown />
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200">Sign In</router-link>
            <router-link to="/register" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-cyan-500/20">Sign Up</router-link>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>
