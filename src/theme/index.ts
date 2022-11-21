import createTheme from "@mui/material/styles/createTheme";

import { componentsTheme } from "@/theme/components.theme";

export const theme = createTheme({
  components: componentsTheme,
  shape: {
    borderRadius: 8,
  },
});
