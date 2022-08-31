const testMode = false;
import { verifyKey } from "discord-interactions";

import inviteCommand from "./commands/invite";
import upCommand from "./commands/up";
const commands = [inviteCommand, upCommand];

const respond = (response, status = 200) =>
  new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Content-Encoding": "identity",
    },
  });

addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

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
        content: `Команда неактивна или отключена администратором.`,
      },
    });

  return command.execute({ interaction });
}

async function handleRequest(request) {
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
    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    if (!signature || !timestamp)
      return Response.redirect("https://boticord.top");

    const interaction = await request.json();
    if (
      !(await verifyKey(
        JSON.stringify(interaction),
        signature,
        timestamp,
        publicKey
      ))
    )
      return respond({ ok: false }, 401);

    return executeInteraction(interaction);
  }
}
