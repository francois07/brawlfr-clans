import {
  AkairoClient,
  AkairoOptions,
  CommandHandler,
  CommandHandlerOptions,
  ListenerHandler,
  AkairoHandlerOptions,
  MongooseProvider,
} from "discord-akairo";
import { ClientOptions } from "discord.js";

import Manager from "../managers/Manager";
import ClanManager from "../managers/ClanManager";

import ClanApplication, {
  IClanApplication,
  IClanApplicationDoc,
} from "../models/ClanApplication";
import ClanMemberApplication, {
  IClanMemberApplication,
  IClanMemberApplicationDoc,
} from "../models/ClanMemberApplication";
import Settings from "../models/Settings";

interface CommandOptions extends CommandHandlerOptions {
  directory: string;
}

interface listenerOptions extends AkairoHandlerOptions {
  directory: string;
}

interface BotOptions {
  commandOptions: CommandOptions;
  listenerOptions: listenerOptions;
  prefix?: string;
}

declare module "discord-akairo" {
  interface AkairoClient {
    ClanManager: ClanManager;
    ClanApplicationManager: Manager<IClanApplication, IClanApplicationDoc>;
    ClanMemberApplicationManager: Manager<
      IClanMemberApplication,
      IClanMemberApplicationDoc
    >;
    settings: MongooseProvider;
  }
}

export class BotClient extends AkairoClient {
  public botOptions: BotOptions;
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;

  public settings = new MongooseProvider(Settings);

  public ClanManager = new ClanManager(this);
  public ClanApplicationManager = new Manager<
    IClanApplication,
    IClanApplicationDoc
  >(ClanApplication, this);
  public ClanMemberApplicationManager = new Manager<
    IClanMemberApplication,
    IClanMemberApplicationDoc
  >(ClanMemberApplication, this);

  public constructor(
    botOptions: BotOptions,
    akairoOptions?: AkairoOptions | undefined,
    discordjsOptions?: ClientOptions | undefined
  ) {
    super(akairoOptions, discordjsOptions);

    this.botOptions = botOptions;

    this.commandHandler = new CommandHandler(this, {
      directory: botOptions.commandOptions.directory,
      prefix: botOptions.prefix || "%",
      defaultCooldown: 5e3,
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: botOptions.listenerOptions.directory,
    });
  }

  private async init(): Promise<void> {
    await this.ClanManager.init();
    await this.ClanApplicationManager.init();
    await this.ClanMemberApplicationManager.init();
    await this.settings.init();

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public async start(token: string | undefined): Promise<string> {
    await this.init();
    return this.login(token);
  }
}
