import { JsonRpcProvider as Provider } from "@ethersproject/providers";
import {
  ChainId,
  Fetcher,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from "@traderjoe-xyz/sdk";
import { ethers } from "ethers";
import JSBI from "jsbi";

import * as logUtils from "@/logUtils";
import { SwapPriceInput } from "@/types";

const logger = logUtils.getLogger();

// Specific to trader Joe
const toHumanReadablePercent = (priceImpact: Percent): string => {
  const sign = priceImpact.lessThan("0") ? "+" : "";
  const number = parseFloat(priceImpact.multiply("-1")?.toSignificant(3));
  return `${sign}${number}%`;
};

const useTraderJoe = async (params: SwapPriceInput) => {
  logger.debug({
    step: "useTraderJoe: Passed params",
    params,
  });

  const {
    chainId,
    inputToken,
    outputToken,
    jsonRPCUrlMap,
    inputAmount,
    paymentChainName,
  } = params;

  const jsonRpcProvider = new Provider(
    jsonRPCUrlMap[paymentChainName],
    chainId
  );

  const TokenA = new Token(
    chainId,
    inputToken.address.toString(),
    inputToken.decimals,
    inputToken.symbol,
    inputToken.name
  );

  const TokenB = new Token(
    chainId,
    outputToken.address.toString(),
    outputToken.decimals,
    outputToken.symbol,
    outputToken.name
  );

  // NFT amount
  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    TokenB.decimals // NFT currency decimal should be here.
  );

  const currencyAmount = new TokenAmount(TokenB, JSBI.BigInt(amountIn));

  const pair = await Fetcher.fetchPairData(TokenA, TokenB, jsonRpcProvider);
  const route = new Route([pair], TokenA, TokenB);
  const trade = new Trade(
    route,
    currencyAmount,
    TradeType.EXACT_OUTPUT,
    ChainId.AVALANCHE
  );

  // const result = Router.swapCallParameters(trade, {
  //   ttl: 50,
  //   recipient: "",
  //   allowedSlippage: new Percent("1", "100"),
  // });

  logger.debug({
    step: "SwapRouteResult",
    amountIn,
    currencyAmount,
    pair,
    route,
    trade,
    TokenA,
    TokenB,
  });

  return {
    impact: trade.priceImpact
      ? {
          percent: trade.priceImpact,
          toString: () => toHumanReadablePercent(trade.priceImpact),
        }
      : undefined,
    gasCostInUsd: null, // TraderJoeV1 doesnt have logic to calculate gas fee.
    estimatedPriceInToken: trade
      .maximumAmountIn(new Percent("5", "100"))
      .toSignificant(6),
    selectedTokenSymbol: TokenA.symbol,
    trade,
  };
};

export { useTraderJoe };
