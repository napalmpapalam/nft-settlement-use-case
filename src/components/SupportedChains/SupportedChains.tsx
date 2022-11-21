import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import Select from "@/components/Select";
import TokensAutocomplete from "@/components/TokensAutocomplete";
import { ChainName } from "@/enums";
import { useEthereum, useRarimoSupportedChains } from "@/hooks";
import * as logUtils from "@/logUtils";
import { Chain, JsonRPCUrlMap, NFTDetails, SelectedChainInfo } from "@/types";

const StyledImg = styled.img`
  margin-right: 12px;
  border-radius: 12.5px;
`;

const logger = logUtils.getLogger();

const SupportedChains = ({
  chainList,
  jsonRPCUrlMap,
  nftDetails,
}: {
  chainList?: Chain[] | undefined;
  jsonRPCUrlMap: JsonRPCUrlMap;
  nftDetails: NFTDetails;
}) => {
  const [selectedChainInfo, setSelectedChainInfo] = useState<SelectedChainInfo>(
    {
      shouldFetch: false,
      chainId: 0,
      chainName: ChainName.ethereum, // Default can be anything. But must be from 'ChainName'
    }
  );

  const {
    chains = [],
    isLoading,
    isError,
  } = useRarimoSupportedChains(chainList);

  const { getTokenBalances, init } = useEthereum(window.ethereum);

  useEffect(() => {
    async function initProvider() {
      await init();
    }
    initProvider();
  }, []);

  if (isError) return <div>Something went wrong. Please try again.</div>;
  if (isLoading) return <div>Loading Chains</div>;

  return chains.length ? (
    <>
      <Select
        label="Select chain"
        options={(chainList || chains).map(
          ({ name, icon, displayName }: Chain) => ({
            label: (
              <Box display="flex" alignItems="center">
                {icon && <StyledImg src={icon} width={25} height={25} />}
                {displayName || name}
              </Box>
            ),
            value: name,
          })
        )}
        onChange={async (chainName: string) => {
          setSelectedChainInfo({
            ...selectedChainInfo,
            shouldFetch: true,
            chainId:
              chainList?.find((chain) => chain.name === chainName)?.chainId ||
              0, // For Solana, Near: There is no chain id. So adding 0. Can be updated to anything based on requirement.
            chainName: chainName as ChainName,
          });

          if (nftDetails.chainName === ChainName.ethereum && window?.ethereum) {
            const balances = await getTokenBalances();
            logger.debug(balances);
          }
        }}
      />
      {!!selectedChainInfo.chainName && (
        <TokensAutocomplete
          key={`${selectedChainInfo.chainName}-token-autocomplete`}
          selectedChainInfo={selectedChainInfo}
          jsonRPCUrlMap={jsonRPCUrlMap}
          nftDetails={nftDetails}
        />
      )}
    </>
  ) : null;
};

export default SupportedChains;
