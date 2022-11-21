import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import React from "react";

import { DialogHeader } from "@/components/RarimoPayDialog";

const TRANSACTION_STEP_TEXTS = {
  1: "Transaction started",
  2: "Approve token swap",
  3: "Exchange pending",
  4: "Approve checkout",
  5: "NFT purchase in progress",
};

const TransactionSummary = ({
  estimatedPriceInToken,
  transactionId,
  receiverAddress,
  nftPrice,
  nftChainSymbol,
  selectedTokenSymbol,
  transactionStarted,
  transactionStep,
}: {
  estimatedPriceInToken: string;
  selectedTokenSymbol: string;
  nftPrice: string;
  nftChainSymbol: string;
  receiverAddress: string;
  transactionId: string;
  transactionStarted: boolean;
  transactionStep: number;
}) => {
  return (
    <>
      <DialogHeader label="Transaction summary" />
      {transactionStarted && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={1}
          marginTop={1.5}
        >
          <CircularProgress />
          <Typography>{TRANSACTION_STEP_TEXTS[transactionStep]}</Typography>
        </Box>
      )}
      {transactionId && (
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            color: "#99a0c0",
          }}
          gap={2}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Box></Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              sx={{
                ">p": {
                  color: "#99a0c0",
                  fontWeight: "bold",
                },
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: 1.5,
                borderRadius: 1.5,
                background: "#f4f6fd",
                color: "#99a0c0",
              }}
            >
              <Typography>Spent:</Typography>
              <Typography>
                {nftPrice} {nftChainSymbol} = {estimatedPriceInToken}{" "}
                {selectedTokenSymbol}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                Transaction ID:
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#9ce680", fontWeight: "bold" }}
              >
                Confirmed
              </Typography>
            </Box>
            <Divider />
            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
              {transactionId}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
              Receiving address:
            </Typography>
            <Divider />
            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
              {receiverAddress}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TransactionSummary;
