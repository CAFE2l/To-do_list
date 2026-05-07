<script setup>
import { ref, computed, watch, onMounted } from "vue";

const tasks = ref([]);
const newTask = ref("");
const priority = ref("medium");
const nextId = ref(1);

onMounted(() => {
  const saved = localStorage.getItem("study-tasks");
  if (saved) {
    tasks.value = JSON.parse(saved);
    nextId.value = tasks.value.length
      ? Math.max(...tasks.value.map(t => t.id)) + 1
      : 1;
  }
});

watch(tasks, () => {
  localStorage.setItem("study-tasks", JSON.stringify(tasks.value));
}, { deep: true });

const completedCount = computed(() =>
  tasks.value.filter(task => task.completed).length
);

const progress = computed(() =>
  tasks.value.length === 0
    ? 0
    : (completedCount.value / tasks.value.length) * 100
);

const allCompleted = computed(() =>
  tasks.value.length > 0 && completedCount.value === tasks.value.length
);

function addTask() {
  const text = newTask.value.trim();
  if (!text) return;

  tasks.value.push({
    id: nextId.value++,
    text,
    priority: priority.value,
    completed: false,
    removing: false
  });

  newTask.value = "";
}

function deleteTask(id) {
  const task = tasks.value.find(t => t.id === id);
  if (task) {
    task.removing = true;
    setTimeout(() => {
      tasks.value = tasks.value.filter(t => t.id !== id);
    }, 400);
  }
}

function clearCompleted() {
  tasks.value.forEach(task => {
    if (task.completed) task.removing = true;
  });
  setTimeout(() => {
    tasks.value = tasks.value.filter(t => !t.completed);
  }, 400);
}
</script>

