import server from "./server";

import { useWallet } from "./context";
import { useEffect, useState } from "react";

function State() {
    const { balance } = useWallet();

    const [state, setState] = useState({});

    function getState() {
        server.get("state").then(({ data }) => {
            setState(data);
        });
    }

    useEffect(() => {
        getState();
    }, [balance]);

    return (
        <div className="container state">
            <header>
                <h1>State</h1>
            </header>

            <div className="list-header">
                <h3>Address</h3>
                <h3>Balance</h3>
            </div>
            <ul>
                {Object.keys(state).map((key) => {
                    return (
                        <li key={key}>
                            <p>{key}</p>
                            <p>{state[key]}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default State;
