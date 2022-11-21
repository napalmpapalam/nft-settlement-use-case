import "@testing-library/jest-dom";

import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";

import { ChainName } from "@/enums";
import { Chain } from "@/types";

import SupportedChains from "./SupportedChains";

const mockChainList: Chain[] = [
  {
    contractAddress: "0xf39942bBE0836469553EBE9F647fE3F32B8D3229",
    chainId: 1,
    symbol: "Eth",
    chainType: "evm",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/15735.png",
    name: "ethereum" as ChainName,
    displayName: "Ethereum",
  },
  {
    contractAddress: "0x2e67f88137e8f43950344b984f3e8ece4af65e0c",
    chainId: 2,
    symbol: "Matic",
    chainType: "evm",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/15735.png",
    name: "polygon" as ChainName,
    displayName: "Polygon",
  },
];

const mockJsonRpcURL = {
  1: "https://mainnet.infura.io/v3/12",
  137: "https://polygon-mainnet.infura.io/v3/12",
};

const mockNftDetails = {
  chainName: ChainName.ethereum,
  price: "0.01",
  id: "123",
};

jest.mock("../../hooks/useChain", () => ({
  useRarimoSupportedChains: () => ({
    chains: mockChainList,
    isError: false,
    isLoading: false,
  }),
}));

describe("SupportedChains", () => {
  test("renders the SupportedChains component", () => {
    const { getAllByText } = render(
      <SupportedChains
        chainList={mockChainList}
        jsonRPCUrlMap={mockJsonRpcURL}
        nftDetails={mockNftDetails}
      />
    );
    expect(getAllByText("Select chain")).toHaveLength(2); // Mui Select component generated two `Select Chain` text. One for label and one for fieldset.
  });

  test("should select the correct option from chain list on change", async () => {
    const { getByText, getByTestId } = render(
      <SupportedChains
        chainList={mockChainList}
        jsonRPCUrlMap={mockJsonRpcURL}
        nftDetails={mockNftDetails}
      />
    );

    const select = await waitFor(() => getByTestId("rarimo-select"));
    fireEvent.change(select, {
      target: { value: "ethereum" },
    });

    expect(getByText("Ethereum")).toBeInTheDocument();
  });

  test("should display chainlist passed by Partner", async () => {
    const partnerChainList = [
      {
        contractAddress: "0x3c16183c1c0e28f1a0cb9f8ee4b21d0db208ca46",
        chainId: 1,
        symbol: "Goerli",
        chainType: "evm",
        icon: "https://google.com/15735.png",
        name: "goerli" as ChainName,
        displayName: "Görli",
      },
    ];

    const { getByText, getByTestId } = render(
      <SupportedChains
        chainList={partnerChainList}
        jsonRPCUrlMap={mockJsonRpcURL}
        nftDetails={mockNftDetails}
      />
    );

    const select = await waitFor(() => getByTestId("rarimo-select"));
    fireEvent.change(select, {
      target: { value: "goerli" },
    });

    expect(getByText("Görli")).toBeInTheDocument();
  });
});
