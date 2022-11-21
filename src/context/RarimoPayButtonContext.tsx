import React, { createContext, useState } from "react";

import { ChainName } from "@/enums";
import { JsonRPCUrlMap, NFTDetails } from "@/types";

const initContext = {
  nftDetails: { price: "0", chainName: ChainName.goerli, id: "0" },
  jsonRPCUrlMap: {
    goerli: "",
  },
};

interface IRarimoPayButtonCtx {
  nftDetails: NFTDetails;
  jsonRPCUrlMap: JsonRPCUrlMap;
}

const RarimoPayButtonContext = createContext<IRarimoPayButtonCtx>(initContext);

export function RarimoPayButtonProvider(props: {
  nftDetails: NFTDetails;
  jsonRPCUrlMap: JsonRPCUrlMap;
  children: JSX.Element;
}) {
  const [nftDetails, _setNftDetails] = useState(props.nftDetails || {});
  const [jsonRPCUrlMap, _setJsonRPCUrlMap] = useState(
    props.jsonRPCUrlMap || {}
  );

  const context = {
    nftDetails,
    jsonRPCUrlMap,
  };

  return (
    <RarimoPayButtonContext.Provider value={context}>
      {props.children}
    </RarimoPayButtonContext.Provider>
  );
}

export default RarimoPayButtonContext;
