import { ButtonProps, Chain, JsonRPCUrlMap, NFTDetails } from ".";

export type RarimoPayButtonProps = {
  buttonProps?: ButtonProps;
  chainList?: Chain[];
  jsonRPCUrlMap: JsonRPCUrlMap;
  nftDetails: NFTDetails;
  withModal: boolean;
  // tokenList?: Token[] should be enabled once we have logic to get wallet balance
  // more config can come as we explore
};
