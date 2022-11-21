import { getDexProps } from "@/helpers";
import * as logUtils from "@/logUtils";
import { SwapPriceInput } from "@/types";

const logger = logUtils.getLogger();

const useSwapPrice = async (params: SwapPriceInput) => {
  logger.debug({
    step: "useSwapPrice: Passed params",
    params,
  });

  const { jsonRPCUrlMap, paymentChainName } = params;

  if (jsonRPCUrlMap && !jsonRPCUrlMap[paymentChainName])
    throw new Error("Please provide proper JsonRPCUrlMap");

  const { swapPriceFetcher } = getDexProps(paymentChainName);

  if (swapPriceFetcher) {
    const swapResult = await swapPriceFetcher(params);
    return swapResult;
  }
};

export { useSwapPrice };
