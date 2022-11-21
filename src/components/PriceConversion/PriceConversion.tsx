import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import React from "react";

import { PriceImpact } from "@/types";

const displayFlexSx = {
  display: "flex",
  flexDirection: "column",
};

const PriceConversion = ({
  gasPriceInUsd,
  estimatedPriceInToken,
  selectedTokenSymbol,
  impact,
  nftPrice,
  nftChainSymbol,
}: {
  gasPriceInUsd: string | null; // TraderJoeV1 doesnt have logic to calculate gas fee. So adding null.
  estimatedPriceInToken: string;
  selectedTokenSymbol: string;
  impact: PriceImpact;
  nftPrice: string;
  nftChainSymbol: string;
}) => {
  if (!estimatedPriceInToken) {
    return null;
  }

  return (
    <Box
      sx={{
        ...displayFlexSx,
        border: "1px solid rgba(0, 0, 0, 0.12)",
        padding: 1.5,
        borderRadius: 1.5,
        marginTop: 1,
        background: "#f4f6fd",
        color: "#99a0c0",
      }}
      gap={1}
    >
      {estimatedPriceInToken && (
        <Box sx={displayFlexSx} justifyContent="space-between" gap={1}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            sx={{
              ">p": {
                color: "#99a0c0",
                fontWeight: "bold",
              },
            }}
          >
            <Typography>Price conversion</Typography>
            <Typography>
              {nftPrice} {nftChainSymbol} = {estimatedPriceInToken}{" "}
              {selectedTokenSymbol}
            </Typography>
          </Box>
          <Divider />
        </Box>
      )}
      {impact.percent && (
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            Price Impact
          </Typography>
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            {impact.toString()}
          </Typography>
        </Box>
      )}
      {gasPriceInUsd && (
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            Network Fees
          </Typography>
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            ${gasPriceInUsd}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PriceConversion;
