const testMode = false;
import { verify, respond } from "./utils";

import inviteCommand from "./commands/invite";
import upCommand from "./commands/up";
const commands = [inviteCommand, upCommand];

function executeInteraction(interaction) {
  if (interaction.type === 1) return respond({ type: 1 });

  let command = commands.find(
    (command) => command.data.name === interaction.data.name
  );
  if (!command || (command && !command.enabled))
    return respond({
      type: 4,
      data: {
        flags: 64,
        content: "Такой команды нет или она отключена администратором.",
      },
    });

  return command.execute({ interaction });
}

async function handleRequest(event) {
  let { request } = event;
  if (testMode) {
    if (request.headers.get("X-Development-Token") !== devToken)
      return Response.redirect("https://boticord.top");

    return executeInteraction({
      type: 2,
      application_id: client_id,
      data: { name: request.headers.get("X-Development-Command") },
      guild_id: request.headers.get("X-Development-Guild"),
    });
  } else {
    if (
      !request.headers.get("X-Signature-Ed25519") ||
      !request.headers.get("X-Signature-Timestamp")
    )
      return Response.redirect("https://boticord.top");
    if (!(await verify(request))) return respond({ ok: false }, 401);

    const interaction = await request.json();
    return executeInteraction(interaction);
  }
}

module.exports = { handleRequest };
