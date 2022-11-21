import { ethers } from "ethers";
import { useState } from "react";

import { connectEthAccounts, getEthTokenBalances } from "@/helpers";
import * as logUtils from "@/logUtils";
import { Provider, WalletInfo } from "@/types";

const logger = logUtils.getLogger();

export const useEthereum = (provider: Provider) => {
  if (!provider) {
    return {
      init: () => console.log("Please install a web3 wallet."),
      getTokenBalances: () => console.log("Please install a web3 wallet."),
    };
  }
  const currentProvider = new ethers.providers.Web3Provider(
    provider as ethers.providers.ExternalProvider,
    5
  );

  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    currentAddress: "",
    currentNetwork: { chainId: 0 },
  });

  const updateWalletInfo = async (eventType: string) => {
    logger.debug(`Updating wallet info on: ${eventType}`);

    try {
      const network = await currentProvider.detectNetwork();
      console.log({ network, f: walletInfo.currentNetwork });
      if (walletInfo.currentNetwork.chainId !== 5 || network.chainId !== 5) {
        if (!window.ethereum) return;
        await currentProvider.send("wallet_switchEthereumChain", [
          {
            chainId: `0x${Number(5).toString(16)}`,
          },
        ]);
      }
      logger.debug("Selected network", network);

      const userAccounts = await currentProvider.listAccounts();
      logger.debug("User Accounts", userAccounts);

      setWalletInfo({
        ...walletInfo,
        currentAddress: userAccounts[0],
        currentNetwork: network,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const addWalletListeners = () => {
    const tempProvider = currentProvider.provider as {
      on: (eventName: string, cb: () => void) => void;
    };

    tempProvider.on("accountsChanged", () => {
      updateWalletInfo("accountsChanged");
    });
    tempProvider.on("chainChanged", () => {
      updateWalletInfo("chainChanged");
    });

    tempProvider.on("disconnect", () => {
      logger.debug("Updating wallet info on: disconnect");
      setWalletInfo({
        currentAddress: "",
        currentNetwork: { chainId: 1 },
      });
    });
  };

  const init = async () => {
    addWalletListeners();
    await updateWalletInfo("initialization");
  };

  const getTokenBalances = () =>
    getEthTokenBalances(
      currentProvider,
      walletInfo.currentAddress,
      walletInfo.currentNetwork.chainId
    );

  return {
    init,
    connectEthAccounts,
    getTokenBalances,
    walletInfo,
    currentProvider,
  };
};
