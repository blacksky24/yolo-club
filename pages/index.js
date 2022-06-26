import Head from "next/head";
import Card from "../components/Card";
import Nav from "../components/Nav";

export default function Home() {
  const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

  return (
    <div>
      <Head>
        <title>Crypto Casino | Yolo Club</title>
        <meta name="description" content="Crypto Casino" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="bg"></div>
        <Nav />

        <div className="card-container">
          <Card targetDate={dateTimeAfterThreeDays} />
          <Card targetDate={dateTimeAfterThreeDays} />
          <Card targetDate={dateTimeAfterThreeDays} />
        </div>
      </div>
    </div>
  );
}
