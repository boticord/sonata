import { respond } from "../utils";

module.exports = {
  data: {
    name: "up",
    description: "Поднять сервер на BotiCord.top",
  },
  enabled: true,
  execute: async function ({ interaction }) {
    let guild = await fetch(
      `https://discord.com/api/v10/guilds/${interaction.guild_id}?with_counts=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((r) => r.json());

    let owner = await fetch(
      `https://discord.com/api/v10/users/${guild.owner_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((r) => r.json());

    let content = [];
    let body = {
      serverID: interaction.guild_id,
      up: 1,
      status: 1,
    };
    if (guild?.code === 0 || owner?.code === 0) {
      content.push(
        `:warning: Discord API выдало блокировку, поэтому информация о сервере на сайте не обновлена.\n`
      );
    } else {
      body.serverName = guild.name;
      body.serverAvatar = `https://cdn.discordapp.com/icons/${guild.id}/${
        guild.icon
      }.${String(guild.icon).startsWith("a_") ? "gif" : "webp"}?size=512`;
      body.serverMembersAllCount = guild.approximate_member_count;
      body.serverMembersOnlineCount = guild.approximate_presence_count;
      body.serverOwnerID = owner.id;
      body.serverOwnerTag = `${owner.username}#${owner.discriminator}`;
    }

    let { updated, message } = await fetch(
      `https://api.boticord.top/v2/server`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${boticordToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    ).then((r) => r.json());

    content.push(message);
    return respond({
      type: 4,
      data: { flags: !updated ? 64 : 0, content: content.join("\n") },
    });
  },
};
