const postTagAccents: Record<string, string> = {
  minimalism: '#a467d5',
  design: '#ef716e',
  creative: '#f79c5f',
  creativity: '#f79c5f',
  'digital culture': '#56b3fb',
  'case studies': '#36c96e',
  'visual essays': '#e0529e',
  analytics: '#85858d',
  brand: '#b8b8c0',
}

export function postTagColor(name: string) {
  return postTagAccents[name.trim().toLocaleLowerCase()] || 'var(--corpinot-link)'
}
