const mongoose = require("mongoose");
import { join } from "path";
import { BotClient } from "./server/client/BotClient";

const client = new BotClient(
  {
    commandOptions: { directory: join(__dirname, "server/client/commands") },
    listenerOptions: { directory: join(__dirname, "server/client/listeners") },
    prefix: "%",
  },
  { ownerID: process.env.OWNER_ID },
  { disableMentions: "everyone" }
);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("✅ Connected to database");
    client.start(process.env.BOT_TOKEN);
  })
  .catch((err: Error) => console.log(err));
