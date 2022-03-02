import express from "express";
import cors from "cors";
import dialogflow from "@google-cloud/dialogflow";

const sessionClient = new dialogflow.SessionsClient();

const port = process.env.PORT || 5757;
const app = express();

app.use(express.json());
app.use(cors());

app.post("talktochatbot", async (req, res) => {
  const projectId = "weather-app-tfos";
  const sessionId = req.body.sessionId || "session12345";
  const query = 'Hello';
  const languageCode = "en-US";

  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath, // Session path
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      }
    }
  };

  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult.fulfillmentText

  res.send({
    text: result
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
