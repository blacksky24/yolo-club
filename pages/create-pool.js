import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Nav from "../components/Nav";
import { CREATOR_CONTRACT_ABI, CREATOR_CONTRACT_ADDRESS } from "../constants";

function CreatePool() {
  const [walletAddress, setWalletAddress] = useState();
  const [bettingPrice, setBettingPrice] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [commissionPercent, setCommissionPercent] = useState(10);

  // contract intraction
  let provider = typeof window !== "undefined" && window.ethereum;

  const getContract = () => {
    const web3 = new Web3(provider);

    return new web3.eth.Contract(
      CREATOR_CONTRACT_ABI,
      CREATOR_CONTRACT_ADDRESS
    );
  };

  const createPool = () => {
    const contract = getContract();

    console.log(contract);

    contract.methods
      .createPool(bettingPrice, ticketPrice, commissionPercent)
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
        const add = getContractAddress();
        alert(add);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getContractAddress = () => {
    const contract = getContract();

    console.log(getContract());

    contract.methods
      .deployedContract()
      .call()
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  useEffect(() => {
    if (localStorage.getItem("walletAddress")) {
      const address = Web3.utils.toChecksumAddress(
        localStorage.getItem("walletAddress")
      );
      setWalletAddress(address);
    }

    getContractAddress();
  }, []);

  return (
    <div className="cont">
      <Nav title="Create Pool" />

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
            {/* <option> {"<"} </option> */}
          </select>
          <input
            className="inp"
            type={"number"}
            required
            placeholder="amount"
            onChange={(e) => {
              setBettingPrice(e.target.value);
            }}
          />
          <select className="inp" defaultValue={"USDT"}>
            <option value={"USDT"}>USDT</option>
            {/* <option>USD</option>
            <option>USDC</option> */}
          </select>
        </div>

        <div className="flex mx-10 my-[100px] justify-center">
          <div className="button-bg rounded-lg mx-5">
            <p>Opening time</p>
            <input
              placeholder="current ETH price"
              className="inp"
              type="datetime-local"
            />
          </div>

          <div className="button-bg rounded-lg mx-5">
            <p>Clossing time</p>
            <input
              type={"datetime-local"}
              placeholder="current ETH price"
              className="inp"
            />
          </div>

          <div className="button-bg rounded-lg mx-5">
            <p>Ticket Price</p>
            <div className="flex">
              <input
                type={"number"}
                placeholder="ticket price"
                className="inp"
                required
                onChange={(e) => {
                  if (e.target.value != "" && e.target.value > 0) {
                    const weiValue = Web3.utils.toWei(
                      `${e.target.value}`,
                      "ether"
                    );
                    console.log(weiValue);
                    setTicketPrice(weiValue);
                  }
                }}
              />

              <select className="inp" defaultValue={"ETH"}>
                <option value={"ETH"}>ETH</option>
                {/* <option>USD</option>
              <option>USDC</option> */}
              </select>
            </div>
          </div>
        </div>

        <div className="flex max-w-[300px] my-50 mx-auto">
          <button className="game-button" onClick={createPool} type="submit">
            Create Pool
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePool;
