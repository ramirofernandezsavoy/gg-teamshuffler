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
        'dark-bg': "#040200",
        'light-bg': "#fafafa",
      },
      fontFamily: {
        sans: ['Inter var', 'sans'],
      },
    },
  },
  plugins: [],
} satisfies Config;
