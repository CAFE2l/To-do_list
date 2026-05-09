<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task List Overlay</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        inter: ['Inter', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style>
        /* ===== RESET & BASE ===== */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            background: transparent;
            min-height: 100vh;
            overflow: hidden;
        }

        /* ===== LED BORDER ANIMATION ===== */
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

        /* ===== LED DOTS ===== */
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

        /* ===== ANIMATIONS ===== */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOutRight {
            to {
                opacity: 0;
                transform: translateX(60px) scale(0.9);
                max-height: 0;
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
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

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
        }

        @keyframes progressGlow {
            0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
            50% { box-shadow: 0 0 15px rgba(168, 85, 247, 0.8); }
        }

        @keyframes borderRotate {
            0% { --angle: 0deg; }
            100% { --angle: 360deg; }
        }

        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        /* ===== GLASS CARD ===== */
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

        /* ===== LED BORDER ===== */
        .led-border {
            position: relative;
        }

        .led-border::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            padding: 2px;
            background: linear-gradient(90deg,
                #6366f1, #a855f7, #ec4899, #6366f1, #a855f7, #ec4899, #6366f1);
            background-size: 300% 100%;
            animation: ledBorder 4s linear infinite;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        /* ===== LED CORNER DOTS ===== */
        .led-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: absolute;
        }

        .led-dot-tl {
            top: -3px; left: -3px;
            background: #6366f1;
            animation: ledCorner1 3s ease-in-out infinite;
        }

        .led-dot-tr {
            top: -3px; right: -3px;
            background: #a855f7;
            animation: ledCorner2 3s ease-in-out infinite;
        }

        .led-dot-bl {
            bottom: -3px; left: -3px;
            background: #ec4899;
            animation: ledCorner3 3s ease-in-out infinite;
        }

        .led-dot-br {
            bottom: -3px; right: -3px;
            background: #f472b6;
            animation: ledCorner4 3s ease-in-out infinite;
        }

        /* ===== LED ROW DOTS ===== */
        .led-side-dots {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
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

        /* ===== TASK ITEM ===== */
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

        .task-item.completed {
            border-left-color: rgba(34, 197, 94, 0.5);
        }

        /* ===== CUSTOM CHECKBOX ===== */
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

        /* ===== PROGRESS BAR ===== */
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

        /* ===== INPUT ===== */
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

        .task-input::placeholder {
            color: rgba(255, 255, 255, 0.25);
        }

        /* ===== ADD BUTTON ===== */
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

        .add-btn:active {
            transform: scale(0.95);
        }

        /* ===== DELETE BUTTON ===== */
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

        /* ===== HEADER ===== */
        .header-glow {
            position: relative;
        }

        .header-glow::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 10%;
            width: 80%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5), transparent);
        }

        /* ===== SCROLLBAR ===== */
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.3);
            border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.5);
        }

        /* ===== EMPTY STATE ===== */
        .empty-state {
            animation: fadeInUp 0.5s ease forwards;
        }

        /* ===== SCANLINE EFFECT ===== */
        .scanline {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent);
            animation: scanline 6s linear infinite;
            pointer-events: none;
        }

        /* ===== PRIORITY BADGES ===== */
        .priority-high {
            border-left: 3px solid rgba(239, 68, 68, 0.6);
        }

        .priority-medium {
            border-left: 3px solid rgba(234, 179, 8, 0.6);
        }

        .priority-low {
            border-left: 3px solid rgba(34, 197, 94, 0.6);
        }

        /* ===== PARTICLE BACKGROUND ===== */
        .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.15;
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

        /* ===== COUNTER ANIMATION ===== */
        .counter {
            font-variant-numeric: tabular-nums;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 400px) {
            .task-text { font-size: 13px; }
        }
    </style>
