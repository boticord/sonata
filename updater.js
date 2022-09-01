const inviteCommand = require("./src/commands/invite");
const upCommand = require("./src/commands/up");
const commands = [inviteCommand.data, upCommand.data];

require("dotenv-flow").config();
const fetch = require("node-fetch");
fetch(
  `https://discord.com/api/v10/applications/${process.env.client_id}/commands`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bot ${process.env.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  }
)
  .then(() => console.log("* Successfully reloaded application (/) commands."))
  .catch((err) => {
    console.error("* Action failed to reload application (/) commands.");
    console.error(err.stack);
  });
