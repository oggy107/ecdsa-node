import express from "express";
import cors from "cors";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());

const balances = {};

const generateAddress = () => {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey);

    const address = toHex(publicKey);

    return { privateKey, publicKey, address };
};

for (let i = 0; i < 3; i++) {
    const { privateKey, publicKey, address } = generateAddress();
    balances[address] = 100;
}

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.get("/generateAddress", (req, res) => {
    const { privateKey, publicKey, address } = generateAddress();
    balances[address] = 100;

    res.send({ privateKey: toHex(privateKey), address, balance: 100 });
});

app.get("/state", (req, res) => {
    res.send(balances);
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount, hash, sign } = req.body;

    if (amount <= 0) {
        return res.status(400).send({ message: "Invalid amount!" });
    }

    if (Object.keys(balances).indexOf(sender) === -1) {
        return res.status(400).send({ message: "Sender does not exist!" });
    }

    if (Object.keys(balances).indexOf(recipient) === -1) {
        return res.status(400).send({ message: "Recipient does not exist!" });
    }

    const signature = secp256k1.Signature.fromCompact(sign);

    if (!secp256k1.verify(signature, hash, sender)) {
        return res.status(400).send({ message: "Invalid signature!" });
    }

    if (balances[sender] < amount) {
        return res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        return res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
