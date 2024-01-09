import Wallet from "./Wallet";
import Transfer from "./Transfer";
import State from "./State";
import "./App.scss";

import { WalletProvider } from "./context";

function App() {
    return (
        <div className="app">
            <WalletProvider>
                <div className="container container_outer">
                    <Wallet />
                    <Transfer />
                </div>
                <State />
            </WalletProvider>
        </div>
    );
}

export default App;
