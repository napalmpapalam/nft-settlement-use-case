import styled from "@emotion/styled";
import MuiAutocomplete, {
  createFilterOptions,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Percent } from "@uniswap/sdk-core";
import { TokenInfo } from "@uniswap/token-lists";
import React, { useEffect, useState } from "react";

import { getWrappedToken } from "@/api";
import LoadingIndicator from "@/components/LoadingIndicator";
import PriceComponents from "@/components/PriceComponents";
import { handleError } from "@/helpers";
import { useSwapPrice, useTokenList } from "@/hooks";
import * as logUtils from "@/logUtils";
import {
  JsonRPCUrlMap,
  NFTDetails,
  PriceImpact,
  SelectedChainInfo,
} from "@/types";

import Button from "../Button";

const logger = logUtils.getLogger();

const StyledImg = styled.img`
  margin-right: 12px;
  border-radius: 12.5px;
`;

interface IEstimatedPriceState {
  gasPriceInUsd: string | null;
  estimatedPriceInToken: string;
  selectedTokenSymbol: string;
  impact: {
    percent: Percent;
  };
}
const InitEstimatedPriceState = {
  gasPriceInUsd: "",
  estimatedPriceInToken: "",
  selectedTokenSymbol: "",
  impact: {
    percent: new Percent(50, 10_000),
  },
};

const Autocomplete = ({
  selectedChainInfo,
  nftDetails,
  jsonRPCUrlMap,
}: {
  selectedChainInfo: SelectedChainInfo;
  nftDetails: NFTDetails;
  jsonRPCUrlMap: JsonRPCUrlMap;
}) => {
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isSwapNeeded, setIsSwapNeeded] = useState(true);
  const [estimatedPrices, setEstimatedPrices] = useState<IEstimatedPriceState>(
    InitEstimatedPriceState
  );
  const [errorText, setErrorText] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [triggerTransaction, setTriggerTransaction] = useState();

  const { tokens } = useTokenList({
    ...selectedChainInfo,
    jsonRPCUrlMap,
    userWalletAddress: "",
  });

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: TokenInfo) =>
      `${option.symbol} ${option.name} ${option.address}`,
  });

  useEffect(() => {
    setErrorText("");
    setIsPriceLoading(false);
  }, [selectedChainInfo.chainName]);

  if (!tokens) return null;

  const resetStateOnTokenSelection = () => {
    setIsPriceLoading(true);
    setEstimatedPrices(InitEstimatedPriceState);
    setErrorText("");
  };

  return (
    tokens && (
      <>
        <MuiAutocomplete
          disablePortal
          id="select-token"
          key={selectedChainInfo.chainName}
          options={tokens}
          getOptionLabel={(option: TokenInfo) =>
            `${option.symbol} (${option.name})` ?? option
          }
          onChange={async (event, value) => {
            if (!value) return;

            resetStateOnTokenSelection();
            try {
              const wrappedToken = getWrappedToken({
                nftChainName: nftDetails.chainName,
                selectedChainName: selectedChainInfo.chainName,
                tokens,
              });

              logger.debug({
                step: "onTokenSelection",
                inputToken: value,
                outputToken: wrappedToken,
              });

              if (
                value?.address.toLowerCase() ===
                wrappedToken?.address.toLowerCase()
              ) {
                logger.debug("No swap neeed.");
                setIsPriceLoading(false);
                setIsSwapNeeded(false);
                return;
              }

              if (value && wrappedToken && nftDetails.price) {
                const data = await useSwapPrice({
                  chainId: selectedChainInfo.chainId,
                  jsonRPCUrlMap,
                  inputAmount: nftDetails.price.toString(),
                  inputToken: value,
                  outputToken: wrappedToken,
                  paymentChainName: selectedChainInfo.chainName,
                  userWalletAddress: "13",
                });

                if (data?.selectedTokenSymbol && data?.estimatedPriceInToken) {
                  setEstimatedPrices({
                    gasPriceInUsd: data?.gasCostInUsd,
                    selectedTokenSymbol: data?.selectedTokenSymbol,
                    estimatedPriceInToken: data?.estimatedPriceInToken,
                    impact: data?.impact as PriceImpact,
                  });

                  setTriggerTransaction(data.triggerTransaction);
                }

                logger.debug({
                  step: "onTokenSelection:  Price is fetched",
                  data,
                });
                setIsPriceLoading(false);
              }
            } catch (error) {
              logger.debug({
                step: "Error occured while fetching price",
                error,
              });

              const errorText = handleError(error, value);
              setErrorText(errorText || "");
              setIsPriceLoading(false);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select token" />
          )}
          filterOptions={filterOptions}
          renderOption={(props, option) => (
            <MenuItem value={option.symbol} {...props}>
              <Box display="flex" alignItems="center">
                <StyledImg
                  src={option?.logoURI?.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  width={25}
                  height={25}
                />
                {option.symbol} ({option.name})
              </Box>
            </MenuItem>
          )}
        />
        {isPriceLoading && <LoadingIndicator text="Fetching best price..." />}
        <PriceComponents
          key={`${selectedChainInfo.chainName}-swap-price`}
          gasPriceInUsd={estimatedPrices.gasPriceInUsd}
          estimatedPriceInToken={estimatedPrices.estimatedPriceInToken}
          selectedTokenSymbol={estimatedPrices.selectedTokenSymbol}
          impact={estimatedPrices.impact}
        />
        {!isSwapNeeded && <div>No Swap needed</div>}
        {errorText && <div>{errorText}</div>}
        {estimatedPrices.estimatedPriceInToken && (
          <Button
            label="Review Swap"
            onClick={() => {
              setOpenConfirmationDialog(true);
              // open confirmation dialog
            }}
          />
        )}
        <PriceComponents
          key={`${selectedChainInfo.chainName}-swap-price`}
          gasPriceInUsd={estimatedPrices.gasPriceInUsd}
          estimatedPriceInToken={estimatedPrices.estimatedPriceInToken}
          selectedTokenSymbol={estimatedPrices.selectedTokenSymbol}
          impact={estimatedPrices.impact}
        />
      </>
    )
  );
};

export default Autocomplete;
