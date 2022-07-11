import Image from "next/image";
import React, { useEffect, useState } from "react";
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

function Card({
  targetDate,
  buyBullTicket,
  buyBearTicket,
  ticketPrice,
  setNoOfTicket,
}) {
  const [pool, setPool] = useState({
    id: 1,
    name: "ETH Pool",
    status: "running",
    poolOpenTime: 1234,
    poolCloseTime: 2332,
    poolDuration: 24,
    ticketPrice: 0.01,
    bettingPrice: 1200,
  });

  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  return (
    <div className="card button-bg">
      <div className="card-header">
        <img
          className="card-img"
          src="/eth.webp"
          alt="eth"
        />
        <div className="card-details">
          <p>
            On 22 July, 12:00:00 PM GMT, price of ETH will be Greater than or
            equal to {pool.bettingPrice}
          </p>
          <hr />
          <p>Pool closes in: </p>
          {days + hours + minutes + seconds <= 0 ? (
            <ExpiredNotice />
          ) : (
            <ShowCounter
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
            />
          )}
          <hr />
          <p>
            Ticke Price: <b>{ticketPrice} wei</b>
          </p>
          <hr />
          <p>
            Number of tickets -
            <select
              className="select"
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
          </p>
        </div>
      </div>

      <div className="card-cta">
        <button className="game-button green w-full" onClick={buyBullTicket}>
          <Image src="/bull.png" width={40} height={40} />
          Bull
        </button>

        <button className="game-button red w-full" onClick={buyBearTicket}>
          <Image src="/bear.png" width={40} height={40} />
          Bear
        </button>
      </div>
    </div>
  );
}

export default Card;
