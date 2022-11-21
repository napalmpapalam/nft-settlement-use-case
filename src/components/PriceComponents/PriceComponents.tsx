import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import React from "react";

import { PriceImpact } from "@/types";

const StyledDivWithBorder = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
`;

const StyledText = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const PriceComponent = ({
  gasPriceInUsd,
  estimatedPriceInToken,
  selectedTokenSymbol,
  impact,
}: {
  gasPriceInUsd: string | null; // TraderJoeV1 doesnt have logic to calculate gas fee. So adding null.
  estimatedPriceInToken: string;
  selectedTokenSymbol: string;
  impact: PriceImpact;
}) => {
  if (!estimatedPriceInToken) {
    return null;
  }

  return (
    <StyledDivWithBorder>
      {estimatedPriceInToken && (
        <Box display="flex" justifyContent="space-between">
          <StyledText>Estimated Price</StyledText>
          {estimatedPriceInToken} {selectedTokenSymbol}
        </Box>
      )}
      {gasPriceInUsd && (
        <Box display="flex" justifyContent="space-between">
          <StyledText>Network Fee:</StyledText>${gasPriceInUsd}
        </Box>
      )}
      {impact.percent && (
        <Box display="flex" justifyContent="space-between">
          <StyledText>Price Impact:</StyledText>
          {impact.toString()}
        </Box>
      )}
    </StyledDivWithBorder>
  );
};

export default PriceComponent;
