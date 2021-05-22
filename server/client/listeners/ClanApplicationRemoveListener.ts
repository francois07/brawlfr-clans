import { Listener } from "discord-akairo";
import type { IClanApplicationDoc } from "../../models/ClanApplication";

export default class ClanApplicationRemoveListener extends Listener {
  constructor() {
    super("removeClanApplication", {
      emitter: "clanApplicationManager",
      event: "deleteItem",
    });
  }

  public async exec(deletedApplication: IClanApplicationDoc): Promise<void> {
    const { clan } = deletedApplication;
    if (!deletedApplication.embed_id) return;
    try {
      const guild = await this.client.guilds.fetch(clan.guild_id);
      const channel = await guild.channels.resolve(deletedApplication.embed_id);
      if (channel) await channel.delete("Application denied");
    } catch (err) {
      throw err;
    }
  }
}
