import { Listener } from "discord-akairo";
import type { IClanApplicationDoc } from "../../models/ClanApplication";
import { MessageEmbed } from "discord.js";

export default class ClanApplicationAddListener extends Listener {
  constructor() {
    super("addClanApplication", {
      emitter: "clanApplicationManager",
      event: "addItem",
    });
  }

  public async exec(newApplication: IClanApplicationDoc): Promise<void> {
    const { clan } = newApplication;
    try {
      const guild = await this.client.guilds.fetch(clan.guild_id);
      const support_role_id = this.client.settings.get(
        guild.id,
        "support_role_id",
        undefined
      );
      if (!support_role_id) return;
      const channel = await guild.channels.create(
        `clan-${newApplication.id.substr(-5)}`,
        {
          type: "text",
          reason: "new clan application",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: support_role_id,
              allow: ["VIEW_CHANNEL"],
            },
            {
              id: clan.leader_id,
              allow: ["VIEW_CHANNEL"],
            },
          ],
        }
      );
      const leader = await guild.members.fetch(clan.leader_id);
      const avatar = leader.user.avatarURL();
      const embed = new MessageEmbed()
        .setDescription(
          `Utilisez la commande \`%ac <ID>\` pour accepter une demande, ou \`%dc <ID>\` pour la refuser`
        )
        .setTitle(`Clan de ${leader.user.tag}`)
        .addField(
          "Nom",
          clan.alias ? `${clan.alias} / ${clan.name}` : clan.name
        )
        .addField("Discord", clan.discord.private ? "Privé" : clan.discord.url)
        .addField("Niveau", clan.level)
        .setFooter(`ID: ${newApplication.id}`);
      if (avatar) embed.setThumbnail(avatar!);

      newApplication.embed_id = channel.id;
      await newApplication.save();

      channel.send(embed);
    } catch (err) {
      throw err;
    }
  }
}
