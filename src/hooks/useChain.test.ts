import { renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";

import { useRarimoSupportedChains } from "./useChain";

fetchMock.enableMocks();

const mockedChainData = {
  data: [
    {
      id: "1",
      type: "chain",
      attributes: {
        bridge_contract: "0x7ce68BDEasss23198aF3756B073FAb376b9fe2",
        chain_params: {
          chain_id: 3,
          explorer_url: "https://ropsten.etherscan.io",
          native_symbol: "ETH",
        },
        chain_type: "evm",
        icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=64&q=75",
        name: "Ropsten",
      },
      relationships: {
        tokens: {
          data: [
            {
              id: "1",
              type: "token",
            },
          ],
        },
      },
    },
  ],
  included: [],
  links: null,
};
describe("useChain", () => {
  describe("useRarimoSupportedChains", () => {
    afterEach(() => {
      fetchMock.mockClear();
    });

    beforeEach(() => {
      fetchMock.mockClear();
    });
    test("should return rarimo supported chain in proper format", async () => {
      fetchMock.mockOnce(JSON.stringify(mockedChainData));

      const { result, waitForNextUpdate } = renderHook(() =>
        useRarimoSupportedChains()
      );

      await waitForNextUpdate();

      expect(result.current).toStrictEqual({
        isLoading: false,
        chains: [
          {
            contractAddress: "0x7ce68BDEasss23198aF3756B073FAb376b9fe2",
            chainId: 3,
            symbol: "ETH",
            chainType: "evm",
            icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=64&q=75",
            name: "Ropsten",
          },
        ],
        isError: undefined,
      });
    });
    test("should return chains if user supplied list of chain", async () => {
      // fetchMock.mockOnce(JSON.stringify(mockedChainData));

      const { result } = renderHook(() =>
        useRarimoSupportedChains([
          {
            contractAddress: "0x7ce68BDEasss23198aF3756B073FAb376b9fe2",
            chainId: 3,
            symbol: "ETH",
            chainType: "evm",
            icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=64&q=75",
            name: "Ropsten",
          },
        ])
      );

      expect(result.current).toStrictEqual({
        isLoading: false,
        chains: [
          {
            contractAddress: "0x7ce68BDEasss23198aF3756B073FAb376b9fe2",
            chainId: 3,
            symbol: "ETH",
            chainType: "evm",
            icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=64&q=75",
            name: "Ropsten",
          },
        ],
        isError: false,
      });
    });
  });
});
