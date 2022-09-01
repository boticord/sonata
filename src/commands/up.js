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

    if (guild?.code === 0 || owner?.code === 0)
      return respond({
        type: 4,
        data: {
          flags: 64,
          content:
            ":x: Команда не может быть выполнена в связи с блокировкой на стороне Discord API.\nВы всегда можете воспользоваться **BumpBot**: https://boticord.top/bot/bump",
        },
      });

    let { updated, message: content } = await fetch(
      `https://api.boticord.top/v2/server`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${boticordToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverID: guild.id,
          up: 1,
          status: 1,
          serverName: guild.name,
          serverAvatar: `https://cdn.discordapp.com/icons/${guild.id}/${
            guild.icon
          }.${String(guild.icon).startsWith("a_") ? "gif" : "webp"}?size=512`,
          serverMembersAllCount: guild.approximate_member_count,
          serverMembersOnlineCount: guild.approximate_presence_count,
          serverOwnerID: owner.id,
          serverOwnerTag: `${owner.username}#${owner.discriminator}`,
        }),
      }
    ).then((r) => r.json());

    return respond({
      type: 4,
      data: { flags: !updated ? 64 : 0, content },
    });
  },
};
