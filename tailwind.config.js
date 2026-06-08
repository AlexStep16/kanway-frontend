/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    'group-hover/task:opacity-100',
    'group-hover/column:opacity-100',
    'group-hover/sidebar-item:opacity-100',
    {
      pattern: /group-hover\/(task|column|sidebar-item):opacity-100/,
      variants: [],
    },
    {
      pattern: /group\/(task|column|sidebar-item)/,
      variants: [],
    },
  ],
  plugins: [],
}
