import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

function Admin() {
  const [commissionPercent, setCommissionPercent] = useState(0);
  const [bettingPoolStatus, setBettingPoolStatus] = useState();
  const [perTicketReturn, setPerTicketReturn] = useState(0);
  const [noOfBullTickets, setNoOfBullTickets] = useState(0);
  const [noOfBearTickets, setNoOfBearTickets] = useState(0);
  const [walletAddress, setWalletAddress] = useState();
  const [bettingPrice, setBettingPrice] = useState(0);
  const [resultPrice, setResultPrice] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [poolBalance, setPoolBalance] = useState(0);
  const [poolWinner, setPoolWinner] = useState();
  const [owner, setOwner] = useState("");

  const [currentETHPrice, setCurrentETHPrice] = useState(0);
  const [newOwner, setNewOwner] = useState("");

  let metamask = typeof window !== "undefined" && window.ethereum;

  const connectMeta = async () => {
    try {
      if (!metamask) return alert("Please Install MetaMask");

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setTicketPrice(Web3.utils.fromWei(res, "ether"));
      })
      .catch((err) => console.log(err));
  };

  const getResultPrice = () => {
    const contract = getContract();

    contract.methods
      .resultPrice()
      .call()
      .then((res) => {
        setResultPrice(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getPoolWinner = () => {
    const contract = getContract();

    contract.methods
      .poolWinner()
      .call()
      .then((res) => {
        switch (Number(res)) {
          case 0:
            setPoolWinner("TBD");
            break;
          case 1:
            setPoolWinner("BULLS");
            break;
          case 2:
            setPoolWinner("BEARS");
            break;
          case 3:
            setPoolWinner("DRAW");
        }
      })
      .catch((err) => console.log(err));
  };

  const getPerTicketReturn = () => {
    const contract = getContract();

    contract.methods
      .perTicketReturn()
      .call()
      .then((res) => {
        setPerTicketReturn(Web3.utils.fromWei(res, "ether"));
      })
      .catch((err) => console.log(err));
  };

  const getOwner = () => {
    const contract = getContract();

    contract.methods
      .owner()
      .call()
      .then((res) => {
        setOwner(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getNoOfBullTickets = () => {
    const contract = getContract();

    contract.methods
      .noOfBullTickets()
      .call()
      .then((res) => {
        setNoOfBullTickets(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getNoOfBearTickets = () => {
    const contract = getContract();

    contract.methods
      .noOfBearTickets()
      .call()
      .then((res) => {
        setNoOfBearTickets(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getPoolBalance = () => {
    const contract = getContract();

    contract.methods
      .getPoolBalance()
      .call()
      .then((res) => {
        setPoolBalance(Web3.utils.fromWei(res, "ether"));
      })
      .catch((err) => console.log(err));
  };

  const getCommissionPercentage = () => {
    const contract = getContract();

    contract.methods
      .commissionPercent()
      .call()
      .then((res) => {
        setCommissionPercent(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getBettingPrice = () => {
    const contract = getContract();

    contract.methods
      .bettingPrice()
      .call()
      .then((res) => {
        setBettingPrice(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getBettingPoolStatus = () => {
    const contract = getContract();

    contract.methods
      .bettingPoolStatus()
      .call()
      .then((res) => {
        switch (Number(res)) {
          case 0:
            setBettingPoolStatus("INACTIVE");
            break;
          case 1:
            setBettingPoolStatus("ACTIVE");
            break;
          case 2:
            setBettingPoolStatus("WAITING");
            break;
          case 3:
            setBettingPoolStatus("CLAIM");
            break;
          case 4:
            setBettingPoolStatus("COMPLETED");
        }
      })
      .catch((err) => console.log(err));
  };

  const callUpdatePoolActive = () => {
    const contract = getContract();

    contract.methods
      .updatePoolActive()
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const callUpdatePoolWaiting = () => {
    const contract = getContract();

    contract.methods
      .updatePoolWaiting()
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const callUpdatePoolCompleted = () => {
    const contract = getContract();

    contract.methods
      .updatePoolCompleted()
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const callUpdatePoolClaim = () => {
    const contract = getContract();

    contract.methods
      .updatePoolClaim(currentETHPrice)
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const callTransferCommission = () => {
    const contract = getContract();

    contract.methods
      .transferCommission()
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const callTransferOwnership = () => {
    const contract = getContract();

    contract.methods
      .transferOwnership(newOwner)
      .send({ from: walletAddress })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    address && setWalletAddress(address);

    getCommissionPercentage();
    getBettingPoolStatus();
    getPerTicketReturn();
    getNoOfBearTickets();
    getNoOfBullTickets();
    getBettingPrice();
    getPoolBalance();
    getTicketPrice();
    getResultPrice();
    getPoolWinner();
    getOwner();
  }, []);

  return (
    <div>
      <div className="cont">
        <div className="bg"></div>

        <div className="card-container">
          <h1>Contract Intractions</h1>
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

        <div className="flex items-center justify-center p-5">
          <div className="card">
            <h3>
              Ticket Price: <b>{ticketPrice} Ξ</b>
            </h3>
            <h3>
              Result Price: <b>$ {resultPrice}</b>
            </h3>
            <h3>
              Pool Winner: <b>{poolWinner}</b>{" "}
            </h3>
            <h3>
              Per Ticket Return: <b>{perTicketReturn} Ξ</b>
            </h3>
            <h3>
              Owner: <b>{`${owner.slice(0, 5)}...${owner.slice(-4)}`}</b>
            </h3>
            <h3>
              No Of Bull Tickets: <b>{noOfBullTickets}</b>
            </h3>
            <h3>
              No Of Bear Tickets: <b>{noOfBearTickets}</b>
            </h3>
            <h3>
              Pool Balance: <b>{poolBalance} Ξ</b>
            </h3>
            <h3>
              Commission Percent: <b>{commissionPercent} %</b>
            </h3>
            <h3>
              Betting Price: <b>$ {bettingPrice}</b>
            </h3>
            <h3>
              Betting Pool Status: <b>{bettingPoolStatus}</b>
            </h3>

            <div className="flex items-center">
              <button className="btn btn--light" onClick={callUpdatePoolActive}>
                Update Pool Active
              </button>

              <button
                className="btn btn--light w-full"
                onClick={callUpdatePoolWaiting}
              >
                Update Pool Waiting
              </button>
            </div>

            <div className="flex mb-1">
              <button
                className="btn btn--light"
                onClick={callUpdatePoolCompleted}
              >
                Update Pool Completed
              </button>

              <button
                className="btn btn--light"
                onClick={callTransferCommission}
              >
                Transfer Commission
              </button>
            </div>

            <div className="flex items-center bg-[#2eb086] rounded-lg mb-2">
              <input
                type={"number"}
                placeholder="current ETH price"
                className="inp"
                onChange={(e) => {
                  setCurrentETHPrice(e.target.value);
                }}
              />

              <button className="btn btn--light" onClick={callUpdatePoolClaim}>
                Update Pool Claim
              </button>
            </div>

            <div className="flex items-center bg-[#2eb086] rounded-lg">
              <input
                type={"text"}
                className="inp"
                placeholder="new owner address"
                onChange={(e) => {
                  setNewOwner(e.target.value);
                }}
              />

              <button
                className="btn btn--light"
                onClick={callTransferOwnership}
              >
                Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
