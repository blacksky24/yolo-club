import React, { useEffect, useState } from "react";

function Nav() {
  const [walletAddress, setWalletAddress] = useState();

  let metamask = typeof window !== "undefined" && window.ethereum;
  let phantom = typeof window !== "undefined" && window.solana;

  const connectMeta = async () => {
    try {
      if (!metamask) return alert("Please Install MetaMask");

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectPhantom = async () => {
    try {
      if (!phantom) return alert("Please Install Phantom");

      const resp = await window.solana.connect();

      if (resp) {
        const publicAddress = `0x${resp.publicKey.toString()}`;
        setWalletAddress(publicAddress);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    address && setWalletAddress(address);
  }, []);

  return (
    <div className="nav">
      <div className="nav-logo">LOGO</div>

      <div className="nav-logo">
        <img width={150} src="/logo.png" alt="bull-bear" />
      </div>

      <div className="nav-links">
        {walletAddress ? (
          <button className="btn">{`${walletAddress.slice(
            0,
            6
          )}....${walletAddress.slice(-5)}`}</button>
        ) : (
          <button className="btn" onClick={connectMeta}>
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default Nav;
