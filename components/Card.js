import { Button, Loading } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI } from "../constants";
import { useCountdown } from "../hooks/useCountdown";

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <p className="time">{value}</p>
      <span>{type}</span>
    </div>
  );
};

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
      <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} />
      <p>:</p>
      <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
      <p>:</p>
      <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
      <p>:</p>
      <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={false} />
    </div>
  );
};

function Card({ cid, walletAddress, buyBearTicket, buyBullTicket }) {
  const [loading, setLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState();
  const [noOfTicket, setNoOfTicket] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0);

  async function fetchCID(cid) {
    const res = await axios.get(`https://ipfs.io/ipfs/${cid}`);
    const ethValue = Web3.utils.fromWei(`${res.data?.ticketPrice}`, "ether");
    console.log(ethValue);
    setTicketPrice(ethValue);
    setPoolDetails(res.data);
    setLoading(false);
  }

  // contract intraction
  let provider = typeof window !== "undefined" && window.ethereum;

  const getContract = () => {
    const web3 = new Web3(provider);

    return new web3.eth.Contract(CONTRACT_ABI, poolDetails?.contractAddress);
  };

  // const buyBullTicket = () => {
  //   const contract = getContract();

  //   contract.methods
  //     .buyBullTicket(noOfTicket)
  //     .send({ from: walletAddress, value: noOfTicket * ticketPrice })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const buyBearTicket = () => {
  //   const contract = getContract();

  //   console.log(contract);
  //   console.log("contract address", poolDetails?.contractAddress);

  //   contract.methods
  //     .buyBearTicket(noOfTicket)
  //     .send({ from: walletAddress, value: noOfTicket * ticketPrice })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getTicketPrice = () => {
    const contract = getContract();

    contract.methods
      .ticketPrice()
      .call()
      .then((res) => {
        setTicketPrice(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCID(cid);
  }, []);

  return (
    <div className="card box">
      <div className="card-header">
        <div className="card-img flex items-center">
          {loading ? (
            <Loading />
          ) : (
            <img
              src="https://c.tenor.com/7VzBpq5zYR8AAAAd/eth.gif"
              alt="eth"
              width={"100px"}
              className="rounded-xl"
            />
          )}
        </div>

        <div className="card-details">
          <h4>
            On{" "}
            {new Date(poolDetails?.onDateTime).toLocaleString(["en-US"], {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            , price of {poolDetails?.assetName} will be{" "}
            {poolDetails?.comparision} {poolDetails?.targetPrice}{" "}
            {poolDetails?.targetPriceUnit}
          </h4>

          <div className="flex">
            <Button size="lg" color={"success"} className="mr-5 ">
            <b className="mr-2 text-black">Pool start:</b>{" "}
              {new Date(poolDetails?.openingDateTime).toLocaleString(
                ["en-US"],
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </Button>
            <Button size="lg" className="mr-5" color={"error"}>
              <b className="mr-2 text-black">Pool closes:</b>{" "}
              {new Date(poolDetails?.closingDateTime).toLocaleString(
                ["en-US"],
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </Button>

            <Button size="lg" auto>
            <b className="mr-2 text-black">Ticket Price:</b>{" "} {ticketPrice} <b className="ml-2"> {poolDetails?.ticketPriceUnit}</b>
            </Button>
          </div>
        </div>

        <div className="card-cta text-center">
          <div className=" flex">
            <div className="game-button">
              Tickets
              <select
                className="ml-5 rounded select"
                defaultValue={1}
                onChange={(e) => setNoOfTicket(e.target.value)}
              >
                <option className="option" value={1}>
                  1
                </option>
                <option className="option" value={3}>
                  3
                </option>
                <option className="option" value={5}>
                  5
                </option>
                <option className="option" value={10}>
                  10
                </option>
              </select>
            </div>
            <button
              className="game-button green w-full"
              onClick={buyBullTicket}
            >
              <Image src="/bull.png" width={40} height={40} />
              Bull
            </button>

            <button className="game-button red w-full" onClick={buyBearTicket}>
              <Image src="/bear.png" width={40} height={40} />
              Bear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
