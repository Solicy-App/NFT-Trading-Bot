import reservoir from "@reservoir0x/reservoir-sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as rate from "express-rate-limit";
import bodyparser from "body-parser";

dotenv.config();

const { createClient } = reservoir;

createClient({
  chains: [
    {
      id: 1,
      baseApiUrl: process.env.RESERVOIR_BASE_URL,
      default: true,
      apiKey: process.env.RESERVOIR_API_KEY,
    },
  ],
  source: "YOUR.SOURCE",
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyparser.json({ limit: "30mb" }));
app.use(
  rate.rateLimit({
    windowMs: 60 * 60 * 1000, // hour duration in milliseconds
    max: 1200,
    message: "You exceeded 1200 requests this hour, come back later!",
    headers: true,
  })
);

app.use(express.static("public"));

app.listen(process.env.PORT || 8080, () => {
  console.log("Server running on port 8080");
});
