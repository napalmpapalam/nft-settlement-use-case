import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

const StyledLoadingIndicator = styled.span`
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  -webkit-animation: rotation 1s linear infinite;
  animation: rotation 1s linear infinite;
  margin-right: 5px;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingIndicator = ({ text }: { text: string }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
      marginTop={1.5}
    >
      <CircularProgress />
      <Typography>{text}</Typography>
    </Box>
  );
};

export default LoadingIndicator;