</head>
<body class="font-inter">

    <!-- MAIN CONTAINER -->
    <div class="flex items-start justify-center min-h-screen p-4">

        <!-- GLASS CARD -->
        <div class="glass-card led-border rounded-2xl w-[380px] max-h-[90vh] flex flex-col relative">

            <!-- LED Corner Dots -->
            <div class="led-dot led-dot-tl"></div>
            <div class="led-dot led-dot-tr"></div>
            <div class="led-dot led-dot-bl"></div>
            <div class="led-dot led-dot-br"></div>

            <!-- Left Side LED Dots -->
            <div class="led-side-dots left">
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
            </div>

            <!-- Right Side LED Dots -->
            <div class="led-side-dots right">
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
                <div class="led-side-dot"></div>
            </div>

            <!-- Scanline Effect -->
            <div class="scanline"></div>

            <!-- Floating Particles -->
            <div class="particle w-1 h-1 bg-indigo-400" style="top: 15%; left: 10%; animation: particleFloat1 8s ease-in-out infinite;"></div>
            <div class="particle w-1.5 h-1.5 bg-purple-400" style="top: 45%; right: 8%; animation: particleFloat2 10s ease-in-out infinite;"></div>
            <div class="particle w-1 h-1 bg-pink-400" style="top: 75%; left: 15%; animation: particleFloat3 9s ease-in-out infinite;"></div>
            <div class="particle w-0.5 h-0.5 bg-indigo-300" style="top: 30%; right: 20%; animation: particleFloat1 7s ease-in-out infinite 1s;"></div>
            <div class="particle w-1 h-1 bg-purple-300" style="top: 60%; left: 5%; animation: particleFloat2 11s ease-in-out infinite 2s;"></div>

            <!-- ===== HEADER ===== -->
            <div class="header-glow px-5 pt-5 pb-3">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-lg shadow-indigo-500/30">
                            ☑
                        </div>
                        <div>
                            <h1 class="text-white font-bold text-lg tracking-tight leading-tight">Task List</h1>
                            <p class="text-[11px] text-indigo-300/50 font-medium tracking-wide uppercase">Overlay v2.0</p>
                        </div>
                    </div>

                    <!-- Live Badge -->
                    <div class="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
                        <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span class="text-red-400 text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                </div>

                <!-- Progress -->
                <div class="mt-3">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[11px] text-white/40 font-medium">Progresso</span>
                        <span id="counter" class="counter text-[11px] text-indigo-300 font-semibold">0 / 0</span>
                    </div>
                    <div class="progress-bar">
                        <div id="progressFill" class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>

            <!-- ===== TASK INPUT ===== -->
            <div class="px-5 pb-3">
                <div class="flex gap-2">
                    <input
                        type="text"
                        id="taskInput"
                        placeholder="Nova tarefa..."
                        class="task-input flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25"
                        maxlength="60"
                    >
                    <select id="prioritySelect" class="task-input rounded-xl px-2 py-2.5 text-xs text-indigo-300 cursor-pointer appearance-none" style="background-image: none;">
                        <option value="low" class="bg-gray-900">🟢</option>
                        <option value="medium" class="bg-gray-900" selected>🟡</option>
                        <option value="high" class="bg-gray-900">🔴</option>
                    </select>
                    <button onclick="addTask()" class="add-btn rounded-xl px-3.5 py-2.5 text-white cursor-pointer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- ===== TASK LIST ===== -->
            <div id="taskList" class="flex-1 overflow-y-auto custom-scrollbar px-5 pb-4 space-y-2 max-h-[55vh]">

                <!-- Empty State -->
                <div id="emptyState" class="empty-state flex flex-col items-center justify-center py-10 text-center">
                    <div class="w-16 h-16 rounded-2xl bg-white/[0.20] border border-white/[0.15] flex items-center justify-center mb-3">
                        <span class="text-3xl opacity-30">📋</span>
                    </div>
                    <p class="text-white/25 text-sm font-medium">Nenhuma tarefa ainda</p>
                    <p class="text-white/15 text-xs mt-1">Adicione uma tarefa para começar!</p>
                </div>

            </div>

            <!-- ===== FOOTER ===== -->
            <div class="px-5 pb-4 pt-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-[10px] text-white/20 font-medium uppercase tracking-wider" id="taskCount">0 tarefas</span>
                    </div>
                    <button onclick="clearCompleted()" id="clearBtn" class="text-[10px] text-white/20 hover:text-red-400/80 transition-colors duration-300 font-medium uppercase tracking-wider cursor-pointer hidden">
                        Limpar concluídas
                    </button>
                </div>
            </div>

        </div>
    </div>

    <script>
        // ===== STATE =====
        let tasks = [];
        let taskIdCounter = 0;

        // ===== DOM ELEMENTS =====
        const taskInput = document.getElementById('taskInput');
        const prioritySelect = document.getElementById('prioritySelect');
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const progressFill = document.getElementById('progressFill');
        const counter = document.getElementById('counter');
        const taskCount = document.getElementById('taskCount');
        const clearBtn = document.getElementById('clearBtn');

        // ===== ENTER KEY =====
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addTask();
        });

        // ===== ADD TASK =====
        function addTask() {
            const text = taskInput.value.trim();
            if (!text) {
                taskInput.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                taskInput.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.15)';
                setTimeout(() => {
                    taskInput.style.borderColor = '';
                    taskInput.style.boxShadow = '';
                }, 500);
                return;
            }

            const priority = prioritySelect.value;
            const task = {
                id: ++taskIdCounter,
                text,
                priority,
                completed: false,
                createdAt: Date.now()
            };

            tasks.push(task);
            taskInput.value = '';
            renderTask(task);
            updateProgress();
            taskInput.focus();
        }

        // ===== RENDER TASK =====
        function renderTask(task) {
            if (emptyState) emptyState.style.display = 'none';

            const priorityClass = `priority-${task.priority}`;

            const div = document.createElement('div');
            div.className = `task-item ${priorityClass} flex items-center gap-3 p-3 rounded-xl border border-white/[0.15] bg-white/[0.20]`;
            div.id = `task-${task.id}`;

            const priorityLabel = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';

            div.innerHTML = `
                <input
                    type="checkbox"
                    class="custom-checkbox"
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text text-sm text-white/80 flex-1 leading-snug transition-all duration-300">${escapeHtml(task.text)}</span>
                <span class="text-[10px] opacity-50">${priorityLabel}</span>
                <button
                    onclick="deleteTask(${task.id})"
                    class="task-delete w-7 h-7 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/30 hover:text-red-400 cursor-pointer"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            `;

            taskList.appendChild(div);

            // Scroll to bottom
            taskList.scrollTop = taskList.scrollHeight;
        }

        // ===== TOGGLE TASK =====
        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                const el = document.getElementById(`task-${id}`);
                if (task.completed) {
                    el.classList.add('completed');
                } else {
                    el.classList.remove('completed');
                }
                updateProgress();
            }
        }

        // ===== DELETE TASK =====
        function deleteTask(id) {
            const el = document.getElementById(`task-${id}`);
            if (el) {
                el.classList.add('removing');
                setTimeout(() => {
                    el.remove();
                    tasks = tasks.filter(t => t.id !== id);
                    updateProgress();
                    if (tasks.length === 0) {
                        if (emptyState) emptyState.style.display = '';
                    }
                }, 400);
            }
        }

        // ===== CLEAR COMPLETED =====
        function clearCompleted() {
            const completed = tasks.filter(t => t.completed);
            completed.forEach(task => {
                const el = document.getElementById(`task-${task.id}`);
                if (el) {
                    el.classList.add('removing');
                    setTimeout(() => {
                        el.remove();
                        tasks = tasks.filter(t => t.id !== task.id);
                        updateProgress();
                        if (tasks.length === 0 && emptyState) {
                            emptyState.style.display = '';
                        }
                    }, 400);
                }
            });
        }

        // ===== UPDATE PROGRESS =====
        function updateProgress() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const percentage = total === 0 ? 0 : (completed / total) * 100;

            progressFill.style.width = `${percentage}%`;
            counter.textContent = `${completed} / ${total}`;

            const remaining = total - completed;
            taskCount.textContent = `${total} tarefa${total !== 1 ? 's' : ''}`;

            if (completed > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }

            // All completed celebration
            if (total > 0 && completed === total) {
                progressFill.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                progressFill.style.animation = 'progressGlow 1.5s ease-in-out infinite';
                setTimeout(() => {
                    progressFill.style.background = '';
                    progressFill.style.animation = '';
                }, 3000);
            }
        }

        // ===== ESCAPE HTML =====
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>

</body>
</html>
