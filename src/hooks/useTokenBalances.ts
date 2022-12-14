import { JsonRpcProvider as Provider } from "@ethersproject/providers";
import { TokenInfo } from "@uniswap/token-lists";
import { getBalancesForEthereumAddress } from "ethereum-erc20-token-balances-multicall";

import * as logUtils from "@/logUtils";

const logger = logUtils.getLogger();

const useEthereumTokenBalances = async ({
  tokens,
  userWalletAddress,
  jsonRpcUrl,
  chainId,
}: {
  tokens: TokenInfo[];
  userWalletAddress: string;
  jsonRpcUrl: string;
  chainId: number;
}) => {
  const jsonRpcProvider = new Provider(jsonRpcUrl, chainId);
  const tokenWithbalances = await getBalancesForEthereumAddress({
    contractAddresses: tokens?.map((token: TokenInfo) => token.address),
    ethereumAddress: userWalletAddress,
    providerOptions: {
      ethersProvider: jsonRpcProvider,
    },
  });

  logger.debug({
    step: "useEthereumTokenBalances",
    tokenWithbalances,
  });

  return tokenWithbalances.tokens
    .map((tokenWithbalance) => ({
      ...tokenWithbalance,
      address: tokenWithbalance.contractAddress,
    }))
    .filter(({ balance }) => Number(balance));
};

const useSolanaTokenBalances = () => {
  // logic to get token balances for solana
};

const useNearTokenBalances = () => {
  // logic to get token balances for near
};

export { useEthereumTokenBalances };
