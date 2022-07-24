import { Loading } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Nav from "../components/Nav";
import NewPoolCreated from "../components/NewPoolCreated";
import { CREATOR_CONTRACT_ABI, CREATOR_CONTRACT_ADDRESS } from "../constants";
import { sendDataToAirtable, sendDataToIPFS } from "../utils/PostData";

function CreatePool() {
  const [walletAddress, setWalletAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  // contract intraction
  let provider = typeof window !== "undefined" && window.ethereum;

  const getContract = () => {
    const web3 = new Web3(provider);

    return new web3.eth.Contract(
      CREATOR_CONTRACT_ABI,
      CREATOR_CONTRACT_ADDRESS
    );
  };

  const createPool = (bettingPrice, ticketPrice, commissionPercent) => {
    const contract = getContract();

    console.log(contract);

    return contract.methods
      .createPool(bettingPrice, ticketPrice, commissionPercent)
      .send({ from: walletAddress });
  };

  const getContractAddress = () => {
    const contract = getContract();

    return contract.methods
      .deployedContract()
      .call()
  };

  useEffect(() => {
    if (localStorage.getItem("walletAddress")) {
      const address = Web3.utils.toChecksumAddress(
        localStorage.getItem("walletAddress")
      );
      setWalletAddress(address);
    }
  }, []);

  // -----------
  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const {
      onDateTime,
      assetName,
      assetType,
      comparision,
      targetPrice,
      targetPriceUnit,
      openingDateTime,
      closingDateTime,
      ticketPrice,
      ticketPriceUnit,
    } = e.target;

    if (ticketPrice.value != "" && ticketPrice.value > 0) {
      const weiValue = Web3.utils.toWei(`${ticketPrice.value}`, "ether");
      ticketPrice = weiValue;
    }

    const data = {
      onDateTime: onDateTime.value,
      assetName: assetName.value,
      assetType: assetType.value,
      comparision: comparision.value,
      targetPrice: targetPrice.value,
      targetPriceUnit: targetPriceUnit.value,
      openingDateTime: openingDateTime.value,
      closingDateTime: closingDateTime.value,
      ticketPrice: ticketPrice,
      ticketPriceUnit: ticketPriceUnit.value,
    };

    // TASK 0: Create Pool
    console.log("task 0 :: started");
    const resp = await createPool(targetPrice.value, ticketPrice, "10");
    console.log(resp);

    console.log("task 0 :: ended");
    console.log("task 1 :: started");

    // TASK 1: Get deployed pool contract address
    const cAddress = await getContractAddress();
    data.contractAddress = cAddress;

    console.log("deployed contract address", cAddress);

    console.log("task 1 :: ended");

    // TASK 2: send data to IPFS
    const IPFSHash = await sendDataToIPFS(data);

    // TASK 3: send data to Airtable
    const res = sendDataToAirtable({ bettingPoolAddress: cAddress, ipfsCID: IPFSHash });

    setLoading(false);

    alert(`New Betting pool is created address: ${cAddress}`)
  };

  return (
    <div className="cont">
      <Nav title="Create Pool" />

      <form onSubmit={handleFormSubmit} className="p-[50px]">
        <div className="heading-input text-center button-bg">
          On
          <input
            className="inp"
            name="onDateTime"
            type="datetime-local"
            required
          />
          , price of
          <select className="inp" name="assetName" defaultValue={"ethereum"}>
            <option value={"ethereum"}>Ethereum</option>
            <option value={"solana"}>Solana</option>
          </select>
          <select className="inp" name="assetType" defaultValue={"crypto"}>
            <option value={"crypto"}>Crypto</option>
          </select>{" "}
          will be
          <select className="inp" name={"comparision"} defaultValue={"> or ="}>
            <option value="> or ="> {"> or ="} </option>
            {/* <option> {"<"} </option> */}
          </select>
          <input
            className="inp"
            type={"number"}
            required
            placeholder="amount"
            name="targetPrice"
          />
          <select className="inp" name="targetPriceUnit" defaultValue={"USDT"}>
            <option value={"USDT"}>USDT</option>
            <option disabled value={"USD"}>
              USD
            </option>
            <option disabled value={"USDC"}>
              USDC
            </option>
          </select>
        </div>

        <div className="flex mx-10 my-[100px] justify-center">
          <div className="button-bg rounded-lg mx-5">
            <p>Opening time</p>
            <input
              placeholder="current ETH price"
              className="inp"
              type="datetime-local"
              name="openingDateTime"
              required
            />
          </div>

          <div className="button-bg rounded-lg mx-5">
            <p>Closing time</p>
            <input
              type={"datetime-local"}
              placeholder="current ETH price"
              className="inp"
              name="closingDateTime"
              required
            />
          </div>

          <div className="button-bg rounded-lg mx-5">
            <p>Ticket Price</p>
            <div className="flex">
              <input
                type={"text"}
                placeholder="ticket price"
                className="inp"
                name="ticketPrice"
                required
              />

              <select
                className="inp"
                name="ticketPriceUnit"
                defaultValue={"ETH"}
              >
                <option value={"ETH"}>ETH</option>
                <option value={"SOL"}>SOL</option>
                <option value={"USDC"}>USDC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex max-w-[300px] justify-center my-50 mx-auto">
          {loading ? (
            <button className="game-button" disabled>
              <Loading type="default" color="secondary" className="mr-5" />
              Creating...
            </button>
          ) : (
            <button className="game-button" type="submit">
              Create Pool
            </button>
          )}
        </div>
      </form>

      {showPopup && (
        <NewPoolCreated details="detils" contractAddress={"0xasdw"} />
      )}
    </div>
  );
}

export default CreatePool;
