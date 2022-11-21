import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Percent } from "@uniswap/sdk-core";
import { TokenInfo } from "@uniswap/token-lists";
import React, { useContext, useEffect, useState } from "react";

import { getWrappedToken } from "@/api";
import Button from "@/components/Button";
import LoadingIndicator from "@/components/LoadingIndicator";
import PriceConversion from "@/components/PriceConversion";
import { DialogHeader } from "@/components/RarimoPayDialog";
import TransactionSummary from "@/components/TransactionSummary";
import RarimoPayButtonContext from "@/context/RarimoPayButtonContext";
import { ChainIds, ChainName } from "@/enums";
import { handleError } from "@/helpers";
import { useSwapPrice, useTokenList } from "@/hooks";
import * as logUtils from "@/logUtils";
import {
  JsonRPCUrlMap,
  PriceImpact,
  TokenInfoWithBalance,
  WalletInfo,
} from "@/types";

import { onCheckoutHandler } from "./onCheckoutHandler";
// import { onCheckoutHandler } from "./onCheckoutHandlerWithPermit";

const logger = logUtils.getLogger();

function round(value: string, decimals: number) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

interface IEstimatedPriceState {
  gasPriceInUsd: string | null;
  estimatedPriceInToken: string;
  selectedTokenSymbol: string;
  impact: {
    percent: Percent;
  };
  gasLimit: number;
}
const InitEstimatedPriceState = {
  gasPriceInUsd: "",
  estimatedPriceInToken: "",
  selectedTokenSymbol: "",
  gasLimit: 21000,
  impact: {
    percent: new Percent(50, 10_000),
  },
};

