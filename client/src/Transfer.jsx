import { useState, useRef, useEffect } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

import { useWallet } from "./context";

const hash = (message, hex = false) => {
    return hex
        ? toHex(sha256(utf8ToBytes(message)))
        : sha256(utf8ToBytes(message));
};

function Transfer() {
    const { address, privateKey, setBalance } = useWallet();

    const ref = useRef();

    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    useEffect(() => {
        if (address && sendAmount && recipient) {
            ref.current.classList.remove("inactive");
        } else {
            ref.current.classList.add("inactive");
        }
    }, [address, sendAmount, recipient]);

    async function transfer(evt) {
        evt.preventDefault();

        const msg = {
            amount: parseInt(sendAmount),
            sender: address,
            recipient,
        };

        const sign = secp256k1.sign(hash(JSON.stringify(msg)), privateKey);

        try {
            const {
                data: { balance },
            } = await server.post(`send`, {
                ...msg,
                hash: hash(JSON.stringify(msg), true),
                sign: sign.toCompactHex(),
            });

            setBalance(balance);
        } catch (ex) {
            console.error("[ERROR:]", ex.response.data);
            alert(ex.response.data.message);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    type="number"
                    onChange={setValue(setSendAmount)}
                    required
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                    required
                ></input>
            </label>

            <input
                ref={ref}
                type="submit"
                className="button inactive"
                value="Transfer"
            />
        </form>
    );
}

export default Transfer;
