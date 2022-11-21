import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import React from "react";

import Steps from "./Steps";

export const DemoInstructions = () => {
  return (
    <>
      <Container fixed>
        <Box sx={{ flexGrow: 1, paddingTop: 20 }}>
          <Grid container spacing={0} sx={{ width: "100%" }}>
            <Grid item xs={12} md={12} display="flex" justifyContent="center">
              <Steps />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
