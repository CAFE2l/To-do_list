export type OverlayId = 'todo-list' | 'pomodoro' | 'countdown' | 'social-links' | 'goal' | 'chat-box' | 'donation'

export interface OverlayDefinition {
  id: string
  name: string
  shortName: string
  description: string
  category: string
  tags: string[]
  icon: string
  accent: string
  available: boolean
}

export const overlays: OverlayDefinition[] = [
  { id: 'todo-list', name: 'To Do List Overlay', shortName: 'To Do List', description: 'Organize metas e tarefas da live em um painel elegante e interativo.', category: 'Produtividade', tags: ['Free', 'Minimal'], icon: '✓', accent: '#67e8f9', available: true },
  { id: 'pomodoro', name: 'Pomodoro Focus', shortName: 'Pomodoro', description: 'Timer de foco e pausa para study streams e sessões produtivas.', category: 'Produtividade', tags: ['Free', 'Creator'], icon: '◷', accent: '#a7f3d0', available: true },
  { id: 'countdown', name: 'Countdown Neon', shortName: 'Countdown', description: 'Contagem regressiva impactante para começar a transmissão no tempo certo.', category: 'Cenas', tags: ['Free', 'Animated'], icon: '03', accent: '#38bdf8', available: true },
  { id: 'social-links', name: 'Social Orbit', shortName: 'Social Links', description: 'Divulgue suas redes com ícones limpos e uma animação sutil.', category: 'Comunidade', tags: ['Creator', 'Animated'], icon: '@', accent: '#22d3ee', available: true },
  { id: 'goal', name: 'Community Goal', shortName: 'Goal Bar', description: 'Barra de progresso para inscritos, seguidores ou metas de doação.', category: 'Engajamento', tags: ['Free', 'Creator'], icon: '↗', accent: '#86efac', available: true },
  { id: 'chat-box', name: 'Chat Box Glass', shortName: 'Chat Box', description: 'Chat visual moderno pronto para futura conexão com Twitch e YouTube.', category: 'Comunidade', tags: ['Premium', 'Minimal'], icon: '••', accent: '#60a5fa', available: true },
  { id: 'donation', name: 'Pix Spotlight', shortName: 'Pix / Donation', description: 'Destaque doações e mensagens da comunidade com presença visual.', category: 'Engajamento', tags: ['Premium', 'Animated'], icon: '◇', accent: '#6ee7b7', available: true },
  { id: 'alerts', name: 'Pulse Alerts', shortName: 'Alerts', description: 'Alertas animados para novos seguidores, subs e raids.', category: 'Engajamento', tags: ['Premium', 'Animated'], icon: '!', accent: '#22d3ee', available: false },
  { id: 'starting-soon', name: 'Stream Starting Soon', shortName: 'Starting Soon', description: 'Tela de abertura cinematográfica para preparar a audiência.', category: 'Cenas', tags: ['Premium', 'Animated'], icon: '▶', accent: '#38bdf8', available: false },
  { id: 'brb', name: 'Be Right Back', shortName: 'BRB', description: 'Cena elegante para pausas rápidas durante a transmissão.', category: 'Cenas', tags: ['Creator'], icon: 'Ⅱ', accent: '#67e8f9', available: false },
  { id: 'ending-soon', name: 'Ending Soon', shortName: 'Ending Soon', description: 'Encerre a transmissão com uma tela polida e memorável.', category: 'Cenas', tags: ['Creator'], icon: '■', accent: '#60a5fa', available: false },
  { id: 'music', name: 'Now Playing', shortName: 'Music Overlay', description: 'Mostre a faixa atual em um player compacto e sofisticado.', category: 'Widgets', tags: ['Premium', 'Minimal'], icon: '♫', accent: '#a7f3d0', available: false },
  { id: 'sponsor', name: 'Sponsor Banner', shortName: 'Sponsor Banner', description: 'Espaço rotativo para parceiros e patrocinadores da live.', category: 'Widgets', tags: ['Creator', 'Animated'], icon: '★', accent: '#38bdf8', available: false },
  { id: 'event-list', name: 'Event List', shortName: 'Event List', description: 'Últimos follows, inscrições e doações em um feed compacto.', category: 'Engajamento', tags: ['Premium'], icon: '+', accent: '#22d3ee', available: false },
  { id: 'study-with-me', name: 'Study With Me HUD', shortName: 'Study HUD', description: 'Layout de foco completo para estudos e coworking ao vivo.', category: 'Produtividade', tags: ['Premium', 'Creator'], icon: '◎', accent: '#86efac', available: false },
  { id: 'minimal-hud', name: 'Minimal Stream HUD', shortName: 'Minimal HUD', description: 'Informações essenciais da live com baixo impacto visual.', category: 'Widgets', tags: ['Premium', 'Minimal'], icon: '⌁', accent: '#67e8f9', available: false },
]

export const availableOverlays = overlays.filter((overlay) => overlay.available)
export function getOverlay(id: string) { return overlays.find((overlay) => overlay.id === id) }
