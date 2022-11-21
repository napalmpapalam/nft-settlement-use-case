import { renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";

import { ChainName } from "@/enums";

import { useTokenList } from "./useTokenList";

fetchMock.enableMocks();

const mockedTokenData = {
  tokens: [
    {
      chainId: 1,
      address: "0x111111111117dC0aa78b770fA6A738034120C302",
      name: "1inch",
      symbol: "1INCH",
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    },
    {
      chainId: 1,
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      name: "Aave",
      symbol: "AAVE",
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
    },
    {
      name: "Storj Token",
      address: "0xd72357dAcA2cF11A5F155b9FF7880E595A3F5792",
      symbol: "STORJ",
      decimals: 8,
      chainId: 137,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC/logo.png",
      extensions: {
        bridgeInfo: {
          "1": {
            tokenAddress: "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC",
          },
        },
      },
    },
  ],
};

const mockJsonRPCUrlMap = {
  [ChainName.ethereum]: "https://jsonrpcurl.com/132",
};

describe("useTokenList", () => {
  afterEach(() => {
    fetchMock.mockClear();
  });

  beforeEach(() => {
    fetchMock.mockClear();
  });

  test.skip("should return correct token list based on chain Id", async () => {
    fetchMock.mockOnce(JSON.stringify(mockedTokenData));

    const { result, waitForNextUpdate } = renderHook(() =>
      useTokenList({
        shouldFetch: true,
        chainId: 1,
        chainName: ChainName.ethereum,
        jsonRPCUrlMap: mockJsonRPCUrlMap,
        userWalletAddress: "123",
      })
    );

    await waitForNextUpdate();

    expect(result.current).toContain({
      isLoading: false,
      tokenBalancesPromise: {},
      tokens: [
        {
          chainId: 1,
          address: "0x111111111117dC0aa78b770fA6A738034120C302",
          name: "1inch",
          symbol: "1INCH",
          decimals: 18,
          logoURI:
            "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
        },
        {
          chainId: 1,
          address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
          name: "Aave",
          symbol: "AAVE",
          decimals: 18,
          logoURI:
            "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110",
        },
      ],
      isError: undefined,
    });
  });
  test.skip("should not fetch token list if shouldFetch is false", async () => {
    const { result } = renderHook(() =>
      useTokenList({
        shouldFetch: false,
        chainId: 1,
        chainName: ChainName.ethereum,
        jsonRPCUrlMap: mockJsonRPCUrlMap,
        userWalletAddress: "123",
      })
    );

    expect(result.current).toStrictEqual({
      isLoading: true,
      isError: undefined,
      tokens: undefined,
      tokenBalancesPromise: undefined,
    });
  });
});