const UserWalletTokenBalances = ({
  tokenBalancesPromise,
  tokens,
  walletInfo,
}: {
  tokens: TokenInfo[];
  tokenBalancesPromise: any;
  walletInfo: WalletInfo;
}) => {
  const [tokenBalances, setTokenBalances] = useState([]);
  const { nftDetails, jsonRPCUrlMap } = useContext(RarimoPayButtonContext);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [estimatedPrices, setEstimatedPrices] = useState<IEstimatedPriceState>(
    InitEstimatedPriceState
  );
  const [errorText, setErrorText] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenInfoWithBalance>();
  const [outputToken, setOutputToken] = useState<TokenInfo>();
  const [transactionId, setTransactionId] = useState("");
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [transactionStep, setTransactionStep] = useState(1);

  useEffect(() => {
    async function fetchTokenBalances() {
      const balances = await tokenBalancesPromise;
      setTokenBalances(balances);
    }
    if (tokenBalancesPromise) fetchTokenBalances();
  }, [tokenBalancesPromise]);

  const resetStateOnTokenSelection = () => {
    setIsPriceLoading(true);
    setEstimatedPrices(InitEstimatedPriceState);
    setErrorText("");
    setTransactionId("");
  };

  return (
    <>
      {!transactionStarted && !transactionId && (
        <>
          <DialogHeader label="Choose your payment token" />
          {tokenBalances && (
            <>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 300,
                }}
              >
                {tokenBalances.map((token: TokenInfoWithBalance) => {
                  let tokenLogoUri = tokens
                    .find((t) => t.symbol === token.symbol)
                    ?.logoURI?.replace("ipfs://", "https://ipfs.io/ipfs/");

                  if (token.symbol === "WETH")
                    tokenLogoUri =
                      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";

                  return (
                    <ListItemButton
                      selected={selectedToken?.symbol === token.symbol}
                      key={token.symbol}
                      style={{
                        borderRadius: 8,
                        paddingLeft: 0,
                        paddingRight: 0,
                        paddingTop: 4,
                        paddingBottom: 4,
                      }}
                      onClick={async () => {
                        // call uniswap
                        setSelectedToken(token);
                        resetStateOnTokenSelection();
                        try {
                          const wrappedToken = getWrappedToken({
                            nftChainName: ChainName.goerli,
                            selectedChainName: ChainName.goerli,
                            tokens,
                          });

                          setOutputToken(wrappedToken);
                          logger.debug({
                            step: "onTokenSelection",
                            inputToken: token,
                            outputToken: wrappedToken,
                          });

                          if (
                            token?.address.toLowerCase() ===
                            wrappedToken?.address.toLowerCase()
                          ) {
                            logger.debug("No swap neeed trigger transaction.");
                            // logger.debug("No swap neeed.");
                            setIsPriceLoading(false);
                            // setIsSwapNeeded(false);
                            return;
                          }

                          if (token && wrappedToken && nftDetails?.price) {
                            const data = await useSwapPrice({
                              chainId: ChainIds.goerli,
                              jsonRPCUrlMap,
                              inputAmount: nftDetails.price.toString(),
                              inputToken: token,
                              outputToken: wrappedToken,
                              paymentChainName: ChainName.goerli,
                              userWalletAddress: walletInfo.currentAddress,
                            });

                            if (
                              data?.selectedTokenSymbol &&
                              data?.estimatedPriceInToken
                            ) {
                              setEstimatedPrices({
                                gasPriceInUsd: data?.gasCostInUsd,
                                selectedTokenSymbol: data?.selectedTokenSymbol,
                                estimatedPriceInToken:
                                  data?.estimatedPriceInToken,
                                impact: data?.impact as PriceImpact,
                                gasLimit: data?.gasLimit,
                              });
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
                          const errorText = handleError(error, token);
                          setErrorText(errorText || "");
                          setIsPriceLoading(false);
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <img src={tokenLogoUri} width={40} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={token.name}
                        secondary={token.symbol}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 600,
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: "rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      />
                      {round(token.balance, 6)}
                    </ListItemButton>
                  );
                })}
              </List>
            </>
          )}
          {!tokenBalances.length && (
            <LoadingIndicator text="Loading payment tokens" />
          )}
          {!!tokenBalances.length && <Divider />}
          {isPriceLoading && <LoadingIndicator text="Fetching best price" />}
          <PriceConversion
            key={`goerli-swap-price`}
            {...estimatedPrices}
            nftChainSymbol="ETH"
            nftPrice={nftDetails.price}
          />
          {estimatedPrices.estimatedPriceInToken && (
            <Button
              label="Checkout"
              isDisabled={transactionStarted}
              onClick={async () => {
                if (selectedToken && outputToken) {
                  setTransactionStarted(true);
                  // setTimeout(() => {
                  //   setTransactionStarted(false);
                  //   setTransactionId(
                  //     "0x185874d97677d64a518ace0531a7f4268f5f0f4ec97a3424b19c8cdec74c0185 "
                  //   );
                  // }, 6000);
                  const transaction = await onCheckoutHandler({
                    chainId: ChainIds.goerli,
                    jsonRPCUrlMap,
                    inputAmount: nftDetails.price.toString(),
                    inputToken: selectedToken,
                    outputToken,
                    paymentChainName: ChainName.goerli,
                    userWalletAddress: walletInfo.currentAddress,
                    estimatedPriceInToken:
                      estimatedPrices.estimatedPriceInToken,
                    setTransactionStep,
                  });
                  setTransactionStarted(false);
                  setTransactionId(transaction.transactionHash);
                  console.log({ transaction });
                }
              }}
              styles={{ marginTop: 24 }}
            />
          )}
        </>
      )}
      {(transactionStarted || transactionId) && (
        <TransactionSummary
          key={`transaction-summary-${nftDetails.id}`}
          {...estimatedPrices}
          nftPrice={nftDetails.price}
          nftChainSymbol="ETH"
          receiverAddress={walletInfo.currentAddress}
          transactionId={transactionId}
          transactionStarted={transactionStarted}
          transactionStep={transactionStep}
        />
      )}
    </>
  );
};

const UserWalletTokens = ({
  walletInfo,
  jsonRPCUrlMap,
}: {
  walletInfo: WalletInfo;
  jsonRPCUrlMap: JsonRPCUrlMap;
}) => {
  const { tokens, tokenBalancesPromise } = useTokenList({
    chainId: walletInfo?.currentNetwork?.chainId || 0,
    shouldFetch:
      (Boolean(walletInfo?.currentAddress) &&
        Boolean(walletInfo?.currentNetwork?.chainId)) ||
      false,
    jsonRPCUrlMap,
    chainName: ChainName.goerli,
    userWalletAddress: walletInfo?.currentAddress || "",
  });

  return (
    <>
      {walletInfo.currentAddress && (
        <UserWalletTokenBalances
          tokenBalancesPromise={tokenBalancesPromise}
          tokens={tokens}
          walletInfo={walletInfo}
        />
      )}
    </>
  );
};

export default UserWalletTokens;
