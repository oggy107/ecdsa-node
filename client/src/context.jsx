import { createContext, useState, useContext } from "react";

const WalletContext = createContext({});

export function useWallet() {
    return useContext(WalletContext);
}

export function WalletProvider({ children }) {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    return (
        <WalletContext.Provider
            value={{
                balance,
                setBalance,
                address,
                setAddress,
                privateKey,
                setPrivateKey,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
