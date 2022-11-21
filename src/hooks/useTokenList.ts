import { JsonRpcProvider as Provider } from "@ethersproject/providers";
import { TokenInfo } from "@uniswap/token-lists";
import { useEffect } from "react";
import useSWRImmutable from "swr/immutable";

import { DEMO_TOKENS } from "@/const";
import { getDexProps } from "@/helpers";
import * as logUtils from "@/logUtils";
import { JsonRPCUrlMap, SelectedChainInfo } from "@/types";

const logger = logUtils.getLogger();
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SelectedChainInfoWithRpc extends SelectedChainInfo {
  jsonRPCUrlMap: JsonRPCUrlMap;
  userWalletAddress: string;
}

const useTokenList = ({
  shouldFetch,
  chainId,
  chainName,
  jsonRPCUrlMap,
  userWalletAddress,
}: SelectedChainInfoWithRpc) => {
  const { tokenListUrl, tokenBalancesFetcher } =
    chainName && getDexProps(chainName);
  const { data, error } = useSWRImmutable(
    shouldFetch && tokenListUrl ? tokenListUrl : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  let tokens;
  let tokenBalancesPromise;

  if (data) {
    /*
     * Filter because for evm chains every token is included i.e mainnet and testnet ones.
     * For evm chains: we filter by chainId
     * For Solana, Near: chainId doesnt exist. Must be something else
     */
    const allTokens = data.tokens.concat(DEMO_TOKENS);
    tokens = chainId
      ? allTokens.filter((token: TokenInfo) => token.chainId === chainId)
      : allTokens;

    tokens = tokens.sort((a: TokenInfo, b: TokenInfo) =>
      a.symbol.localeCompare(b.symbol)
    );

    if (jsonRPCUrlMap && !jsonRPCUrlMap[chainName])
      throw new Error("Please provide proper JsonRPCUrlMap");

    tokenBalancesPromise = tokenBalancesFetcher({
      tokens,
      userWalletAddress,
      jsonRpcUrl: jsonRPCUrlMap[chainName],
      chainId,
    });
  }

  logger.debug({
    step: "useTokenList",
    endpoint: tokenListUrl,
    rawData: data,
    mappedData: tokens,
  });

  return {
    tokens,
    tokenBalancesPromise,
    isLoading: !error && !data,
    isError: error,
  };
};

export { useTokenList };
