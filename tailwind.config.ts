/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#3b82f6', 
          'base-100': '#ffffff',
          'base-200': '#f9fafb', 
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#60a5fa',
          'base-100': '#1e293b', 
          'base-200': '#2d3748', 
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};