import Head from "next/head";
import { useEffect, useState } from "react";
import Web3 from "web3";
import Card from "../components/Card";
import Nav from "../components/Nav";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

  const [noOfTicket, setNoOfTicket] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);

  // contract intraction
  let provider = typeof window !== "undefined" && window.ethereum;

  const getContract = () => {
    const web3 = new Web3(provider);

    return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  };

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

  const buyBullTicket = () => {
    const contract = getContract();

    contract.methods
      .buyBullTicket(noOfTicket)
      .send({ from: walletAddress, value: noOfTicket * ticketPrice })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const buyBearTicket = () => {
    const contract = getContract();

    contract.methods
      .buyBearTicket(noOfTicket)
      .send({ from: walletAddress, value: noOfTicket * ticketPrice })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTicketPrice();
    if (localStorage.getItem("walletAddress")) {
      const address = Web3.utils.toChecksumAddress(
        localStorage.getItem("walletAddress")
      );
      setWalletAddress(address);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Crypto Casino | Yolo Club</title>
        <meta name="description" content="Crypto Casino" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="cont">
        <div className="bg"></div>
        <Nav />

        <div className="card-container">
          <div className="p-2">
            <Card
              targetDate={dateTimeAfterThreeDays}
              buyBullTicket={buyBullTicket}
              buyBearTicket={buyBearTicket}
              setNoOfTicket={setNoOfTicket}
              ticketPrice={ticketPrice}
            />
          </div>
          <div className="p-2">
            <Card
              targetDate={dateTimeAfterThreeDays}
              buyBullTicket={buyBullTicket}
              buyBearTicket={buyBearTicket}
              setNoOfTicket={setNoOfTicket}
              ticketPrice={ticketPrice}
            />
          </div>
          <div className="p-2">
            <Card
              targetDate={dateTimeAfterThreeDays}
              buyBullTicket={buyBullTicket}
              buyBearTicket={buyBearTicket}
              setNoOfTicket={setNoOfTicket}
              ticketPrice={ticketPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
