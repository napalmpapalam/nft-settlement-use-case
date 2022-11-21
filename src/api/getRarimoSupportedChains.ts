import { CONFIG } from "@/config";
import * as logUtils from "@/logUtils";
import { Chain } from "@/types";

import { mapRarimoChains } from "./utils";

const logger = logUtils.getLogger();

const getRarimoSupportedChains = async (
  options?: RequestInit
): Promise<Chain[]> => {
  const getChainsEndpoint = `${CONFIG.API_URL}/chains`;
  const response = await fetch(getChainsEndpoint, {
    cache: "force-cache",
    ...options,
  });

  if (response.ok) {
    const { data } = await response.json();
    const mappedData = data?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ attributes }: { attributes: any }) => mapRarimoChains(attributes)
    );

    logger.debug({
      step: "getRarimoSupportedChains",
      endpoint: getChainsEndpoint,
      rawData: data,
      mappedData,
    });

    return mappedData;
  }

  throw new Error("Something went wrong. Please try again.");
};

export { getRarimoSupportedChains };