<template>
  <div class="flex items-start justify-center min-h-screen p-4 font-inter">
    <div class="glass-card led-border rounded-2xl w-[380px] max-h-[90vh] flex flex-col relative">

      <div class="led-dot led-dot-tl"></div>
      <div class="led-dot led-dot-tr"></div>
      <div class="led-dot led-dot-bl"></div>
      <div class="led-dot led-dot-br"></div>

      <div class="led-side-dots left">
        <div class="led-side-dot" v-for="n in 5" :key="'l'+n"></div>
      </div>
      <div class="led-side-dots right">
        <div class="led-side-dot" v-for="n in 5" :key="'r'+n"></div>
      </div>

      <div class="scanline"></div>

      <div class="particle w-1 h-1 bg-indigo-400" style="top:15%;left:10%;animation:particleFloat1 8s ease-in-out infinite"></div>
      <div class="particle w-1.5 h-1.5 bg-purple-400" style="top:45%;right:8%;animation:particleFloat2 10s ease-in-out infinite"></div>
      <div class="particle w-1 h-1 bg-pink-400" style="top:75%;left:15%;animation:particleFloat3 9s ease-in-out infinite"></div>
      <div class="particle w-0.5 h-0.5 bg-indigo-300" style="top:30%;right:20%;animation:particleFloat1 7s ease-in-out infinite 1s"></div>
      <div class="particle w-1 h-1 bg-purple-300" style="top:60%;left:5%;animation:particleFloat2 11s ease-in-out infinite 2s"></div>

      <div class="header-glow px-5 pt-5 pb-3">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-lg shadow-indigo-500/30">☑</div>
            <div>
              <h1 class="text-white font-bold text-lg tracking-tight leading-tight">Study Tasks</h1>
              <p class="text-[11px] text-indigo-300/50 font-medium tracking-wide uppercase">Overlay v2.0</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
            <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span class="text-red-400 text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] text-white/40 font-medium">Progresso</span>
            <span class="counter text-[11px] text-indigo-300 font-semibold">{{ completedCount }} / {{ tasks.length }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :class="{ 'completed-all': allCompleted }" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>

      <form class="px-5 pb-3" @submit.prevent="addTask">
        <div class="flex gap-2">
          <input v-model="newTask" type="text" placeholder="Nova tarefa..." maxlength="60" class="task-input flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25" />
          <select v-model="priority" class="task-input rounded-xl px-2 py-2.5 text-xs text-indigo-300 cursor-pointer appearance-none" style="background-image:none">
            <option value="low" class="bg-gray-900">🟢</option>
            <option value="medium" class="bg-gray-900">🟡</option>
            <option value="high" class="bg-gray-900">🔴</option>
          </select>
          <button type="submit" class="add-btn rounded-xl px-3.5 py-2.5 text-white cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </form>

      <div class="flex-1 overflow-y-auto custom-scrollbar px-5 pb-4 space-y-2 max-h-[55vh]">
        <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
          <div class="w-16 h-16 rounded-2xl bg-white/[0.20] border border-white/[0.15] flex items-center justify-center mb-3">
            <span class="text-3xl opacity-30">📋</span>
          </div>
          <p class="text-white/25 text-sm font-medium">Nenhuma tarefa ainda</p>
          <p class="text-white/15 text-xs mt-1">Adicione uma tarefa para começar!</p>
        </div>

        <div v-for="task in tasks" :key="task.id"
          class="task-item flex items-center gap-3 p-3 rounded-xl border border-white/[0.15] bg-white/[0.08]"
          :class="['priority-' + task.priority, { completed: task.completed, removing: task.removing }]"
        >
          <input type="checkbox" v-model="task.completed" class="custom-checkbox" />
          <span class="task-text text-sm text-white/80 flex-1 leading-snug">{{ task.text }}</span>
          <span class="text-[10px] opacity-50">{{ task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢" }}</span>
          <button type="button" @click="deleteTask(task.id)" class="task-delete w-7 h-7 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-red-400 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="px-5 pb-4 pt-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-white/20 font-medium uppercase tracking-wider">{{ tasks.length }} tarefa{{ tasks.length !== 1 ? 's' : '' }}</span>
          <button v-if="completedCount > 0" type="button" @click="clearCompleted" class="text-[10px] text-white/20 hover:text-red-400/80 transition-colors duration-300 font-medium uppercase tracking-wider cursor-pointer">Limpar concluídas</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: transparent;
  min-height: 100vh;
  overflow: hidden;
}

@keyframes ledBorder {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes ledPulse {
  0%, 100% { opacity: 1; filter: blur(2px) brightness(1.5); }
  50% { opacity: 0.7; filter: blur(4px) brightness(1); }
}

@keyframes ledGlow {
  0%, 100% {
    box-shadow:
      0 0 5px rgba(99, 102, 241, 0.4),
      0 0 10px rgba(99, 102, 241, 0.3),
      0 0 20px rgba(99, 102, 241, 0.2),
      0 0 40px rgba(99, 102, 241, 0.1),
      inset 0 0 5px rgba(99, 102, 241, 0.1);
  }
  50% {
    box-shadow:
      0 0 10px rgba(168, 85, 247, 0.5),
      0 0 20px rgba(168, 85, 247, 0.4),
      0 0 40px rgba(168, 85, 247, 0.3),
      0 0 80px rgba(168, 85, 247, 0.2),
      inset 0 0 10px rgba(168, 85, 247, 0.15);
  }
}

@keyframes ledCorner1 {
  0% { box-shadow: 0 0 15px 3px rgba(99, 102, 241, 0.8); }
  33% { box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.8); }
  66% { box-shadow: 0 0 15px 3px rgba(236, 72, 153, 0.8); }
  100% { box-shadow: 0 0 15px 3px rgba(99, 102, 241, 0.8); }
}

@keyframes ledCorner2 {
  0% { box-shadow: 0 0 15px 3px rgba(236, 72, 153, 0.8); }
  33% { box-shadow: 0 0 15px 3px rgba(99, 102, 241, 0.8); }
  66% { box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.8); }
  100% { box-shadow: 0 0 15px 3px rgba(236, 72, 153, 0.8); }
}

@keyframes ledCorner3 {
  0% { box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.8); }
  33% { box-shadow: 0 0 15px 3px rgba(236, 72, 153, 0.8); }
  66% { box-shadow: 0 0 15px 3px rgba(99, 102, 241, 0.8); }
  100% { box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.8); }
}

@keyframes ledCorner4 {
  0% { box-shadow: 0 0 15px 3px rgba(244, 114, 182, 0.8); }
  33% { box-shadow: 0 0 15px 3px rgba(99, 102, 241, 0.8); }
  66% { box-shadow: 0 0 15px 3px rgba(168, 85, 247, 0.8); }
  100% { box-shadow: 0 0 15px 3px rgba(244, 114, 182, 0.8); }
}

@keyframes ledDotBlink {
  0%, 90%, 100% { opacity: 1; transform: scale(1); }
  95% { opacity: 0.3; transform: scale(0.6); }
}

@keyframes ledDotBlink2 {
  0%, 85%, 100% { opacity: 1; transform: scale(1); }
  92% { opacity: 0.2; transform: scale(0.5); }
}

