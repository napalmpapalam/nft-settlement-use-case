import useSWRImmutable from "swr/immutable";

import { mapRarimoChains } from "@/api/utils";
import { CONFIG } from "@/config";
import * as logUtils from "@/logUtils";
import { Chain } from "@/types";

const logger = logUtils.getLogger();

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useRarimoSupportedChains = (chainList?: Chain[]) => {
  if (chainList?.length)
    return { chains: chainList, isLoading: false, isError: false };

  // default fallback - if user didn't pass in chains, use all supported chains
  const getChainsEndpoint = `${CONFIG.API_URL}/chains`;
  const { data, error } = useSWRImmutable(getChainsEndpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  let chains;
  if (data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chains = data?.data?.map(({ attributes }: { attributes: any }) =>
      mapRarimoChains(attributes)
    );

    logger.debug({
      step: "useRarimoSupportedChains",
      endpoint: getChainsEndpoint,
      rawData: data,
      mappedData: chains,
    });
  }

  return {
    chains,
    isLoading: !error && !data,
    isError: error,
  };
};

export { useRarimoSupportedChains };
