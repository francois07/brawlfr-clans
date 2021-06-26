import { Listener } from "discord-akairo";
import type { Message, DMChannel, GuildChannel } from "discord.js";
import type { IClanDoc } from "../../models/Clan";

export default class ChannelDeleteListener extends Listener {
  constructor() {
    super("channelDelete", {
      emitter: "client",
      event: "channelDelete",
    });
  }

  public async exec(channel: DMChannel | GuildChannel): Promise<void> {
    try {
      const clanApplication = await this.client.ClanApplicationManager.model
        .findOne({
          embed_id: channel.id,
        })
        .catch((e) => null);
      if (clanApplication) {
        this.client.ClanApplicationManager.remove(clanApplication.id);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
