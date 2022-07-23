import Airtable from "airtable";
import axios from "axios";

export const sendDataToIPFS = async (data) => {
  const config = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZWJmMmVlMS1iNWRlLTRjMGItOTllOS01MDJjZGZhZWRiOWYiLCJlbWFpbCI6InJhanNodWJoYW0yOTZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIzYzY4MTUwZjliMjViYTY4YzEzIiwic2NvcGVkS2V5U2VjcmV0IjoiODRlMDExNDhkMjAzMDU1NGI1ZWUxNzI4YTRhZmNiYmIxYmI1NzE4ZWQxMDk2MWMyZjJhZjM2OGMwNzU2NzcyNSIsImlhdCI6MTY1ODU2NzE2OH0.sLMuJplh40uLUKFfhGujGP1wb2ETPQZNlqxuYzS91iM",
    },
    data: JSON.stringify(data),
  };

  const res = await axios(config);

  const ImgHash = `${res.data.IpfsHash}`;

  return ImgHash;
};

export const sendDataToAirtable = async ({ bettingPoolAddress, ipfsCID }) => {
  const base = new Airtable({
    apiKey: "keyVYimKxVOx4feiz",
  }).base("apprIQfulYNRE7hUL");

  base("BettingPoolDB").create(
    [
      {
        fields: {
          bettingPoolAddress: bettingPoolAddress,
          ipfsCID: ipfsCID,
        },
      },
    ],
    function (err, records) {
      if (err) {
        return err;
      }
      return records;
    }
  );
};
