import { Button, Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { VerifiedBadge } from "iconoir-react";
import React, { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import { ChainName, RarimoPayButton, RarimoPayButtonProps } from "..";

interface PageProps extends RarimoPayButtonProps {
  name?: string;
}
const INFURA_KEY = "a3b52c2dba094c759269e91d5b9e3622";
const NETWORK_TYPE = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
};

const CHAIN_LIST = {
  [NETWORK_TYPE.MAINNET]: [
    {
      contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe2",
      chainId: 1,
      symbol: "ETH",
      chainType: "evm",
      icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75",
      name: "ethereum",
      displayName: "Ethereum Mainnet",
    },
    {
      contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe21",
      chainId: 137,
      symbol: "MATIC",
      chainType: "evm",
      icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=32&q=75",
      name: "polygon",
      displayName: "Polygon Mainnet",
    },
    {
      contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe21",
      chainId: 43114,
      symbol: "AVAX",
      chainType: "evm",
      icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75",
      name: "avalanche",
      displayName: "Avalanche C-Chain",
    },
  ],
  [NETWORK_TYPE.TESTNET]: [
    {
      contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe21s",
      chainId: 5,
      symbol: "ETH",
      chainType: "evm",
      icon: "https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75",
      name: "goerli",
      displayName: "Görli",
    },

    {
      contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe21",
      chainId: 43113,
      symbol: "AVAX",
      chainType: "evm",
      icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75",
      name: "fuji",
      displayName: "Avalanche Fuji-Chain",
    },
    {
      contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe21",
      chainId: 80001,
      symbol: "MATIC",
      chainType: "evm",
      icon: "https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75",
      name: "Polygon Mumbai",
      displayName: "mumbai",
    },
  ],
};

const JSON_RPC_URL_MAP = {
  [NETWORK_TYPE.MAINNET]: {
    [ChainName.ethereum]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    [ChainName.polygon]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    [ChainName.avalanche]: `https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  [NETWORK_TYPE.TESTNET]: {
    [ChainName.goerli]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    [ChainName.fuji]: `https://avalanche-fuji.infura.io/v3/${INFURA_KEY}`,
    [ChainName.polygon]: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useNFT = () => {
  const { data, error } = useSWRImmutable(
    "https://api.demo.rarify.tech/marketplace/nft",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  let nftInfo: {
    price: number;
    name: string;
    image: string;
    priceInUsd: number;
  };

  nftInfo = {
    image: "",
    name: "",
    price: 0,
    priceInUsd: 0,
  };
  console.log({ data });
  if (data) {
    nftInfo = {
      image: data.image,
      name: data.name,
      price: parseFloat(data?.original_price?.price),
      priceInUsd: parseFloat(data?.usd_price),
    };
  }

  return {
    nftInfo,
    isLoading: !error && !data,
    isError: error,
  };
};

export const PurchaseWithAnyToken = ({ buttonProps }: PageProps) => {
  const [nftDetails, setNftDetails] = useState({
    nativeToken: "ETH",
    chainName: "ethereum",
    price: 0.001,
  });

  const { nftInfo, isLoading, isError } = useNFT();
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_TYPE.TESTNET);
  const [chainList, setChainList] = useState(CHAIN_LIST[selectedNetwork]);
  const [jsonRPCUrlMap, setJsoRpcUrlMap] = useState(
    JSON_RPC_URL_MAP[selectedNetwork]
  );

  useEffect(() => {
    setChainList(CHAIN_LIST[selectedNetwork]);
    setJsoRpcUrlMap(JSON_RPC_URL_MAP[selectedNetwork]);
  }, [selectedNetwork]);

  return (
    <>
      <Container fixed>
        <Box sx={{ flexGrow: 1, paddingTop: 20 }}>
          <Grid container spacing={0} sx={{ width: "100%" }}>
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              {nftInfo.image ? (
                <img
                  src={nftInfo?.image}
                  width={400}
                  style={{ borderRadius: 20 }}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  width={400}
                  height={560}
                  sx={{ borderRadius: 2.5 }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="center">
              <Box
                display="flex"
                flexDirection="column"
                gap={3}
                style={{ minWidth: 400 }}
              >
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {nftInfo.name ? (
                      <>
                        Otherdeed{" "}
                        <VerifiedBadge
                          width={18}
                          style={{ fill: "#4588FF", color: "#ffffff" }}
                        />
                      </>
                    ) : (
                      <Skeleton variant="text" width={150} />
                    )}
                  </Typography>

                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {nftInfo.name ? (
                      nftInfo.name
                    ) : (
                      <Skeleton variant="text" width={150} />
                    )}
                  </Typography>
                </div>
                <Box display="flex" alignItems="center" gap={2.5}>
                  {nftInfo.price ? (
                    <Box
                      width={40}
                      height={40}
                      sx={{
                        background:
                          "linear-gradient(103deg, rgb(255 156 156 / 87%) 0%, rgb(60, 146, 237) 100%)",
                        borderRadius: 25,
                      }}
                    />
                  ) : (
                    <Skeleton variant="circular" width={40} height={40} />
                  )}
                  <div>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "rgba(0,0,0,0.3)",
                      }}
                    >
                      Current owner
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {nftInfo.price ? (
                        "0x989023..7b41"
                      ) : (
                        <Skeleton variant="text" width={100} />
                      )}
                    </Typography>
                  </div>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: 2.5,
                    padding: 3,
                    maxWidth: 430,
                  }}
                  gap={6}
                >
                  <Box
                    sx={{
                      borderRadius: 2.5,
                      padding: 1.5,
                      width: 180,
                      background: "#eeeeee9c",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "rgba(0,0,0,0.3)",
                      }}
                    >
                      Price
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                      }}
                    >
                      {nftInfo.price ? (
                        `${nftInfo.price} ETH`
                      ) : (
                        <Skeleton variant="text" width={50} />
                      )}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "rgba(0,0,0,0.3)",
                      }}
                    >
                      {nftInfo.price ? (
                        `$ ${nftInfo.priceInUsd}`
                      ) : (
                        <Skeleton variant="text" width={50} />
                      )}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {nftInfo.price ? (
                      <>
                        <RarimoPayButton
                          buttonProps={buttonProps}
                          chainList={chainList}
                          nftDetails={{
                            chainName: nftDetails.chainName,
                            price: nftInfo.price,
                            id: "123",
                          }}
                          jsonRPCUrlMap={jsonRPCUrlMap}
                        />
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            height: 48,
                            borderRadius: 2,
                            border: "1px solid #eee",
                            color: "#000000",
                            fontWeight: "bold",
                            ":hover": {
                              borderColor: "#eee",
                            },
                          }}
                        >
                          Place a bid
                        </Button>
                        <Box
                          display="flex"
                          flexDirection="row"
                          gap={1}
                          justifyContent="center"
                          sx={{
                            "> p": {
                              fontWeight: "bold",
                              color: "rgba(0,0,0,0.3)",
                            },
                          }}
                        >
                          <Typography variant="body2">Sale ends in</Typography>
                          <Typography variant="body2">0d</Typography>
                          <Typography variant="body2">0h</Typography>
                          <Typography variant="body2">52m</Typography>
                          <Typography variant="body2">48s</Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Skeleton
                          variant="rectangular"
                          sx={{ borderRadius: 1.5, height: 48 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          sx={{ borderRadius: 1.5, height: 48 }}
                        />
                        <Skeleton variant="rectangular" />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid item display="flex" justifyContent="center" marginTop={8}>
            <Link
              href="/platform-engineering/demo-settlement/?path=/story/demo-purchasewithanytoken--demo-instructions&full=true"
              sx={{
                textDecoration: "none",
              }}
              target="_blank"
            >
              <Typography sx={{ fontStyle: "italic", fontWeight: "bold" }}>
                See step by step instruction for the demo
              </Typography>
            </Link>
          </Grid>
        </Box>
      </Container>
    </>
  );
};
