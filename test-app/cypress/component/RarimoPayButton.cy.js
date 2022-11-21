import { RarimoPayButton } from "../dist/esm";
const buyWithRarimoButton = ".css-lbbzq4";
const chainSelect = ".MuiSelect-select";
const chainDropDown = ".MuiList-root";
const selectToken = "#select-token";
const devnetChain = '[data-value="ethereum"]';

const chainList = [
  {
    contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe2",
    chainId: 1,
    symbol: "ETH",
    chainType: "evm",
    icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75",
    name: "ethereum",
    displayName: "Ethereum"
  },
  {
    contractAddress: "0x7ce68BDE528A2623198aF3756B073FAb376b9fe21",
    chainId: 137,
    symbol: "MATIC",
    chainType: "evm",
    icon: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=32&q=75",
    name: "polygon",
    displayName: "polygon"
  },
];

const INFURA_KEY = "12";

const jsonRPCUrlMap = {
  'ethereum': `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  'polygon': `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
};

describe("RarimoPayButton", () => {
  it("should have right text", () => {
    cy.mount(<RarimoPayButton chainList={chainList} nftDetails={{ chainName: 'ethereum', id: 123, price: "0.4" }} jsonRPCUrlMap={jsonRPCUrlMap} withModal={false}/>);
    cy.get(buyWithRarimoButton).should("have.text", "Buy with Rarimo");
  });
  // these tests doesnt make sense for the new flow. must write some other test
  it.skip("should produce dropdown on click", () => {
    cy.mount(<RarimoPayButton chainList={chainList} nftDetails={{ chainName: 'ethereum', id: 123, price: "0.4" }} jsonRPCUrlMap={jsonRPCUrlMap} withModal={false} />);
    cy.get(buyWithRarimoButton).click();
    cy.get(chainSelect).click();
    cy.get(chainDropDown);
    cy.get(devnetChain).click();
    cy.get(selectToken).click();
  });
});
