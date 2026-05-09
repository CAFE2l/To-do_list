<script setup lang="ts">
import { computed } from "vue";
import type { Task, OverlaySettings } from "@/types";

const props = defineProps<{
    tasks: Task[];
    settings: OverlaySettings;
}>();

const completedCount = computed(
    () => props.tasks.filter((t) => t.completed).length,
);
const progress = computed(() =>
    props.tasks.length === 0
        ? 0
        : Math.round((completedCount.value / props.tasks.length) * 100),
);
const allCompleted = computed(
    () => props.tasks.length > 0 && completedCount.value === props.tasks.length,
);
</script>

<template>
    <div
        class="overlay-container"
        :style="{
            width: settings.width + 'px',
            opacity: settings.opacity,
        }"
    >
        <div class="overlay-card led-border">
            <div class="scanline"></div>

            <div class="led-dot led-dot-tl"></div>
            <div class="led-dot led-dot-tr"></div>
            <div class="led-dot led-dot-bl"></div>
            <div class="led-dot led-dot-br"></div>

            <div class="led-side-dots left">
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
            </div>

            <div class="led-side-dots right">
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
            </div>

            <div class="p-5 relative z-10">
                <div class="overlay-header">
                    <div class="overlay-brand">
                        <img
                            src="/icons/study-overlay/icone.png"
                            alt="Study Overlay"
                            class="brand-icon w-14 h-14"
                        />
                        <div>
                            <h1
                                class="text-white font-bold text-base tracking-tight leading-tight"
                            >
                                {{ settings.title }}
                            </h1>
                            <p
                                class="text-[9px] text-cyan-400/50 font-semibold tracking-[0.15em] uppercase leading-tight mt-0.5"
                            >
                                Overlay v2.0
                            </p>
                        </div>
                    </div>

                    <div v-if="settings.showLiveBadge" class="live-badge">
                        <span class="live-dot"></span>
                        LIVE
                    </div>
                </div>

                <div v-if="settings.showProgress" class="mt-3">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs text-white/40 font-medium"
                            >Progresso</span
                        >
                        <span class="text-xs text-white/50 font-semibold"
                            >{{ completedCount }} / {{ tasks.length }}</span
                        >
                    </div>
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            :style="{ width: progress + '%' }"
                        ></div>
                    </div>
                </div>

                <div class="mt-4 space-y-2">
                    <div
                        v-if="tasks.length === 0"
                        class="flex flex-col items-center justify-center py-10 text-center empty-state"
                    >
                        <div class="empty-icon">
                            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                            </svg>
                        </div>
                        <p class="text-white/25 text-sm font-medium mt-2">
                            {{ settings.emptyText }}
                        </p>
                        <p class="text-white/15 text-xs mt-1">
                            Add tasks to get started
                        </p>
                    </div>

                    <div v-for="task in tasks" :key="task.id">
                        <div
                            v-if="
                                !task.completed || settings.showCompletedTasks
                            "
                            class="task-item group"
                            :class="[
                                'priority-' + task.priority,
                                { completed: task.completed },
                            ]"
                        >
                            <div class="flex items-center gap-2.5">
                                <div
                                    class="custom-checkbox"
                                    :class="{ checked: task.completed }"
                                ></div>
                                <span
                                    class="task-text text-sm text-white/80 group-hover:text-white/90 transition-colors"
                                    >{{ task.text }}</span
                                >
                            </div>
                            <span class="text-xs opacity-30">{{
                                task.priority === "high"
                                    ? "🔴"
                                    : task.priority === "medium"
                                      ? "🟡"
                                      : "🟢"
                            }}</span>
                        </div>
                    </div>

                    <div
                        v-if="allCompleted"
                        class="flex flex-col items-center justify-center pt-4 pb-2"
                    >
                        <div class="success-icon mb-2">
                            <svg
                                class="w-8 h-8 text-cyan-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p class="text-sm font-semibold text-cyan-400">
                            Session complete
                        </p>
                        <p class="text-xs text-white/30 mt-0.5">
                            All tasks completed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay-container {
    margin: 0 auto;
}

.overlay-card {
    background: linear-gradient(
        135deg,
        rgba(5, 8, 22, 0.96),
        rgba(10, 18, 35, 0.92),
        rgba(5, 8, 22, 0.96)
    );
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    animation: cardGlow 4s ease-in-out infinite;
}

@keyframes cardGlow {
    0%,
    100% {
        box-shadow:
            0 0 12px rgba(34, 211, 238, 0.2),
            0 0 30px rgba(59, 130, 246, 0.16),
            0 0 60px rgba(6, 182, 212, 0.08),
            inset 0 0 30px rgba(34, 211, 238, 0.02);
    }
    50% {
        box-shadow:
            0 0 20px rgba(34, 211, 238, 0.28),
            0 0 50px rgba(59, 130, 246, 0.2),
            0 0 80px rgba(6, 182, 212, 0.12),
            inset 0 0 40px rgba(34, 211, 238, 0.04);
    }
}

@keyframes livePulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
}

.overlay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 4px;
}

.overlay-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.brand-icon {
    object-fit: contain;
    filter: drop-shadow(0 0 150px rgba(34, 211, 238, 0.4));
}

.live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.28);
    color: #f87171;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    flex-shrink: 0;
}

.live-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #ef4444;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
    animation: livePulse 1.4s ease-in-out infinite;
}

.empty-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: rgba(34, 211, 238, 0.06);
    border: 1px solid rgba(34, 211, 238, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(34, 211, 238, 0.3);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.04);
}

.success-icon {
    animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes successPop {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
