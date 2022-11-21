import "./BuyWithRarimo.css";

import React, { useEffect, useState } from "react";

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

const getNativeTokenByChainName = (chainName: string) =>
  ({ ethereum: "ETH", polygon: "MATIC", avalanche: "AVAX" }[chainName]);

const RadioButton = ({
  name,
  value,
  label,
  id,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  id: string;
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div className="d-flex-center ">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        className="margin-0"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export const BuyWithRarimo = ({ name, buttonProps }: PageProps) => {
  const [nftDetails, setNftDetails] = useState({
    nativeToken: "ETH",
    chainName: "ethereum",
    price: 0.04,
  });

  const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_TYPE.MAINNET);
  const [chainList, setChainList] = useState(CHAIN_LIST[selectedNetwork]);
  const [jsonRPCUrlMap, setJsoRpcUrlMap] = useState(
    JSON_RPC_URL_MAP[selectedNetwork]
  );

  useEffect(() => {
    setChainList(CHAIN_LIST[selectedNetwork]);
    setJsoRpcUrlMap(JSON_RPC_URL_MAP[selectedNetwork]);
  }, [selectedNetwork]);

  return (
    <article>
      <section style={{ maxWidth: "500px" }}>
        <h1>{name}</h1>
        <h2>Rarimo pay button example</h2>
        <div className="BuyWithRarimo__rarimo-button-container">
          <div>
            <img src="https://img.seadn.io/files/ed6612c127f8e559ffb5dc329500d8ec.png?w=460" />
            <div className="d-flex-center flex-direction-col">
              <div className="d-flex-center choose-network">
                <b>Choose Network:</b>
                <RadioButton
                  id={NETWORK_TYPE.MAINNET}
                  name="chooseNetwork"
                  value={NETWORK_TYPE.MAINNET}
                  label="Mainnet"
                  checked={selectedNetwork === NETWORK_TYPE.MAINNET}
                  onChange={() => setSelectedNetwork(NETWORK_TYPE.MAINNET)}
                />
                <RadioButton
                  id={NETWORK_TYPE.TESTNET}
                  name="chooseNetwork"
                  value={NETWORK_TYPE.TESTNET}
                  label="Testnet"
                  checked={selectedNetwork === NETWORK_TYPE.TESTNET}
                  onChange={() => setSelectedNetwork(NETWORK_TYPE.TESTNET)}
                />
              </div>
              <div className="d-flex-center select-chain-of-nft">
                <b>Chain of NFT:</b>{" "}
                <select
                  onChange={(e) => {
                    setNftDetails({
                      ...nftDetails,
                      chainName: e.target.value,
                      nativeToken:
                        getNativeTokenByChainName(e.target.value) || "ETH",
                    });
                  }}
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="avalanche">Avalanche</option>
                </select>
              </div>
              <div className="d-flex-center set-price-of-nft">
                <label htmlFor="nftPrice">
                  <b>Price of NFT:</b>
                </label>
                <input
                  type="number"
                  id="nftPrice"
                  name="nftPrice"
                  defaultValue={nftDetails.price}
                  // value={nftDetails.price}
                  onChange={(e) => {
                    setNftDetails({
                      ...nftDetails,
                      price: parseFloat(e.target.value) || 0,
                    });
                  }}
                />
                {nftDetails.nativeToken}
              </div>
            </div>
          </div>
          <br></br>
          <RarimoPayButton
            buttonProps={buttonProps}
            chainList={chainList}
            nftDetails={{
              chainName: nftDetails.chainName,
              price: nftDetails.price,
              id: "123",
            }}
            jsonRPCUrlMap={jsonRPCUrlMap}
            withModal={false}
          />
        </div>
      </section>
    </article>
  );
};
