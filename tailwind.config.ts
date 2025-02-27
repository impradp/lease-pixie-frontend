import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "431px", // Custom breakpoint for mobile devices
      },
      colors: {
        primary: {
          fill: "#F9F9F9",
          fade: "#D6D6D6",
          regular: "#FDFDFD",
          button: "#0C111D",
        },
        secondary: {
          regular: "#000000",
          button: "#475467",
        },
        tertiary: {
          fill: "#DDDDDD",
          regular: "#FCFCFD",
        },
        card: {
          open: {
            regular: "#101828",
            fill: "#FDFDFD",
            stroke: "#D0D5DD",
            icon: "#475467",
            link: "#0C111D",
          },
          close: {
            fill: "#F9F9F9",
          },
          input: {
            fill: "#FFFFFF",
            stroke: "#D0D5DD",
            regular: "#667085",
            semibold: "#101828",
            label: "#344054",
          },
        },
        dropdown: {
          fill: "#FDFDFD",
          semibold: "#101828",
          regular: "#667085",
          selected: "#ECECEC",
          stroke: "#D0D5DD",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        "myanmar-khyay": ["var(--font-myanmar-khyay)"],
      },
    },
  },
};
export default config;
