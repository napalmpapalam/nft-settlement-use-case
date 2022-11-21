import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect } from "react";

import { DialogHeader } from "@/components/RarimoPayDialog";
import UserWalletTokens from "@/components/UserWalletTokens";
import { useEthereum } from "@/hooks";
import { JsonRPCUrlMap } from "@/types";

const PaymentWallets = ({
  jsonRPCUrlMap,
}: {
  jsonRPCUrlMap: JsonRPCUrlMap;
}) => {
  const { init, connectEthAccounts, currentProvider, walletInfo } = useEthereum(
    window.ethereum
  );

  useEffect(() => {
    async function initProvider() {
      await init();
    }
    initProvider();
  }, []);

  return (
    <>
      {!walletInfo?.currentAddress && (
        <>
          <DialogHeader label="Choose your payment wallet" />
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <ListItemButton
              style={{ borderRadius: 8 }}
              onClick={async () => {
                if (currentProvider) {
                  await connectEthAccounts(currentProvider);
                }
              }}
            >
              <ListItemIcon>
                <img
                  src="https://img.icons8.com/color/48/null/metamask-logo.png"
                  width={34}
                  height={34}
                />
              </ListItemIcon>
              <ListItemText
                id="switch-list-label-metamask"
                primary="MetaMask"
              />
            </ListItemButton>
          </List>
        </>
      )}
      {walletInfo?.currentAddress && (
        <UserWalletTokens
          walletInfo={walletInfo}
          jsonRPCUrlMap={jsonRPCUrlMap}
        />
      )}
    </>
  );
};

export default PaymentWallets;
