import { MessageEmbed } from "discord.js";
import type { IClan } from "../../models/Clan";

function displayName(clan: IClan) {
  return clan.alias ? `${clan.alias} / ${clan.name}` : clan.name;
}

function displayDiscord(clan: IClan) {
  return clan.discord.private
    ? "[discord privé]"
    : `[[discord]](${clan.discord.url})`;
}

export default function getEmbedList(clans: IClan[]) {
  const clansString = clans.map(
    (clan) =>
      `${displayName(clan)} ${displayDiscord(clan)} <@${clan.leader_id}>`
  );
  const embed = new MessageEmbed()
    .setTitle("Liste des clans présents sur le Discord")
    .setDescription(clansString.join("\n"))
    .setFooter(
      "Envie d'ajouter votre clan à la liste? Veillez à bien respecter les conditions puis faite une demande avec le bot BRAWL-BOT!"
    );
  return embed;
}