@keyframes ledDotBlink3 {
  0%, 88%, 100% { opacity: 1; transform: scale(1); }
  94% { opacity: 0.3; transform: scale(0.7); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes fadeOutRight {
  to { opacity: 0; transform: translateX(60px) scale(0.9); max-height: 0; margin: 0; padding: 0; overflow: hidden; }
}

@keyframes checkmark {
  0% { transform: scale(0) rotate(-45deg); }
  50% { transform: scale(1.3) rotate(-45deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 15px rgba(168, 85, 247, 0.8); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes particleFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
  25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.25; }
  50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.1; }
  75% { transform: translate(15px, -15px) scale(1.1); opacity: 0.2; }
}

@keyframes particleFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
  30% { transform: translate(-15px, -25px) scale(0.9); opacity: 0.2; }
  60% { transform: translate(10px, -35px) scale(1.3); opacity: 0.15; }
}

@keyframes particleFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
  40% { transform: translate(20px, -30px) scale(1.1); opacity: 0.22; }
  80% { transform: translate(-10px, -15px) scale(0.7); opacity: 0.08; }
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.85) 0%, rgba(25, 15, 45, 0.80) 50%, rgba(15, 15, 35, 0.85) 100%);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  animation: ledGlow 4s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.03), transparent);
  animation: shimmer 8s ease-in-out infinite;
  pointer-events: none;
}

.led-border { position: relative; }

.led-border::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1, #a855f7, #ec4899, #6366f1);
  background-size: 300% 100%;
  animation: ledBorder 4s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.led-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
}

.led-dot-tl { top: -3px; left: -3px; background: #6366f1; animation: ledCorner1 3s ease-in-out infinite; }
.led-dot-tr { top: -3px; right: -3px; background: #a855f7; animation: ledCorner2 3s ease-in-out infinite; }
.led-dot-bl { bottom: -3px; left: -3px; background: #ec4899; animation: ledCorner3 3s ease-in-out infinite; }
.led-dot-br { bottom: -3px; right: -3px; background: #f472b6; animation: ledCorner4 3s ease-in-out infinite; }

.led-side-dots {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}

.led-side-dots.left { left: -3px; }
.led-side-dots.right { right: -3px; }

.led-side-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #a855f7;
}

.led-side-dot:nth-child(1) { animation: ledDotBlink 2s ease-in-out infinite; }
.led-side-dot:nth-child(2) { animation: ledDotBlink2 2.5s ease-in-out infinite; }
.led-side-dot:nth-child(3) { animation: ledDotBlink3 3s ease-in-out infinite; }
.led-side-dot:nth-child(4) { animation: ledDotBlink 1.8s ease-in-out infinite; }
.led-side-dot:nth-child(5) { animation: ledDotBlink2 2.2s ease-in-out infinite; }

.header-glow { position: relative; }

.header-glow::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5), transparent);
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent);
  animation: scanline 6s linear infinite;
  pointer-events: none;
  z-index: 5;
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.15;
  z-index: 1;
}

.progress-bar {
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  background-size: 200% 100%;
  animation: ledBorder 3s linear infinite, progressGlow 2s ease-in-out infinite;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-fill.completed-all {
  background: linear-gradient(90deg, #22c55e, #16a34a) !important;
}

.task-input {
  background: rgba(15, 15, 35, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.15), inset 0 0 10px rgba(99, 102, 241, 0.05);
}

.task-input::placeholder { color: rgba(255, 255, 255, 0.25); }

.add-btn {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
  border: 1px solid rgba(99, 102, 241, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-btn:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5));
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  transform: scale(1.05);
}

.add-btn:active { transform: scale(0.95); }

.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(99, 102, 241, 0.4);
  border-radius: 6px;
  background: rgba(15, 15, 35, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

.custom-checkbox:hover {
  border-color: rgba(99, 102, 241, 0.7);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.custom-checkbox:checked {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-color: #6366f1;
  animation: checkmark 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.custom-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.task-item {
  animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.task-item.removing {
  animation: fadeOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.task-item:hover {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.25);
}

.task-item:hover .task-delete {
  opacity: 1;
  transform: scale(1);
}

.task-item.completed .task-text {
  text-decoration: line-through;
  opacity: 0.4;
}

.task-priority-high { border-left: 3px solid rgba(239, 68, 68, 0.6); }
.task-priority-medium { border-left: 3px solid rgba(234, 179, 8, 0.6); }
.task-priority-low { border-left: 3px solid rgba(34, 197, 94, 0.6); }

.task-delete {
  opacity: 0;
  transform: scale(0.7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
}

.priority-high { border-left: 3px solid rgba(239, 68, 68, 0.6); }
.priority-medium { border-left: 3px solid rgba(234, 179, 8, 0.6); }
.priority-low { border-left: 3px solid rgba(34, 197, 94, 0.6); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }

.counter { font-variant-numeric: tabular-nums; }

@media (max-width: 400px) {
  .task-text { font-size: 13px; }
}
</style>
