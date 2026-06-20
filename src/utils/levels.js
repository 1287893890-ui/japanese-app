export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

export const LEVEL_CONFIG = {
  N5: { name: 'N5', nameCn: '入门', emoji: '🌱', color: '#22C55E', order: 1 },
  N4: { name: 'N4', nameCn: '基础', emoji: '🌿', color: '#3B82F6', order: 2 },
  N3: { name: 'N3', nameCn: '中级', emoji: '🌳', color: '#F59E0B', order: 3 },
  N2: { name: 'N2', nameCn: '上级', emoji: '🏔️', color: '#F97316', order: 4 },
  N1: { name: 'N1', nameCn: '高级', emoji: '👑', color: '#EF4444', order: 5 },
}

export function getLevelColor(level) {
  return LEVEL_CONFIG[level]?.color || '#6366F1'
}
