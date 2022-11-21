import { JsonRpcProvider as Provider } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import Web3 from "web3";

import * as logUtils from "@/logUtils";
import { SwapPriceInput } from "@/types";

import ERC20ABI from "./abi.json";
import RarifyABi from "./rarify-abi.json";

const RARIFY_ROUTER_ADDRESS_PERMIT =
  "0xCdC216a23A29BEB128a6e4e98CF760bA175a174c";
// "0x8D7Da93b57E5c1488ff33Bfe9E9A72De4c69eB4a";

const RARIFY_ROUTER_ADDRESS_PIYUSH =
  "0x240113E9313AaD30635Ec02f4736BaeA994f15d2";

const RARIFY_ROUTER_ADDRESS_YARIK =
  "0x1840Bc40c28af54dF509A7e5dfC31723E5331d4D";
// "0x46137EDC63B251a21AE432D45F45E34b98E887E0";

const RARIFY_ROUTER_ADDRESS = RARIFY_ROUTER_ADDRESS_YARIK; // ""; // 0x8D7Da93b57E5c1488ff33Bfe9E9A72De4c69eB4a"; // "0x694148be6Adc696917de1F13a6Aa5800568b2Bf7"; //"0x240113E9313AaD30635Ec02f4736BaeA994f15d2";

interface CheckoutParams extends SwapPriceInput {
  estimatedPriceInToken: string;
  setTransactionStep: (step: number) => void;
}

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/a3b52c2dba094c759269e91d5b9e3622"
  )
);

const logger = logUtils.getLogger();

const getBytesBuy = (receiver: string) => {
  return web3.eth.abi.encodeFunctionCall(
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver_",
          type: "address",
        },
      ],
      name: "buy",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    [receiver]
  );
};

const onCheckoutHandler = async (params: CheckoutParams) => {
  try {
    const {
      userWalletAddress,
      estimatedPriceInToken,
      inputToken,
      outputToken,
      inputAmount,
      jsonRPCUrlMap,
      paymentChainName,
      chainId,
      setTransactionStep,
    } = params;
    const TokenA = inputToken;
    const TokenB = outputToken;
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

      const jsonRpcProvider = new Provider(
        jsonRPCUrlMap[paymentChainName],
        chainId
      );

      const signer = web3Provider.getSigner();

      const typedValueParsed = parseUnits(
        estimatedPriceInToken,
        inputToken.decimals
      ).toString();

      console.log(estimatedPriceInToken, typedValueParsed);

      const getWethContract = () =>
        new ethers.Contract(TokenA.address, ERC20ABI, jsonRpcProvider);

      const contract0 = getWethContract();

      const approvalAmount = ethers.utils
        .parseUnits(estimatedPriceInToken, 18)
        .toString();

      let newAmount = parseFloat(inputAmount);

      newAmount = newAmount + (newAmount * 2.5) / 100; // 2.5% for bridge fee

      const amountOut = ethers.utils
        .parseUnits(newAmount.toString(), TokenB.decimals)
        .toString();

      const allowance = await contract0.allowance(
        userWalletAddress,
        RARIFY_ROUTER_ADDRESS
      );

      const allowanceInEther = ethers.utils.formatEther(allowance);

      logger.debug({
        step: "Allownace in ether",
        allowanceInEther,
        estimatedPriceInToken,
        spendingAmount: parseFloat(estimatedPriceInToken) * 5,
      });

      // If price of token is greater than allownance then, ask user to approve token.
      if (parseFloat(estimatedPriceInToken) > parseFloat(allowanceInEther)) {
        setTransactionStep(2);
        // Allowing smart contract to spend 5 times more so that we dont have to display approve your token for spending popup step.
        const spendingAmount = parseFloat(estimatedPriceInToken) * 5;
        const approvalAmount1 = ethers.utils
          .parseUnits(spendingAmount.toString(), 18)
          .toString();

        const approveTx = await contract0
          .connect(signer)
          .approve(RARIFY_ROUTER_ADDRESS, approvalAmount1);
        setTransactionStep(3);
        await approveTx.wait();
      }

      const cont = new ethers.Contract(
        RARIFY_ROUTER_ADDRESS,
        RarifyABi,
        signer
      );

      const priceOfNft = ethers.utils
        .parseUnits(inputAmount.toString(), TokenB.decimals)
        .toString();

      const bundle = web3.eth.abi.encodeParameters(
        ["address[]", "uint256[]", "bytes[]"],
        [
          ["0x77FEdfb705C8baC2E03aAD2Ad8A8Fe83e3E20FA1"],
          [priceOfNft],
          [getBytesBuy(userWalletAddress)],
        ]
      );

      logger.debug({
        step: "Building transaction",
        bundleParams: {
          address: ["0x77FEdfb705C8baC2E03aAD2Ad8A8Fe83e3E20FA1"],
          amountOUt: [amountOut],
          bytes: [getBytesBuy(userWalletAddress)],
        },
        amountOut, // 100000000000000000000
        amountInMaximum: approvalAmount, // BigNumber.from(route?.methodParameters?.value), // 10000000000000000
        tokenIn: inputToken.address,
        tokenOut: outputToken.address,
        receiver: userWalletAddress,
        network: "Sepolia",
        isWrapped: true,
        bundle: {
          salt: "0x0000000000000000000000000000000000000000000000000000000000000015",
          bundle,
        },
        rest: {
          gasLimit: 210000,
        },
      });

      setTransactionStep(4);

      const transaction = await cont.swapExactOutputSingleThenBridge(
        amountOut, // 100000000000000000000
        approvalAmount, // BigNumber.from(route?.methodParameters?.value), // 10000000000000000
        inputToken.address,
        outputToken.address,
        userWalletAddress,
        "Sepolia",
        true,
        {
          salt: "0x0000000000000000000000000000000000000000000000000000000000000013",
          bundle,
        }
        // {
        //   gasLimit: 210000, //  ethers.utils.hexlify(1000000),
        //   // deadline: 2661766724,
        // }
      );
      setTransactionStep(5);
      const successTransaction = await transaction.wait();

      console.log({ successTransaction });
      return successTransaction;
    }
  } catch (e) {
    console.log({ e });
  }
};

export { onCheckoutHandler };
