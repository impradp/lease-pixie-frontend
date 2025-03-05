import { createTheme } from "@mui/material/styles";

export const datePickerTheme = createTheme({
  typography: {
    htmlFontSize: 16,
    fontFamily: "Inter",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 700 },
    h3: { fontSize: "1.25rem", fontWeight: 600 },
    h4: { fontSize: "1rem", fontWeight: 600 },
    h5: { fontSize: "0.875rem", fontWeight: 500 },
    h6: { fontSize: "0.75rem", fontWeight: 500 },
    subtitle1: { fontSize: "1rem", fontWeight: 400 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
    button: { fontSize: "0.875rem", fontWeight: 500, textTransform: "none" },
    caption: { fontSize: "0.75rem", fontWeight: 400 },
    overline: {
      fontSize: "0.625rem",
      fontWeight: 400,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            height: "36px",
            padding: "0 14px",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #cfd4dc",
            "&:hover": {
              borderColor: "#cfd4dc",
            },
          },
        },
      },
    },
  },
});
