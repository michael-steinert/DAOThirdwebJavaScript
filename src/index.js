import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
/* Import thirdweb Provider and Rinkeby ChainId */
import {ChainId, ThirdwebProvider} from "@thirdweb-dev/react";

/* ChainId on that the decentralized App will work on */
const activeChainId = ChainId.Rinkeby;

ReactDOM.render(
    <React.StrictMode>
        <ThirdwebProvider desiredChainId={activeChainId}>
            <App/>
        </ThirdwebProvider>
    </React.StrictMode>,
    document.getElementById("root"),
);