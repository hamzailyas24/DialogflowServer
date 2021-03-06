import express from "express";
import cors from "cors";
import dialogflow from "@google-cloud/dialogflow";
import axios from "axios";
import {
  WebhookClient,
  Card,
  Suggestion,
  Image,
  Payload,
} from "dialogflow-fulfillment";

const sessionClient = new dialogflow.SessionsClient();

const port = process.env.PORT || 5757;
const app = express();

app.use(express.json());
app.use(cors());

app.post("/talktochatbot", async (req, res) => {
  console.log("User Request ===>", req.body.Body);
  const projectId = "weather-app-tfos";
  const sessionId = req.body.sessionId || "session12345";
  const query = req.body.text;
  const languageCode = "en-US";

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath, // Session ID, should be unique for every conversation
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);

  res.send({
    text: responses[0].queryResult.fulfillmentText,
  });
});

app.post("/webhook", (req, res) => {
  const _agent = new WebhookClient({ request: req, response: res });

  async function askWeather(agent) {
    const cityName = agent.parameters.cityName;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8bd6abdc20db1f463412a5c9df7dc7d7&units=metric`;
    try {
      const response = await axios.get(URL);
      const data = response.data;
      const temp = data.main.temp;
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      const feelsLike = data.main.feels_like;
      const responseText = `The Current Temperature Of ${cityName} is ${temp}°C. Feels Like ${feelsLike}°C. Humidity is ${humidity}% and Wind is ${wind} km/h.`;
      agent.add(responseText);
    } catch (error) {
      console.error("ERROR in API Call ===>: ", error);
    }
  }

  var intentMap = new Map();

  intentMap.set("AskWeather", askWeather);

  _agent.handleRequest(intentMap);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/home", (req, res) => {
  res.send("Welcome to home");
});

app.get("/profile", (req, res) => {
  res.send("Welcome to profile");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
