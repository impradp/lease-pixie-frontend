import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        sm: "4px",
      },
      screens: {
        xs: "431px",
        md: "600px", // Matches old build's @media (max-width: 600px)
        lg: "1360px", // Matches old build's desktop layout
        custom: "1180px",
      },
      colors: {
        primary: {
          fill: "#F9F9F9",
          fade: "#BAC4D9",
          regular: "#FDFDFD",
          button: "#0C111D",
          space: "#C8C8C8",
        },
        secondary: {
          fill: "#ececec",
          regular: "#000000",
          button: "#475467",
          light: "#0b111d",
          icon: "#667085",
          space: "#101828",
        },
        tertiary: {
          fill: "#fcfcfc",
          regular: "#FCFCFD",
          light: "#475466",
          stroke: "#cfd4dc",
          space: "#f5f6f5",
          charcoalGrey: "#424242",
          blueTint: "#D0D5DD",
          midnightBlue: "#0C111D",
          charcoalBlue: "#475467",
          offWhite: "#FDFDFD",
          mediumGrey: "#BBBBBB",
          tealBlue: "#2790ac",
          mutedSalmon: "#C76961",
          cornflowerBlue: "#5CA0FF",
          saffronYellow: "#F5D654",
          silverGray: "#CECECE",
          vermilion: "#d92c20",
          slateBlue: "#344053",
          deepNavy: "#0f1728",
          ghostWhite: "#eaecf0",
          slateMist: "#667084",
          lightGray: "#d3d8de",
          darkGray: "#1e1e1e",
          darkNavy: "#0003",
          whisperGray: "#eef0f3",
          platinumGray: "#d9dde3",
          coolSilver: "#d8dde3",
          neutralGray: "#dddddd",
          offBlack: "#232323",
          muteBlueGray: "#878aa4",
          lightPeach: "#fef6ee",
          duskyBlue: "#7894ba",
          periWinkleBlue: "#A9C2E8",
          steelBlueDusk: "#637289",
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
            fill: "#F8F8F8",
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
        menu: {
          background: "rgba(255, 255, 255, 0.6)",
          header: "#292e33",
          signout: "#292e33",
          text: "#000000",
        },
        footer: {
          fill: "rgba(42, 85, 152, 0.3)",
          regular: "#FDFDFD",
        },
        icon: {
          info: "#999999",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        "myanmar-khyay": ["var(--font-myanmar-khyay)"],
      },
      fontSize: {
        "12": "12px",
      },
      lineHeight: {
        "16": "16px",
      },
      margin: {
        "1px": "1px",
      },
      animation: {
        "single-bounce": "singleBounce 0.4s ease forwards",
      },
    },
  },
  plugins: [],
  corePlugins: {
    backdropFilter: true,
  },
};

export default config;
