import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";

import Button from "@/components/Button";
import RarimoPayDialog from "@/components/RarimoPayDialog";
import SupportedChains from "@/components/SupportedChains";
import { RarimoPayButtonProvider } from "@/context/RarimoPayButtonContext";
import * as logUtils from "@/logUtils";
import { theme } from "@/theme";
import { RarimoPayButtonProps } from "@/types";

const logger = logUtils.getLogger();

const BoxSx = {
  padding: 2,
  borderRadius: 1,
  background:
    "linear-gradient(103deg, rgb(255 156 156 / 87%) 0%, rgb(60, 146, 237) 100%);",
};

const RarimoPayButton = (props: RarimoPayButtonProps) => {
  logger.debug(props);

  const {
    buttonProps,
    chainList,
    jsonRPCUrlMap,
    nftDetails,
    withModal = true,
  } = props;

  const [showSupportedChains, setShowSupportedChains] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" gap={2}>
        <Button
          {...buttonProps}
          label={buttonProps?.label || "Buy with Rarimo"}
          onClick={() => setShowSupportedChains(true)}
        />

        {showSupportedChains && !withModal && (
          <Box display="flex" flexDirection="column" gap={2} sx={BoxSx}>
            <SupportedChains
              chainList={chainList}
              jsonRPCUrlMap={jsonRPCUrlMap}
              nftDetails={nftDetails}
            />
          </Box>
        )}
        {showSupportedChains && withModal && (
          <RarimoPayButtonProvider {...props}>
            <RarimoPayDialog
              open={showSupportedChains}
              handleCloseDialog={() => setShowSupportedChains(false)}
              jsonRPCUrlMap={jsonRPCUrlMap}
            />
          </RarimoPayButtonProvider>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default RarimoPayButton;
