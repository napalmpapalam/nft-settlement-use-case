import { Components } from "@mui/material";

import { BaseTheme } from "@/types";

const spacing = (size: number) => `${size * 8}px`;

export const componentsTheme: Components<BaseTheme> = {
  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: `${spacing(1)}`,
        margin: `0 ${spacing(1)}`,
        padding: `12px ${spacing(2)}`,
        fontWeight: "medium",
        fontSize: "14px",
        color: "rgba(0 0 0 / 87%)",

        "&:hover": {
          backgroundColor: "#fafafa",
        },

        "&:not(:first-of-type)": {
          marginTop: spacing(1),
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      icon: {
        top: spacing(2),
        right: spacing(2),
      },
    },
  },
};
