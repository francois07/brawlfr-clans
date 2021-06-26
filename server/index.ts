// Bot client & database imports
const mongoose = require("mongoose");
import { join } from "path";
import { BotClient } from "./client/BotClient";

// Express imports
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

// Express middleware imports
import { json, urlencoded } from "body-parser";
import { resolve } from "path";

// Express validator
import { checkSchema, validationResult } from "express-validator";
import type { Schema } from "express-validator";

declare module "express" {
  interface Request {
    user: any;
    logout(): any;
    isAuthenticated(): any;
  }
}

// Bot Client
const client = new BotClient(
  {
    commandOptions: { directory: join(__dirname, "client/commands") },
    listenerOptions: { directory: join(__dirname, "client/listeners") },
    prefix: "%",
  },
  { ownerID: process.env.OWNER_ID },
  { disableMentions: "everyone" }
);

// Clan Schema validator
export const ClanSchemaValidator: Schema = {
  guild_id: {
    custom: {
      options: async (guild_id, { req, location, path }) => {
        return client.guilds
          .fetch(guild_id)
          .catch((err) =>
            Promise.reject("Je ne suis pas présent sur le discord demandé")
          );
      },
    },
  },
  leader_id: {
    custom: {
      options: async (leader_id, { req, location, path }) => {
        const hasClan = await client.ClanManager.model.exists({ leader_id });
        const hasApplication = await client.ClanApplicationManager.model.exists(
          { author_id: leader_id }
        );
        if (hasClan)
          return Promise.reject("Ton clan fait déjà partie de la liste");
        if (hasApplication)
          return Promise.reject("Tu as déjà une demande en cours");
      },
    },
  },
  name: {
    isLength: {
      errorMessage: "La taille maximale d'un nom de clan est de 23",
      options: { min: 3, max: 23 },
    },
    custom: {
      options: async (name, { req, location, path }) => {
        const hasClan = await client.ClanManager.model.exists({ name });
        const hasApplication = await client.ClanManager.model.exists({
          "clan.name": name,
        });
        if (hasClan || hasApplication)
          return Promise.reject("Ce nom de clan est déjà utilisé");
      },
    },
  },
  alias: {
    isLength: {
      errorMessage: "La taille maximale d'un alias est 6",
      options: { min: 0, max: 7 },
    },
    optional: { options: { checkFalsy: true } },
    custom: {
      options: async (alias, { req, location, path }) => {
        const hasClan = await client.ClanManager.model.exists({ alias });
        const hasApplication = await client.ClanApplicationManager.model.exists(
          {
            "clan.alias": alias,
          }
        );
        if (hasClan || hasApplication)
          return Promise.reject("Cet alias est déjà utilisé");
      },
    },
  },
  discord: {
    custom: {
      options: async (discord, { req, location, path }) => {
        return client
          .fetchInvite(discord.url)
          .catch((err) => Promise.reject("Le lien d'invitation est invalide"));
      },
    },
  },
};

// API
const app = express();
app.use(json(), urlencoded({ extended: false }));

app.use("/", express.static("public"));

app.use(
  session({
    secret: process.env.CLIENT_ID,
    resave: false,
    saveUninitialized: false,
    name: "discord.oauth2",
    cookie: {
      maxAge: 6e5 * 60,
    },
  })
);
app.use(passport.initialize(), passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["identify", "guilds"],
    },
    (accessToken, refreshToken, user, done) => {
      return done(null, user);
    }
  )
);

// Routes
app.use("/auth", require("./routes/auth"));
app.post("/clans", checkSchema(ClanSchemaValidator), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.json({ message: "❌ " + errors.array()[0].msg });

  const { guild_id, leader_id, name, alias, discord, level } = req.body;

  client.ClanApplicationManager.add({
    author_id: leader_id,
    clan: {
      guild_id,
      leader_id,
      name,
      alias,
      discord,
      level,
    },
  }).catch((e) => {
    throw e;
  });

  return res.json({ message: "✔️ Demande envoyée" });
});

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("✅ Connected to database");
    client.start(process.env.BOT_TOKEN);
    app.listen(process.env.PORT, () =>
      console.log(`Listening to port ${process.env.PORT}`)
    );
  })
  .catch((err: Error) => console.log(err));
