const respond = (response, status = 200) =>
  new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Content-Encoding": "identity",
    },
  });

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
      `https://discord.com/api/v10/guilds/${guild.id}/members/${guild.owner_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((r) => r.json());

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
          serverOwnerID: owner.user.id,
          serverOwnerTag: `${owner.user.username}#${owner.user.discriminator}`,
        }),
      }
    ).then((r) => r.json());

    return respond({
      type: 4,
      data: { flags: !updated ? 64 : 0, content },
    });
  },
};
