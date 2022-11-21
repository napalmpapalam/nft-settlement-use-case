import { TokenInfo } from "@uniswap/token-lists";

import { ChainName } from "@/enums";

export const getRarimoSupportedToken = (
  nftChainName: string,
  paymentChainName?: ChainName
) => {
  // For avalance Wrapped ether symbol is WETH.e. WETH is a symbol for Wormhole ether which has low liquidity
  if (
    nftChainName === ChainName.ethereum &&
    paymentChainName === ChainName.avalanche
  )
    return "WETH.e";

  return {
    ethereum: "WETH",
    polygon: "WMATIC",
    avalanche: "WAVAX",
    goerli: "WETH",
  }[nftChainName];
};

export const getWrappedToken = ({
  nftChainName,
  selectedChainName,
  tokens,
}: {
  nftChainName: ChainName;
  selectedChainName: ChainName;
  tokens: TokenInfo[];
}) => {
  const bridgeTokenSymbol = getRarimoSupportedToken(
    nftChainName,
    selectedChainName
  );

  let wrappedToken = tokens.find(
    (token: TokenInfo) => token.symbol === bridgeTokenSymbol
  ) as TokenInfo;

  /* For the following case:
   * When NFT Chain: Polygon && User wants to pay using Etherum chain.
   * So Bridge needs: WMATIC (wormhome matic need to be confirmed from yariks team)
   */
  if (
    !wrappedToken &&
    nftChainName === ChainName.polygon &&
    selectedChainName === ChainName.ethereum
  ) {
    wrappedToken = {
      address: "0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43",
      name: "Wrapped Matic (Wormhole)",
      symbol: "WMATIC",
      decimals: 18,
      chainId: 1,
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
    };
  }

  return wrappedToken;
};
