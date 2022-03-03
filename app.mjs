import express from "express";
import cors from "cors";
import dialogflow from "@google-cloud/dialogflow";

const sessionClient = new dialogflow.SessionsClient();

const port = process.env.PORT || 5757;
const app = express();

app.use(express.json());
app.use(cors());

app.post("talktochatbot", async (req, res) => {
  console.log("User Says ===>", req.body.Body);
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
