import { Divider, Typography } from "@mui/material";
import React from "react";

const DialogHeader = ({ label }: { label: string }) => {
  return (
    <>
      <Typography fontWeight="bold" variant="h6">
        {label}
      </Typography>
      <Divider />
    </>
  );
};

export default DialogHeader;
