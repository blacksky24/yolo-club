import React, { useEffect, useState } from "react";

function CreatePool() {
  const [walletAddress, setWalletAddress] = useState();

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    address && setWalletAddress(address);
  }, []);

  return (
    <div>
      <div className="cont">
        <div className="bg"></div>
      </div>

      <div className="card-container">
        <h1 className="text-xl font-bolder">Create Pool</h1>
        {walletAddress && (
          <button className="btn">{`${walletAddress.slice(
            0,
            6
          )}....${walletAddress.slice(-5)}`}</button>
        )}
      </div>

      <div className="p-[50px]">
        <div className="heading-input text-center button-bg">
          On
          <input className="inp" type="datetime-local" />, price of
          <select className="inp">
            <option>Ethereum</option>
            <option>Solana</option>
          </select>
          <select className="inp">
            <option>Crypto</option>
          </select>{" "}
          will be
          <select className="inp">
            <option> {"> or ="} </option>
            <option> {"<"} </option>
          </select>
          <input className="inp" type={"number"} placeholder="amount" />
          <select className="inp">
            <option>USDT</option>
            <option>USD</option>
            <option>USDC</option>
          </select>
        </div>

        <div className="flex mx-10 my-[100px] justify-center">
          <div className="flex items-center button-bg rounded-lg mx-5">
            <input
              placeholder="current ETH price"
              className="inp"
              type="datetime-local"
            />

            <button className="game-button green">Opening time</button>
          </div>

          <div className="flex items-center button-bg rounded-lg mx-5">
            <input
              type={"datetime-local"}
              placeholder="current ETH price"
              className="inp"
            />

            <button className="game-button red">Closing time</button>
          </div>

          <div className="flex items-center button-bg rounded-lg mx-5">
            <input type={"number"} placeholder="ticket price" className="inp" />
            <select className="inp">
              <option>USDT</option>
              <option>USD</option>
              <option>USDC</option>
            </select>

            <button className="game-button orange">Ticket Price</button>
          </div>
        </div>

        <div className="flex max-w-[300px] my-50 mx-auto">
          <button className="game-button">Create Pool</button>
        </div>
      </div>
    </div>
  );
}

export default CreatePool;
