import server from "./server";

import { useWallet } from "./context";
import { useEffect, useState } from "react";

function Wallet() {
    const {
        address,
        setAddress,
        balance,
        setBalance,
        setPrivateKey,
        privateKey,
    } = useWallet();

    const [reveal, setReveal] = useState(true);

    useEffect(() => {
        if (privateKey) {
            setReveal(false);
        }
    }, [privateKey]);

    function revealPrivateKey() {
        setReveal(!reveal);
    }

    function refreshBalance(evt) {
        server.get(`balance/${address}`).then(({ data }) => {
            setBalance(data.balance);
        });
    }

    function connectWallet(evt) {
        evt.target.classList.add("inactive");

        if (!address) {
            server.get(`generateAddress`).then(({ data }) => {
                setAddress(data.address);
                setBalance(data.balance);
                setPrivateKey(data.privateKey);
            });
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>
            <button className="button" onClick={connectWallet}>
                Connect Wallet
            </button>

            <label className="label_icon">
                <span onClick={revealPrivateKey}>
                    <p>Private Key</p>
                    {reveal ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 256 256"
                        >
                            <path
                                fill="currentColor"
                                d="M56.88 31.93a12 12 0 1 0-17.76 16.14l16 17.65C20.67 88.66 5.72 121.58 5 123.13a12.08 12.08 0 0 0 0 9.75c.37.82 9.13 20.26 28.49 39.61C59.37 198.34 92 212 128 212a131.34 131.34 0 0 0 51-10l20.09 22.1a12 12 0 0 0 17.76-16.14ZM128 188c-29.59 0-55.47-10.73-76.91-31.88A130.69 130.69 0 0 1 29.52 128c5.27-9.31 18.79-29.9 42-44.29l90.09 99.11A109.33 109.33 0 0 1 128 188m123-55.12c-.36.81-9 20-28 39.16a12 12 0 1 1-17-16.9A130.48 130.48 0 0 0 226.48 128a130.36 130.36 0 0 0-21.57-28.12C183.46 78.73 157.59 68 128 68c-3.35 0-6.7.14-10 .42a12 12 0 1 1-2-23.91c3.93-.34 8-.51 12-.51c36 0 68.63 13.67 94.49 39.52c19.35 19.35 28.11 38.8 28.48 39.61a12.08 12.08 0 0 1 .03 9.75"
                            />
                        </svg>
                    )}
                </span>
            </label>
            <input
                placeholder="Connect your wallet"
                value={reveal ? privateKey : "💀🙈☠️☣️🙊🤐⚡"}
                readOnly
            ></input>

            <label>
                Wallet Address (Public Key)
                <input
                    placeholder="Connect your wallet"
                    value={address}
                    readOnly
                ></input>
            </label>

            <div className="balance">
                Balance: {address ? balance : "😴😴😴"}
                {address && (
                    <span onClick={refreshBalance}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"
                            />
                        </svg>
                    </span>
                )}
            </div>
            <div className="note">
                Note: Connect wallet here simply means to generate a new account
                and reloading page will loose the current account
            </div>
        </div>
    );
}

export default Wallet;
