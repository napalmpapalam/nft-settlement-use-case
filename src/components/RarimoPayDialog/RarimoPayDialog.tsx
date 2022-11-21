/*

Users can have their metanmask/phanton wallet connected.
How do we decide which wallet to choose?

ChainOfNft must come from

For demo i can consider user will connect to their metamask.
isMetamask connected

Flow:
1. When user clicks on Button. Display wallet modal regardless of use connected to metamask or not.
2. When user clicks on one of the wallet options. Following things are required:
- chain of an nft
- if chain of nft is testnet and mode is not testmode then display change of chain else just display whatever user connected.
3. When user connected to wallet, fetch information about user wallet. following things are required:
- payment chain
- chain of an nft
- fetch token list
- query user wallet balances.
4. When user click on a particular token with balance:
- trigger uniswap or other exchange to get the price.
5.


chain of nft must be known:

 */

import { Dialog, DialogContent } from "@mui/material";
import { Cancel } from "iconoir-react";
import React from "react";

import PaymentWallets from "@/components/PaymentWallets";
import { JsonRPCUrlMap } from "@/types";

const RarimoPayDialog = ({
  open,
  handleCloseDialog,
  jsonRPCUrlMap,
}: {
  open: boolean;
  handleCloseDialog: () => void;
  jsonRPCUrlMap: JsonRPCUrlMap;
}) => {
  // this should all comes from context or some state

  return (
    <Dialog
      onClose={handleCloseDialog}
      fullWidth
      open={open}
      PaperProps={{
        style: { borderRadius: 25 },
      }}
    >
      <Cancel
        style={{ position: "absolute", right: 24, cursor: "pointer", top: 24 }}
        onClick={handleCloseDialog}
      ></Cancel>
      <DialogContent
        style={{
          padding: 48,
          display: "flex",
          flexDirection: "column",
          gridGap: 10,
        }}
      >
        <PaymentWallets jsonRPCUrlMap={jsonRPCUrlMap} />
      </DialogContent>
    </Dialog>
  );
};

export default RarimoPayDialog;
