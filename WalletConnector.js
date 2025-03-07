import React, { useState } from "react";
// Include MAGICEDEN *only* if LaserEyes actually provides it.
import { useLaserEyes, LEATHER, UNISAT, XVERSE, MAGIC_EDEN } from "@omnisat/lasereyes";

const WalletConnector = () => {
  const { connect, disconnect, connected, address } = useLaserEyes();
  const [selectedWallet, setSelectedWallet] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hardcode the wallets you want in the dropdown
  const walletOptions = [
    { id: LEATHER, name: "Leather" },
    { id: UNISAT, name: "UniSat" },
    { id: XVERSE, name: "Xverse" },
    { id: MAGIC_EDEN, name: "Magic Eden" }, // Only if supported
  ];

  async function handleConnect() {
    if (!selectedWallet) {
      setErrorMessage("Please select a wallet first.");
      return;
    }
    setErrorMessage("");
    try {
      await connect(selectedWallet);
      console.log("Connected!");
    } catch (err) {
      console.error("Connection error:", err);
      setErrorMessage(err.message || "Failed to connect.");
    }
  }

  function handleDisconnect() {
    disconnect();
    console.log("Disconnected");
    setErrorMessage("");
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "red",
        color: "white",
        padding: "10px",
        zIndex: 1000,
        boxShadow: "3px 3px 5px rgba(0,0,0,0.5)",
        fontFamily: "'Press Start 2P', sans-serif",
      }}
    >
      {!connected ? (
        <>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "5px",
              fontFamily: "'Press Start 2P', sans-serif",
              fontSize: "12px",
            }}
          >
            <option value="">-- Select Wallet --</option>
            {walletOptions.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleConnect}
            style={{
              width: "100%",
              background: "white",
              color: "red",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', sans-serif",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            Connect
          </button>

          {errorMessage && (
            <p style={{ color: "yellow", fontSize: "12px", margin: 0 }}>
              {errorMessage}
            </p>
          )}
        </>
      ) : (
        <>
          <p style={{ margin: 0, fontSize: "12px" }}>
            Connected: {address}
          </p>
          <button
            onClick={handleDisconnect}
            style={{
              width: "100%",
              background: "white",
              color: "red",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', sans-serif",
              fontSize: "12px",
              marginTop: "5px",
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
};

export default WalletConnector;