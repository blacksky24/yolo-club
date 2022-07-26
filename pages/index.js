import Airtable from "airtable";
import axios from "axios";
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
  const [poolData, setPoolData] = useState([]);

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

  const getPoolData = () => {
    const base = new Airtable({ apiKey: "keyVYimKxVOx4feiz" }).base(
      "apprIQfulYNRE7hUL"
    );

    base("BettingPoolDB")
      .select({
        view: "Grid view",
      })
      .firstPage(function (err, records) {
        if (err) {
          console.error(err);
          return err;
        }
        let cidArr = [];
        console.log(records);
        records.map((record) => {
          console.log(record.fields.ipfsCID);
          cidArr.push(record.fields.ipfsCID);
        });

        setPoolData(cidArr);
      });
  };

  useEffect(() => {
    getTicketPrice();
    if (localStorage.getItem("walletAddress")) {
      const address = Web3.utils.toChecksumAddress(
        localStorage.getItem("walletAddress")
      );
      setWalletAddress(address);
    }

    getPoolData();

    console.log(poolData);
  }, []);

  return (
    <div>
      <Head>
        <title>Crypto Casino | Yolo Club</title>
        <meta name="description" content="Crypto Casino" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="cont">
        {/* <div className="bg"></div> */}
        <Nav title="Bulls Vs Bears" />

        <div className="card-container">
          {poolData?.map((cid) => {
            return (
              <div className="p-2 w-full">
                <Card cid={cid} walletAddress={walletAddress} buyBearTicket={buyBearTicket} buyBullTicket={buyBullTicket} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
