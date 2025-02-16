import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': "#0c0c0d",
        'light-bg': "#5b5b5c",
        'dark-text': "#dfe6f5",
        'light-text': "#d0d2d9",
        'primary': "", 
      },
      fontFamily: {
        sans: ['Inter var', 'sans'],
      },
    },
  },
  plugins: [],
} satisfies Config;
